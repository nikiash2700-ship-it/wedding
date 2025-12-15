<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем, что запрос POST или DELETE
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

// Получаем данные из запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Не указан ID анкеты']);
    exit;
}

$rsvpId = $data['id'];

// Путь к файлу с данными
$dataFile = __DIR__ . '/rsvps.json';

// Проверяем существование файла
if (!file_exists($dataFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Файл с данными не найден']);
    exit;
}

// Читаем существующие данные
$rsvps = json_decode(file_get_contents($dataFile), true) ?: [];

// Ищем и удаляем анкету
$found = false;
$rsvps = array_filter($rsvps, function($rsvp) use ($rsvpId, &$found) {
    if (isset($rsvp['id']) && $rsvp['id'] === $rsvpId) {
        $found = true;
        return false; // Удаляем этот элемент
    }
    return true;
});

// Переиндексируем массив
$rsvps = array_values($rsvps);

if (!$found) {
    http_response_code(404);
    echo json_encode(['error' => 'Анкета не найдена']);
    exit;
}

// Сохраняем обратно в файл
$result = file_put_contents($dataFile, json_encode($rsvps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при сохранении данных']);
    exit;
}

// Возвращаем успешный ответ
echo json_encode([
    'success' => true,
    'message' => 'Анкета успешно удалена'
], JSON_UNESCAPED_UNICODE);
?>

