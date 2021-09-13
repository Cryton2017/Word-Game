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

      currentScore: "Loading...",
      totalScore: "Loading...",
      lettersRemaining: "Loading...",
      playerHand: [],
      selectedLetters: [],
      createdWord: []

    };

    //Bind functions for state variable use:
    this.startGame = this.startGame.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.addScoreToTotal = this.addScoreToTotal.bind(this);
    this.gameRestarted = this.gameRestarted.bind(this);

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
    document.getElementById(letter).disabled = true;
        
    var tmpSelectedLetters = this.state.selectedLetters;
    var tmpCreatedWord = this.state.createdWord;
    var tmpLetterCount = this.state.lettersRemaining - 1;
    tmpSelectedLetters.push(letter);
    tmpCreatedWord.push(letter);
    this.setState({
      selectedLetters: tmpSelectedLetters,
      tmpCreatedWord: tmpCreatedWord,
      lettersRemaining: tmpLetterCount
    });

    if(tmpLetterCount === 0){
      //Display a notice message:
      this.setState({
        submitHeader: "Empty Hand",
        submitBody: "You have run out of letters!"
      });
        this.messageToggle();
      }
    
  }

  //Restart the game:
  restartGame(){

    for(var i=0; i<this.state.selectedLetters.length; i++){
      document.getElementById(this.state.selectedLetters[i]).disabled = false;
    }

    this.setState({
      selectedLetters: [],
      createdWord: [],
      currentScore: 0,
      totalScore: 0
    });

      //Create data object:
      var data = new FormData();
      data.append('game_id', global.state.game.id);
      
      //Make the request:
      var requestURL = '/restart_game';
      this.serverReq(requestURL, this.gameRestarted, data);
    

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

  //Submit the constructed word:
  submitWord(){

    //Get the word:
    let word = this.state.createdWord.join('');

    //Make the request:
    var data = new FormData();
    data.append('game_id', global.state.game.id);
    data.append('wordString', word);
    data.append('word', this.state.createdWord);

    //Make the request:
    var requestURL = '/get_word_score';
    this.serverReq(requestURL, this.addScoreToTotal, data);

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

      //For each row in the response:
      for(var i=0; i<response.Total; i++){

          //Add the result to the temp array:
          playerHandTMP.push(
              <Button className='LetterBTN' 
              id={response.hand[i].letter+i} 
              onClick={this.playLetter.bind(this, response.hand[i].letter+i)}>
                {response.hand[i].letter}
              </Button>
          )

        }

      this.setState({
        playerHand: playerHandTMP,
        lettersRemaining: response.Total,
        currentScore: 0,
        totalScore: 0
      });

    }

  }

  //Add the total score:
  addScoreToTotal(response){

    //If the response is OK:
    if(response.status === 'OK'){

    this.setState({
      currentScore: response.CurrentScore,
      totalScore: response.TotalScore,
      createdWord: []
    });

    }else if(response.status === 'NO' && response.Reason === 'NoWordFound'){
      //Display an error message:
      this.setState({
        lettersRemaining: response.Total,
        submitHeader: "Error",
        submitBody: "No word was found. Please try again."
      });
      this.messageToggle();
    }

  }

  //Restart the game:
  gameRestarted(response){

    //If the response is OK:
    if(response.status === 'OK'){

      //Display a confirmation message:
      this.setState({
        lettersRemaining: response.Total,
        submitHeader: "Game Restarted",
        submitBody: "The game has been restarted. Good Luck!"
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
            <Button olor="danger" onClick={this.navToDash}>End Game</Button>{' '}
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
                <p>{this.state.currentScore}</p>
              </div>
              <div  className='scoreItem'>
                <h3>Total Score</h3>
                <p>{this.state.totalScore}</p>
              </div>
              <div  className='scoreItem'>
                <h3>Letters Remaining</h3>
                <p>{this.state.lettersRemaining}</p>
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
