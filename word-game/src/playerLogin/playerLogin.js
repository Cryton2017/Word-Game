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

//Import user created componants:
import { Auth } from '../auth';
import global from "../lib/global";

//Import page styles:
import 'bootstrap/dist/css/bootstrap.min.css';
import './playerLogin.css';

//Import images:
import ApertureScienceLogo from './images/loginBG.png';

//Create the interface:
class playerLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      isPlayer: false,
      modal: false,

      submitHeader: "",
      submitBody: "",

    };

    //Bind functions for state variable use:
    this.usernameInputChange = this.usernameInputChange.bind(this);
    this.passwordInputChange = this.passwordInputChange.bind(this);
    this.login = this.login.bind(this);
    this.messageToggle = this.messageToggle.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);

  }

  //Set the page title:
  componentDidMount(){
    document.title = "Aperture Science Management System";
  }

  //Toggle the message:
  messageToggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  //Validate the user's username:
  usernameInputChange(event){

    //Define regex for username verification:
    var pattern = /^[A-Za-z0-9]+$/;

    //Check if the userinput matches the pattern:
    if(pattern.test(event.target.value)){

      //Set state for username:
      this.setState({
        username: event.target.value,
        usernameValid: true
      });

    }else{

      //Set username valid to false:
      this.setState({
        usernameValid: false
      });

    }
  }

  //Validate the user's password:
  passwordInputChange(event){

    //Define pattern for password verification:
    var pattern = /^[A-Za-z0-9,.!?:()'" ]+$/;

    //Check if user input matches pattern:
    if(pattern.test(event.target.value)){

      //Set the state for the user's password:
      this.setState({
        password: event.target.value,
        passwordValid: true
      });

    }else{

      //Set password valid to false:
      this.setState({
        passwordValid: false
      });

    }
  }

  //Log the user in:
  login(){

    //Check if both inputs are valid:
    if(this.state.usernameValid && this.state.passwordValid){
      
      //Create data object:
      var data = new FormData();
      data.append('Username', this.state.username);
      data.append('Password', this.state.password);
      
      //Make the request:
      var requestURL = '/login_player';
      this.serverReq(requestURL, this.isLoggedIn, data);

    }else{

      //Display an error message:
      this.setState({
        submitHeader: "Error!",
        submitBody: "Validation Failed. Please try again."
      });
      this.messageToggle();

    }
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

  //Log the user in:
  isLoggedIn(response){

    //Check if the response is ok:
    if(response.status === "OK"){
      
      //Add user data to session:
      global.state.player.id = response.user[0].id;
      global.state.player.username = response.user[0].username;
      global.state.player.password = response.user[0].password;

      //Log the user in as a player:
      this.playerLogin();

    }else if(response.status === 'NO'){

      if(response.Reason === 'IncorrectLogin'){
        //Display an error message:
        this.setState({
          submitHeader: "Error!",
          submitBody: "Login Details are incorrect. Please try again."
        });
        this.messageToggle();
      }else if(response.Reason === 'UnknownError'){
        //Display an error message:
        this.setState({
          submitHeader: "Error!",
          submitBody: "Unknown error has occured. Please try again."
        });
        this.messageToggle();
      }else{
        //Display an error message:
        this.setState({
          submitHeader: "Error!",
          submitBody: "Unknown error has occured. Please try again."
        });
        this.messageToggle();
      }
    }
  }

  //Player Login:
  playerLogin = () => {

    //Authenticate the user:
    Auth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true,
        isPlayer: true
      }))
    })
    
  }
  
  render() {

    //Prep for player login:
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
      <div>

        <Modal isOpen={this.state.modal} toggle={this.messageToggle} className='GenericModal'>
          <ModalHeader toggle={this.messageToggle}>{this.state.submitHeader}</ModalHeader>
          <ModalBody>{this.state.submitBody}</ModalBody>
          <ModalFooter>
            <Button className='GenericModal_btn' color="primary" onClick={this.messageToggle}>OK</Button>{' '}
          </ModalFooter>
        </Modal>

        <div className='LoginContent'>
          <div className='LoginDivision'>
            <div className='LoginFormCont'>
              <h3 className='loginHeading'>Facilitator Login</h3>
              <Form className='LoginForm'>
                <Label for='usrEmail'>Username: </Label>
                <Input className='loginInput' id='username' name='username' placeholder='Player Username' type='text' onChange={this.usernameInputChange.bind(this)} />

                <Label for='usrPassword'>Password: </Label>
                <Input className='loginInput' id='password' name='password' placeholder='Password' type='password' onChange={this.passwordInputChange.bind(this)} />

                <Button className= 'login_btn' id='btnLogin' value='Login' onClick={this.login.bind(this)}>Login</Button>
              </Form>
            </div>
          </div>

          <div className='LoginDivision'>
            <img src={ApertureScienceLogo} width={600} alt='Aperture Science Logo' />
          </div>
        </div> 
      </div>
    );
  }
}

export default playerLogin;
