SET NAMES utf8mb4;

-- Crear la base de dades
CREATE DATABASE IF NOT EXISTS banderes_quiz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON banderes_quiz.* TO 'usuari'@'%';
FLUSH PRIVILEGES;

USE banderes_quiz;

CREATE TABLE usuaris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) unique NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'usuari') DEFAULT 'usuari'
);

-- Taula de preguntes
CREATE TABLE preguntes (
  id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
  text_pregunta VARCHAR(255) NOT NULL,
  imatge VARCHAR(255)
);

-- Taula de respostes
CREATE TABLE respostes (
  id_resposta INT AUTO_INCREMENT PRIMARY KEY,
  id_pregunta INT NOT NULL,
  text_resposta VARCHAR(255) NOT NULL,
  correcta BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (id_pregunta) REFERENCES preguntes(id_pregunta) ON DELETE CASCADE
);

-- Inserir un admin
INSERT INTO usuaris (nom,email,password,rol) 
VALUES ('Admin','admin@quiz.com', 'admin123', 'admin');

-- Inserir preguntes
INSERT INTO preguntes (id_pregunta, text_pregunta, imatge) VALUES
(1, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg'),
(2, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg'),
(3, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg'),
(4, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg'),
(5, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg'),
(6, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg'),
(7, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg'),
(8, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg'),
(9, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg'),
(10, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg'),
(11, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg'),
(12, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg'),
(13, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'),
(14, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg'),
(15, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg'),
(16, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg'),
(17, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg'),
(18, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg'),
(19, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg'),
(20, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'),
(21, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg'),
(22, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg'),
(23, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg'),
(24, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg'),
(25, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg'),
(26, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg'),
(27, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg'),
(28, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Slovakia.svg'),
(29, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg'),
(30, 'De quin país és aquesta bandera?', 'https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg');

-- Pregunta 1 (França)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(1, 'Països Baixos', 0),
(1, 'França', 1),
(1, 'Argentina', 0),
(1, 'Nepal', 0);

-- Pregunta 2 (Japó)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(2, 'Xina', 0),
(2, 'Japó', 1),
(2, 'Corea del Sud', 0),
(2, 'Vietnam', 0);

-- Pregunta 3 (Brasil)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(3, 'Argentina', 0),
(3, 'Brasil', 1),
(3, 'Colòmbia', 0),
(3, 'Portugal', 0);

-- Pregunta 4 (Alemanya)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(4, 'Bèlgica', 0),
(4, 'Alemanya', 1),
(4, 'Espanya', 0),
(4, 'Àustria', 0);

-- Pregunta 5 (Índia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(5, 'Bangladesh', 0),
(5, 'Índia', 1),
(5, 'Pakistan', 0),
(5, 'Nepal', 0);

-- Pregunta 6 (Canadà)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(6, 'Estats Units', 0),
(6, 'Canadà', 1),
(6, 'Austràlia', 0),
(6, 'Regne Unit', 0);

-- Pregunta 7 (Mèxic)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(7, 'Itàlia', 0),
(7, 'Mèxic', 1),
(7, 'Espanya', 0),
(7, 'Portugal', 0);

-- Pregunta 8 (Rússia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(8, 'Sèrbia', 0),
(8, 'Rússia', 1),
(8, 'Txèquia', 0),
(8, 'Eslovàquia', 0);

-- Pregunta 9 (Sud-àfrica)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(9, 'Kenya', 0),
(9, 'Sud-àfrica', 1),
(9, 'Nigèria', 0),
(9, 'Egipte', 0);

-- Pregunta 10 (Austràlia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(10, 'Nova Zelanda', 0),
(10, 'Austràlia', 1),
(10, 'Regne Unit', 0),
(10, 'Canadà', 0);

-- Pregunta 11 (Regne Unit)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(11, 'Estats Units', 0),
(11, 'Regne Unit', 1),
(11, 'Austràlia', 0),
(11, 'Nova Zelanda', 0);

-- Pregunta 12 (Xina)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(12, 'Vietnam', 0),
(12, 'Xina', 1),
(12, 'Corea del Nord', 0),
(12, 'Japó', 0);

-- Pregunta 13 (Estats Units)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(13, 'Canadà', 0),
(13, 'Estats Units', 1),
(13, 'Regne Unit', 0),
(13, 'Austràlia', 0);

-- Pregunta 14 (Itàlia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(14, 'Mèxic', 0),
(14, 'Itàlia', 1),
(14, 'Irlanda', 0),
(14, 'Bulgària', 0);

-- Pregunta 15 (Espanya)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(15, 'Portugal', 0),
(15, 'Espanya', 1),
(15, 'Andorra', 0),
(15, 'Itàlia', 0);

-- Pregunta 16 (Argentina)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(16, 'Uruguai', 0),
(16, 'Argentina', 1),
(16, 'Brasil', 0),
(16, 'Xile', 0);

-- Pregunta 17 (Portugal)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(17, 'Espanya', 0),
(17, 'Portugal', 1),
(17, 'Itàlia', 0),
(17, 'França', 0);

-- Pregunta 18 (Colòmbia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(18, 'Veneçuela', 0),
(18, 'Colòmbia', 1),
(18, 'Equador', 0),
(18, 'Bolívia', 0);

-- Pregunta 19 (Corea del Sud)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(19, 'Japó', 0),
(19, 'Corea del Sud', 1),
(19, 'Xina', 0),
(19, 'Vietnam', 0);

-- Pregunta 20 (Vietnam)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(20, 'Laos', 0),
(20, 'Vietnam', 1),
(20, 'Cambodja', 0),
(20, 'Tailàndia', 0);

-- Pregunta 21 (Països Baixos)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(21, 'Luxemburg', 0),
(21, 'Països Baixos', 1),
(21, 'França', 0),
(21, 'Alemanya', 0);

-- Pregunta 22 (Bèlgica)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(22, 'Alemanya', 0),
(22, 'Bèlgica', 1),
(22, 'França', 0),
(22, 'Països Baixos', 0);

-- Pregunta 23 (Àustria)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(23, 'Alemanya', 0),
(23, 'Àustria', 1),
(23, 'Suïssa', 0),
(23, 'Hongria', 0);

-- Pregunta 24 (Suïssa)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(24, 'Dinamarca', 0),
(24, 'Suïssa', 1),
(24, 'Àustria', 0),
(24, 'Noruega', 0);

-- Pregunta 25 (Bangladesh)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(25, 'Índia', 0),
(25, 'Bangladesh', 1),
(25, 'Pakistan', 0),
(25, 'Nepal', 0);

-- Pregunta 26 (Pakistan)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(26, 'Afganistan', 0),
(26, 'Pakistan', 1),
(26, 'Bangladesh', 0),
(26, 'Iran', 0);

-- Pregunta 27 (Nepal)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(27, 'Índia', 0),
(27, 'Nepal', 1),
(27, 'Bhutan', 0),
(27, 'Bangladesh', 0);

-- Pregunta 28 (Eslovàquia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(28, 'Eslovènia', 0),
(28, 'Eslovàquia', 1),
(28, 'Txèquia', 0),
(28, 'Croàcia', 0);

-- Pregunta 29 (Txèquia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(29, 'Polònia', 0),
(29, 'Txèquia', 1),
(29, 'Eslovàquia', 0),
(29, 'Rússia', 0);

-- Pregunta 30 (Polònia)
INSERT INTO respostes (id_pregunta, text_resposta, correcta) VALUES
(30, 'Txèquia', 0),
(30, 'Polònia', 1),
(30, 'Eslovàquia', 0),
(30, 'Hongria', 0);

