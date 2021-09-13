# Word Game

This applicaiton has been created to replicate games such as Scrabble and Words with Friends.

This application has been developed using the following:

---

| Framework/Language |    For    |                                                                                               Reason                                                                                                | Substitute |
|--------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
|       React        | Front End | As stated in the instructions, React is used by intelliHR for front end development.                                                                                                        |    None     |
|        Python      | Back End  | As stated in the instructions, Python is used for the back end (API) development. The specific Python package that was used is Flask. This is due to the fact that based on my research, Flask is the most common package used for API development with Python.                   | Python      |
|       MySQL        | Database  | There was no specific mention of the database that is preffered for this challenge. I decided to use what I was comfortable with in order to showcase my other skills. I am willing and eager to learn about other database frameworks.                                            |    None     |

---

### User Stories Implemented
| ID | Story Description                                                                                                             | Priority    |
|----|-------------------------------------------------------------------------------------------------------------------------------|-------------|
| 1  | As a player, I need to be able to know the hand when a new game starts.                                                       |  Must have  |
| 2  | As a player, I need to be able to end the game.                                                                               |  Must have  |
| 3  | As a player, I need to be able to know the total number of points I have earned when the game ends.                           |  Must have  |
| 4  | As a player, I need to be able to see my hand throughout the game.                                                            | Should have |
| 5  | As a player, I need to be able to see how many points I earn when I submit a word.                                            | Should have |
| 6  | As a player, I need to be able to see how many points I have earned throughout the game.                                      | Should have |
| 7  | As a player, I need to be able to replay a game with the same initial hand as a new game if I desire.                         | Should have |
| 8  | As a player, I need to be informed when I run out of letters in my hand.                                                      | Should have |
| 13 | As a system administrator, I would like the players to have an enjoyable experience when interacting with the system.         | Could have  |
| 14 | As a player, I would like to be able to play the game on a website.                                                           | Could have  |

---

### User Stories to implement (in order)
| ID | Story Description                                                                                                             | Priority    | Time to Complete |
|----|-------------------------------------------------------------------------------------------------------------------------------|-------------|------------------|
| 15 | As a player, I would like to be able to see my history of all played games.                                                   | Could have  |     0.5 hours    |
| 16 | As a player, at the end of a game, I need to be able to know what the optimal outcome of the game* is if I desire.            | Could have  |      2 hours     |
| 10 | As a system administrator, I would like to be able to modify the list of valid words.                                         | Could have  |      1 hour      |
| 9  | As a system administrator, I would like to be able to modify the value of each letter before a new game starts.               | Could have  |      1 hour      |
| 11 | As a system administrator, I would like to be able to see a history of all played games.                                      | Could have  |      1 hour      |
| 12 | As a system administrator, I would like to be able to see a particular player's history of all played games.                  | Could have  |      1 hour      |

The above table depicts the order in which I would implement the remaining user stories and the time I feel it would take.

---

### Testing
Testing is an important part of software development. I have conducted interface testing and user testing. I have not conducted unit testing. In my previous experience, I have performed unit testing using JUnit. I have not had the opportunity to develop my skills in Unit Testing for Python or React. I am confident that I can quickly aquire these skills. There may be a few minor bugs that will be addressed before any further features are implemented.

### Other Notes
Though it was not a user story, I decided to add a log in system as a way of future proofing the project to allow an admin to modify the game settings and for the users to view there past games. Security is very important and before this project is released to a production environment, authentication should be added to the APIs and the user input validation should be improved. The user login system is also basic and should be improved.
