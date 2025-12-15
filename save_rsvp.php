<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем, что запрос POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

// Получаем данные из POST запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный формат данных']);
    exit;
}

// Путь к файлу с данными
$dataFile = __DIR__ . '/rsvps.json';

// Читаем существующие данные
$rsvps = [];
if (file_exists($dataFile)) {
    $existingData = file_get_contents($dataFile);
    $rsvps = json_decode($existingData, true) ?: [];
}

// Добавляем timestamp, если его нет
if (!isset($data['timestamp'])) {
    $data['timestamp'] = date('c'); // ISO 8601 формат
}

// Добавляем ID для каждой анкеты
$data['id'] = uniqid('rsvp_', true);

// Добавляем новую анкету
$rsvps[] = $data;

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
    'id' => $data['id'],
    'message' => 'Анкета успешно сохранена'
], JSON_UNESCAPED_UNICODE);
?>

