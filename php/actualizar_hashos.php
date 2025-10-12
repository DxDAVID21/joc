<?php
require_once 'connexio.php';

$result = $conn->query("SELECT id, password FROM usuaris");

while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $contrasenya = $row['password'];

    // Si encara no és un hash
    if (strlen($contrasenya) < 20) {
        $hash = password_hash($contrasenya, PASSWORD_DEFAULT);
        $update = $conn->prepare("UPDATE usuaris SET password = ? WHERE id = ?");
        $update->bind_param("si", $hash, $id);
        $update->execute();
    }
}

echo "Contrasenyes encriptades correctament.";
