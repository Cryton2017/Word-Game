#Create the database:
CREATE SCHEMA IF NOT EXISTS `WordGame` ;

#Set the database as the active database:
USE WordGame;

#Create the players table:
CREATE TABLE IF NOT EXISTS players (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(45) NOT NULL,
	`password` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);

#Insert data into the players table:
INSERT INTO players(username, password) 
VALUES ('Cryton', 'Abc123');

#create the letters table:
CREATE TABLE IF NOT EXISTS letters (
	`id` INT NOT NULL AUTO_INCREMENT,
	`letter` VARCHAR(45) NOT NULL,
	`value` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `letter_UNIQUE` (`letter` ASC) VISIBLE);
    
#Insert data into the letters table:
INSERT INTO letters(letter, value) VALUES ('a', '1');
INSERT INTO letters(letter, value) VALUES ('b', '3');
INSERT INTO letters(letter, value) VALUES ('c', '3');
INSERT INTO letters(letter, value) VALUES ('d', '2');
INSERT INTO letters(letter, value) VALUES ('e', '1');
INSERT INTO letters(letter, value) VALUES ('f', '4');
INSERT INTO letters(letter, value) VALUES ('g', '2');
INSERT INTO letters(letter, value) VALUES ('h', '4');
INSERT INTO letters(letter, value) VALUES ('i', '1');
INSERT INTO letters(letter, value) VALUES ('j', '8');
INSERT INTO letters(letter, value) VALUES ('k', '5');
INSERT INTO letters(letter, value) VALUES ('l', '1');
INSERT INTO letters(letter, value) VALUES ('m', '3');
INSERT INTO letters(letter, value) VALUES ('n', '1');
INSERT INTO letters(letter, value) VALUES ('o', '1');
INSERT INTO letters(letter, value) VALUES ('p', '3');
INSERT INTO letters(letter, value) VALUES ('q', '10');
INSERT INTO letters(letter, value) VALUES ('r', '1');
INSERT INTO letters(letter, value) VALUES ('s', '1');
INSERT INTO letters(letter, value) VALUES ('t', '1');
INSERT INTO letters(letter, value) VALUES ('u', '1');
INSERT INTO letters(letter, value) VALUES ('v', '4');
INSERT INTO letters(letter, value) VALUES ('w', '4');
INSERT INTO letters(letter, value) VALUES ('x', '8');
INSERT INTO letters(letter, value) VALUES ('y', '4');
INSERT INTO letters(letter, value) VALUES ('z', '10');
        
#create the words table:
CREATE TABLE IF NOT EXISTS words (
	`id` INT NOT NULL AUTO_INCREMENT,
	`word` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `word_UNIQUE` (`word` ASC) VISIBLE);

#insert data intp the admins table:
INSERT INTO words(word) VALUES ('AA');
INSERT INTO words(word) VALUES ('AAH');
INSERT INTO words(word) VALUES ('AAHED');
INSERT INTO words(word) VALUES ('AAHING');
INSERT INTO words(word) VALUES ('AAHS');
INSERT INTO words(word) VALUES ('AAL');
INSERT INTO words(word) VALUES ('AALII');
INSERT INTO words(word) VALUES ('AALIIS');
INSERT INTO words(word) VALUES ('AALS');
INSERT INTO words(word) VALUES ('AARDVARK');
INSERT INTO words(word) VALUES ('AARDWOLF');
INSERT INTO words(word) VALUES ('AARGH');
INSERT INTO words(word) VALUES ('AARRGH');
INSERT INTO words(word) VALUES ('AARRGHH');
INSERT INTO words(word) VALUES ('AAS');
INSERT INTO words(word) VALUES ('AASVOGEL');
INSERT INTO words(word) VALUES ('AB');
INSERT INTO words(word) VALUES ('ABA');
INSERT INTO words(word) VALUES ('ABACA');
INSERT INTO words(word) VALUES ('ABACAS');

#Create the game table:
CREATE TABLE IF NOT EXISTS games (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(45) NOT NULL,
	`username` VARCHAR(45) NOT NULL,
    `totalPoints` VARCHAR(45),
	PRIMARY KEY (`id`));
    
#Create the hand dealt table:
CREATE TABLE IF NOT EXISTS handDelt (
	`id` INT NOT NULL AUTO_INCREMENT,
	`game_id` VARCHAR(45) NOT NULL,
	`user_id` VARCHAR(45) NOT NULL,
    `letter` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`));

#create the admins table:
CREATE TABLE IF NOT EXISTS admins (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(45) NOT NULL,
	`password` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `Username_UNIQUE` (`username` ASC) VISIBLE);

#insert data intp the admins table:
INSERT INTO admins(username, password)
VALUES ('Cryton', 'Abc123');

#Select statements to check the data:
SELECT * FROM facilitators;
SELECT * FROM testsubjects;