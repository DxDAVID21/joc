<?php
// NOSONAR: necessary require for database connection
require_once __DIR__ . '/connexio.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    echo json_encode(['error' => 'No ets admin']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['error' => 'Dades invàlides']);
    exit;
}

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare("INSERT INTO preguntes (text_pregunta, imatge) VALUES (?, ?)");
    $stmt->execute([$data['pregunta'], $data['imatge']]);
    $id_pregunta = $pdo->lastInsertId();

    foreach ($data['respostes'] as $i => $resposta) {
        $correcta = ($i == $data['correctaIndex']) ? 1 : 0;
        $stmt = $pdo->prepare("INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES (?, ?, ?)");
        $stmt->execute([$id_pregunta, $resposta, $correcta]);
    }

    $pdo->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
