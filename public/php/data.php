<?php
require 'connexio.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Si no hay preguntas en sesión, sacamos aleatoria
    if (!isset($_SESSION['preguntas'])) {
        $stmt = $pdo->query("SELECT id_pregunta FROM preguntes ORDER BY RAND() LIMIT 10");
        $_SESSION['preguntas'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $_SESSION['indiceActual'] = 0;
        $_SESSION['puntuacio'] = 0;
    }

    $indice = $_SESSION['indiceActual'];
    $preguntas = $_SESSION['preguntas'];

    if ($indice >= count($preguntas)) {
        echo json_encode(['error' => 'No hi ha més preguntes']);
        exit;
    }

    $pregunta_id = $preguntas[$indice];

    // Sacamos pregunta y sus respuestas
    $stmt = $pdo->prepare("
        SELECT p.id_pregunta, p.text_pregunta AS pregunta, p.imatge, r.id_resposta AS resposta_id, r.text_resposta AS resposta
        FROM preguntes p
        JOIN respostes r ON p.id_pregunta = r.id_pregunta
        WHERE p.id_pregunta = ?
    ");
    $stmt->execute([$pregunta_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$rows) {
        echo json_encode(['error' => 'Pregunta no trobada']);
        exit;
    }

    $pregunta = [
        'indice' => $indice,
        'total' => count($preguntas),
        'id' => $rows[0]['id_pregunta'],
        'pregunta' => $rows[0]['pregunta'],
        'imatge' => $rows[0]['imatge'],
        'respostes' => []
    ];

    foreach ($rows as $row) {
        $pregunta['respostes'][] = [
            'id' => $row['resposta_id'],
            'resposta' => $row['resposta']
        ];
    }

    echo json_encode($pregunta);

} catch (Exception $e) {
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}
