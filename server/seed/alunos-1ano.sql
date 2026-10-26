-- Importação idempotente dos exploradores do 1º ano.
-- Execute com a API desligada ou com cuidado para evitar alterações concorrentes.
-- Exemplo: mysql -u root -p trilha_aprender < server/seed/alunos-1ano.sql

SET NAMES utf8mb4;

INSERT INTO students (id, name, className, paws, createdAt, lastAccess)
VALUES
  (UUID(), 'Amaya Santos Sepulveda', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Angelo Ciccillo Gomes Cogliatti', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Anna Alice Pereira Sena', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Anthony Rezende Sant Anna', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Anthony Zaia Carvelli', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Arthur Miguel Cáceres dos Santos', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Benício Maia Ferreira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Benício Zaia Carvelli', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Benjamim Sales Cabral', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Benjamin Luz Araujo', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Bernardo Alves Mathias de Oliveira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Brendha Araujo Marcondes', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Cecília Gomes Bezerra', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Cecilia Raiol Selbach', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Cecilia Ziemba Vera Sarraipa Brescancin', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Davi de Souza Belentani Teixeira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Davi Souza Ventura', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Emanuelly Gomes Correia', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Gabriel Henrique da Silva Barros', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Helena Ferreira Serra', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Heloisa Troiani Costa', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Henrique Fernandes Inoue Hamada', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Isaque Ferreira Sansão', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Liz Farina Dias', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Lorena Vitoria Bispo Sales Pereira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Maria Alice Lima de Souza', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Maria Clara Vilhalba Lima Ferreira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Mariah Zinezzi Albuquerque Alves', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Paola Bezerra de Oliveira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Pedro Henrique Lopes da Silva', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Sofia Cochi Oliveira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Taina Cochi Oliveira', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Helena Oliveira Marques', '1º ano do Ensino Fundamental', 0, NOW(), NULL),
  (UUID(), 'Lunna Catarina dos Santos', '1º ano do Ensino Fundamental', 0, NOW(), NULL)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  className = VALUES(className);
