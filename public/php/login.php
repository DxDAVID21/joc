<?php
require 'connexio.php';

header('Content-Type: application/json; charset=utf-8');

// Comprobar si llegaron los datos
if (!isset($_POST['email'], $_POST['password'])) {
    echo json_encode(['success' => false, 'message' => 'Falten dades']);
    exit;
}

$email = trim($_POST['email']);
$password = trim($_POST['password']);

// Buscar al usuario en la base de datos
$stmt = $pdo->prepare("SELECT id, email, password, rol FROM usuaris WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

//Cambiar a password_hash, cuando lo tenga en producción !!!!!
if ($user && $password === $user['password']) {
    if ($user['rol'] === 'admin') {
        // Guardar sesión
        $_SESSION['admin'] = true;
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['success' => true, 'rol' => 'admin']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No tens permisos d\'admin']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Credencials incorrectes']);
}
