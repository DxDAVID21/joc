<?php
// NOSONAR: necessary require for database connection
require_once __DIR__ . '/connexio.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    echo json_encode(['error' => 'No ets admin']);
    exit;
}

$stmt = $pdo->query("
    SELECT p.id_pregunta, p.text_pregunta, p.imatge,
           r.id_resposta, r.text_resposta, r.correcta
    FROM preguntes p
    JOIN respostes r ON p.id_pregunta = r.id_pregunta
    ORDER BY p.id_pregunta, r.id_resposta
");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$preguntes = [];
foreach ($rows as $row) {
    $id = $row['id_pregunta'];
    if (!isset($preguntes[$id])) {
        $preguntes[$id] = [
            'id' => $id,
            'pregunta' => $row['text_pregunta'],
            'imatge' => $row['imatge'],
            'respostes' => []
        ];
    }
    $preguntes[$id]['respostes'][] = [
        'id' => $row['id_resposta'],
        'resposta' => $row['text_resposta'],
        'correcta' => (bool)$row['correcta']
    ];
}

echo json_encode(array_values($preguntes));
