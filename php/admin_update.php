<?php
require_once __DIR__ . '/connexio.php';

header('Content-Type: application/json; charset=utf-8');

// Solo admin puede usarlo
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    echo json_encode(['error' => 'No ets admin']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'], $data['pregunta'], $data['imatge'], $data['respostes'], $data['correctaIndex'])) {
    echo json_encode(['error' => 'Dades incompletes']);
    exit;
}

$id_pregunta = intval($data['id']);
$pregunta = $data['pregunta'];
$imatge = $data['imatge'];
$respostes = $data['respostes'];
$correctaIndex = intval($data['correctaIndex']);

$pdo->beginTransaction();
try {
    // Actualizar la pregunta
    $stmt = $pdo->prepare("UPDATE preguntes SET text_pregunta = ?, imatge = ? WHERE id_pregunta = ?");
    $stmt->execute([$pregunta, $imatge, $id_pregunta]);

    // Borramos respuestas viejas y volvemos a insertar
    $stmt = $pdo->prepare("DELETE FROM respostes WHERE id_pregunta = ?");
    $stmt->execute([$id_pregunta]);

    foreach ($respostes as $i => $resposta) {
        $correcta = ($i == $correctaIndex) ? 1 : 0;
        $stmt = $pdo->prepare("INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES (?, ?, ?)");
        $stmt->execute([$id_pregunta, $resposta, $correcta]);
    }

    $pdo->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
