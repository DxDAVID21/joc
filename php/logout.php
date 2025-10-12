<?php
// NOSONAR: necessary require for database connection
require_once __DIR__ . '/connexio.php';

header('Content-Type: application/json');

// Destruir la sesión
session_unset();
session_destroy();

// Devolver una respuesta JSON válida
echo json_encode(['success' => true, 'message' => 'Sessió tancada correctament']);
exit;
