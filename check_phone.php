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

if (!$data || !isset($data['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Не указан номер телефона']);
    exit;
}

$phone = $data['phone'];

// Путь к файлу с данными
$dataFile = __DIR__ . '/rsvps.json';

// Проверяем существование файла
if (!file_exists($dataFile)) {
    echo json_encode(['exists' => false]);
    exit;
}

// Читаем данные
$rsvps = json_decode(file_get_contents($dataFile), true) ?: [];

// Нормализуем номер телефона для сравнения (убираем все нецифровые символы кроме +)
$normalizePhone = function($phone) {
    return preg_replace('/[^\d+]/', '', $phone);
};

$normalizedSearchPhone = $normalizePhone($phone);

// Ищем анкету с таким телефоном
$existingRSVP = null;
foreach ($rsvps as $rsvp) {
    if (isset($rsvp['phone'])) {
        $normalizedRSVPPhone = $normalizePhone($rsvp['phone']);
        if ($normalizedRSVPPhone === $normalizedSearchPhone) {
            $existingRSVP = $rsvp;
            break;
        }
    }
}

if ($existingRSVP) {
    echo json_encode([
        'exists' => true,
        'rsvp' => $existingRSVP
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['exists' => false]);
}
?>

