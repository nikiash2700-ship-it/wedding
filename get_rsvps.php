<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Путь к файлу с данными
$dataFile = __DIR__ . '/rsvps.json';

// Проверяем существование файла
if (!file_exists($dataFile)) {
    echo json_encode([], JSON_UNESCAPED_UNICODE);
    exit;
}

// Читаем данные
$data = file_get_contents($dataFile);
$rsvps = json_decode($data, true) ?: [];

// Возвращаем данные
echo json_encode($rsvps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>

