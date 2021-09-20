//Import the componants:
import React, { Component } from 'react';
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter} from 'reactstrap';
import { Redirect} from 'react-router-dom';


//Import page styles:
import 'bootstrap/dist/css/bootstrap.min.css';
import './GameBoard.css';

//Import user created componants:
import { Auth } from '../../auth';
import global from '../../lib/global';

//Create the interface:
class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      isPlayer: false,
      modal: false,
      EndGameModal: false,

      submitHeader: "",
      submitBody: "",

      playerHand: [],
      selectedLetters: [],
      createdWord: []

    };

    //Bind functions for state variable use:
    this.startGame = this.startGame.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.addScoreToTotal = this.addScoreToTotal.bind(this);
    this.addScoreToDB = this.addScoreToDB.bind(this);
    this.endGame = this.endGame.bind(this);

    this.messageToggle = this.messageToggle.bind(this);
    this.endGameToggle = this.endGameToggle.bind(this);
  }

  //Toggle the message:
  messageToggle(){
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  //Toggle end game messageL
  endGameToggle(){
    this.setState(prevState => ({
      EndGameModal: !prevState.EndGameModal
    }));
  }

  //On page load:
  componentDidMount(){
    
    //Set the page title:
    document.title = "Word Game";

    //Start the game:
    this.startGame();

  }

  //Start the game:
  startGame(){

    //Create data object:
    var data = new FormData();
    data.append('id', global.state.player.id);
    data.append('Username', global.state.player.username);
    
    //Make the request:
    var requestURL = '/start_game';
    this.serverReq(requestURL, this.gameStarted, data);

  }

  //Use a letter:
  playLetter(letter){
    
    //Get the selected letter:
    document.getElementById(letter).disabled = true;
        
    //Add the letter to the gameboard:
    var tmpSelectedLetters = this.state.selectedLetters;
    var tmpCreatedWord = this.state.createdWord;
    global.state.game.lettersRemaining = global.state.game.lettersRemaining - 1;
    tmpSelectedLetters.push(letter);
    tmpCreatedWord.push(letter);
    this.setState({
      selectedLetters: tmpSelectedLetters,
      tmpCreatedWord: tmpCreatedWord
    });

    //If the player's hand is empty:
    if(global.state.game.lettersRemaining === 0){
      //Display a notice message:
      this.setState({
        submitHeader: "Empty Hand",
        submitBody: "You have run out of letters!"
      });
      this.messageToggle();
    }
    
  }

  //Submit the constructed word:
  submitWord(){

    //Get the word:
    let word = this.state.createdWord.join('');

    //Make the request:
    var data = new FormData();
    data.append('wordString', word);
    data.append('word', this.state.createdWord);

    //Make the request:
    var requestURL = '/get_word_score';
    this.serverReq(requestURL, this.addScoreToTotal, data);

  }

  //Restart the game:
  restartGame(){

    //Re-enable all the letter buttons:
    for(var i=0; i<this.state.selectedLetters.length; i++){
      document.getElementById(this.state.selectedLetters[i]).disabled = false;
    }

    //Reset the game stats:
    global.state.game.currentScore = 0;
    global.state.game.totalScore = 0;
    global.state.game.lettersRemaining = global.state.game.lettersRemaining + this.state.selectedLetters.length;
    this.setState({
      selectedLetters: [],
      createdWord: []
    });

    //Display a confirmation message:
    this.setState({
      submitHeader: "Game Restarted",
      submitBody: "The game has been restarted. Good Luck!"
    });
    this.messageToggle();

  }

  //Finish the game:
  finishGame(){

    //Display a confirmation message:
    this.setState({
      submitHeader: "Finish Game",
      submitBody: "Are you sure you want to end the game? You currently have " + this.state.totalScore + " points!"
    });
    this.endGameToggle();

  }

  //Add the score to the database:
  addScoreToDB(){

    //Make the request:
    var data = new FormData();
    data.append('game_id', global.state.game.id);
    data.append('score', global.state.game.totalScore);

        //Make the request:
        var requestURL = '/set_game_score';
        this.serverReq(requestURL, this.endGame, data);

  }

  //Make a server requrest:
  serverReq(requestURL, callback, data){

    //Create the request:
    fetch(requestURL, {
      method: 'POST',
      body: data,
    }).then(res => res.json())
    .then(obj =>  {
      callback(obj)
    }).catch(err => {
      alert(err);
    });

  }

  //Start the game:
  gameStarted(response){

    //Create a temp array:
    var playerHandTMP = [];

    //Check if the response is ok:
    if(response.status === "OK"){

      //Save the game's ID:
      global.state.game.id = response.game_id;
      global.state.game.hand = response.Letters;

      //For each row in the response:
      for(var i=0; i<response.Count; i++){

          //Add the result to the temp array:
          playerHandTMP.push(
              <Button className='LetterBTN' 
              id={response.Letters[i]+i} 
              onClick={this.playLetter.bind(this, response.Letters[i]+i)}>
                {response.Letters[i]}
              </Button>
          )

        }

      //Display the starting Stats:
      global.state.game.lettersRemaining = response.Count;
      global.state.game.currentScore = 0;
      global.state.game.totalScore = 0;
      this.setState({
        playerHand: playerHandTMP
      });

    }else if(response.status === 'NO'){
      //Display an error message:
      this.setState({
        submitHeader: "Error",
        submitBody: response.Reason
      });
      this.messageToggle();
    }

  }

  //Add the total score:
  addScoreToTotal(response){

    //If the response is OK:
    if(response.status === 'OK'){

      //Set the scores:
      global.state.game.currentScore = response.Score;
      global.state.game.totalScore = global.state.game.totalScore + response.Score;

      //Reset the word variable:
      this.setState({
        createdWord: []
      });

    }else if(response.status === 'NO'){
      //Display an error message:
      this.setState({
        lettersRemaining: response.Total,
        submitHeader: "Error",
        submitBody: response.Reason
      });
      this.messageToggle();
    }

  }

  //End the game:
  endGame(response){

    //If the request was successful:
    if(response.status === 'OK'){

      //redirect to the dashboard:
      this.navToDash();

    }else if(response.status === 'NO'){
      //Display an error message:
      this.setState({
        lettersRemaining: response.Total,
        submitHeader: "Error",
        submitBody: response.Reason
      });
      this.messageToggle();
    }
  }

  //Navigate to Dahboard:
  navToDash = () => {

    //Authenticate the user:
    Auth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true,
        isPlayer: true
      }))
    })
    
  }
  
  render() {

    //Prepare to return to the dashboard:
    const { playerDashboard } = this.props.location.state || { playerDashboard: { pathname: '/player/Dashboard' } }

    //Setup referrer:
    const { redirectToReferrer } = this.state

    //If the user is a player:
    if(this.state.isPlayer){

      //If the refer is enabled:
      if (redirectToReferrer === true) {

        //Redirect the user to the player dashboard:
        return <Redirect to={playerDashboard} />

      }
    }

    //Render the interface:
    return (
      <div className='gameBoardContent'> 
        <Modal isOpen={this.state.modal} toggle={this.messageToggle} className='GenericModal'>
          <ModalHeader toggle={this.messageToggle}>{this.state.submitHeader}</ModalHeader>
          <ModalBody>{this.state.submitBody}</ModalBody>
          <ModalFooter>
            <Button className='GenericModal_btn' color="primary" onClick={this.messageToggle}>OK</Button>{' '}
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.EndGameModal} toggle={this.endGameToggle}>
          <ModalHeader toggle={this.endGameToggle}>{this.state.submitHeader}</ModalHeader>
          <ModalBody>{this.state.submitBody}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.endGameToggle}>Keep Playing!</Button>{' '}
            <Button olor="danger" onClick={this.addScoreToDB}>End Game</Button>{' '}
          </ModalFooter>
        </Modal>

        <div className='gameNav'>
          <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/">Word Game</NavbarBrand>
            <NavbarToggler onClick={this.state.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        
        <div className='playAreaCont'>
          <div className='activeCards'>
            <div className='scoreContainer'>
              <div className='scoreItem'>
                <h3>Last Word Score</h3>
                <p>{global.state.game.currentScore}</p>
              </div>
              <div  className='scoreItem'>
                <h3>Total Score</h3>
                <p>{global.state.game.totalScore}</p>
              </div>
              <div  className='scoreItem'>
                <h3>Letters Remaining</h3>
                <p>{global.state.game.lettersRemaining}</p>
              </div>
            </div>
          </div>
          <div className='gameControls'>
            <Button className='gameControlsBTN' onClick={this.submitWord.bind(this)}>Submit Word</Button>
            <Button className='gameControlsBTN' id='RestartGame' onClick={this.restartGame.bind(this)}>Restart Game</Button>
            <Button className='gameControlsBTN'id='QuitGame' onClick={this.finishGame.bind(this)}>Finish Game</Button>
          </div>
        </div>
        <div className='handCont'>
          {this.state.playerHand}
        </div>
      </div>
    );
  }
}

export default GameBoard;
