<?php
// Conexió amb variables d'entorn (passen des de .env)
// array_map(fn($line) => putenv(trim($line)), file(__DIR__.'/.env'));

foreach (file(__DIR__ . "/.env", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line){
    if (str_contains($line, '=')) {
        putenv($line);
    }
}
$host = getenv("DB_HOST");
$db   = getenv("DB_NAME");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Error de connexió: " . $e->getMessage()]));
}

session_start();
