//Import the componants:
import React, { Component } from 'react';
import {
    Button,
    Form,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter} from 'reactstrap';
import { Redirect} from 'react-router-dom';
import { Auth } from '../../auth';

//Import page styles:
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainGame.css';

//Create the interface:
class MainGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      isPlayer: false,

    };

    //Bind functions for state variable use:
    

  }

  //Start Game:
  goToMainGame = () => {

    //Authenticate the user:
    Auth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true,
        isPlayer: true
      }))
    })
    
  }
  
  render() {

    //Prep for game start:
    const { gameBoard } = { gameBoard: { pathname: '/player/game' } }
    
     //Setup referrer:
    const { redirectToReferrer } = this.state

    //If the user is a player:
    if(this.state.isPlayer){

      //If the refer is enabled:
      if (redirectToReferrer === true) {

        //Redirect the user to the player dashboard:
        return <Redirect to={gameBoard} />

      }
    }

    //Render the interface:
    return (
      <div className='mainGameContent'> 
        <Button className='btnStartGame' onClick={this.goToMainGame.bind(this)}>Start New Game!</Button>
      </div>
    );
  }
}

export default MainGame;
