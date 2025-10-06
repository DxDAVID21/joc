<?php
require 'connexio.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_POST['resposta'], $_SESSION['preguntas'], $_SESSION['indiceActual'], $_SESSION['puntuacio'])) {
    echo json_encode(['error' => 'Dades no vàlides']);
    exit;
}

//Guardem les dades importants en variables
$respostaUsuari = intval($_POST['resposta']);
$indice = $_SESSION['indiceActual'];
$preguntas = $_SESSION['preguntas'];
$puntuacio = $_SESSION['puntuacio'];

if (!isset($preguntas[$indice])) {
    echo json_encode(['error' => 'Índex de pregunta invàlid']);
    exit;
}

$pregunta_id = $preguntas[$indice];


//Verifiquem si la resposta es correcta en la BD
$stmt = $pdo-> prepare("SELECT correcta FROM respostes WHERE id_resposta = ? AND id_pregunta = ?");
$stmt ->execute([$respostaUsuari, $pregunta_id]);
$correcta = (bool) $stmt-> fetchColumn();

//Si es correcta augmentem en un 1 la puntuació
if ($correcta) $puntuacio++;

//Guardem la puntuació si ha sigut correcta y pasem a la següent pregunta
$_SESSION['puntuacio'] = $puntuacio;
$_SESSION['indiceActual']++;


$acabado = $_SESSION['indiceActual'] >= count($preguntas);

$siguiente = null;

if (!$acabado) {
    $stmt = $pdo-> prepare("
        SELECT p.id_pregunta, p.text_pregunta AS pregunta, p.imatge, r.id_resposta AS id, r.text_resposta AS resposta
        FROM preguntes p 
        JOIN respostes r ON p.id_pregunta = r.id_pregunta
        WHERE p.id_pregunta = ?
    ");

    $stmt-> execute([$preguntas[$_SESSION['indiceActual']]]);
    $rows = $stmt-> fetchAll(PDO::FETCH_ASSOC);

    if ($rows) {
        $siguiente = [
            'id' => $rows[0]['id_pregunta'],
            'pregunta' => $rows[0]['pregunta'],
            'imatge' => $rows[0]['imatge'],
            'respostes' => []
        ];
        foreach ($rows as $row) {
            $siguiente['respostes'][] = [
                'id' => $row['id'],
                'resposta' => $row['resposta']
            ];
        }
        //S'utilitza per mezclar les repostes
        shuffle($siguiente['respostes']);
    }

}

//Finalment enviem l'informació mitjançant un codi JSON
echo json_encode([
    'acabat' => $acabado,
    'correcte' => $correcta,
    'pregunta' => $siguiente['pregunta'] ?? '',
    'imatge' => $siguiente['imatge'] ?? null,
    'respostes' => $siguiente['respostes'] ?? [],
    'indice' => $_SESSION['indiceActual'],
    'total' => count($preguntas),
    'puntuacioActual' => $puntuacio
]);
