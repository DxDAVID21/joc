<?php
require 'connexio.php';
header('Content-Type: application/json; charset=utf-8');

// Solo admin puede usarlo
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    echo json_encode(['error' => 'No ets admin']);
    exit;
}

// Recibir datos en JSON
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(['error' => 'Falten dades']);
    exit;
}

$id = intval($data['id']);

try {
    // Primero borrar respuestas asociadas
    $stmt = $pdo->prepare("DELETE FROM respostes WHERE id_pregunta = ?");
    $stmt->execute([$id]);

    // Luego borrar la pregunta
    $stmt = $pdo->prepare("DELETE FROM preguntes WHERE id_pregunta = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
