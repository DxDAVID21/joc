<?php
require_once 'connexio.php';
header('Content-Type: application/json');

unset($_SESSION['preguntas']);
unset($_SESSION['indiceActual']);
unset($_SESSION['puntuacio']);

echo json_encode(['status' => 'ok']);

