<?php
// NOSONAR: necessary require for database connection
require_once __DIR__ . '/connexio.php';

header('Content-Type: application/json');

unset($_SESSION['preguntas']);
unset($_SESSION['indiceActual']);
unset($_SESSION['puntuacio']);

echo json_encode(['status' => 'ok']);
