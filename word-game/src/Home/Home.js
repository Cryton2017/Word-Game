//Import the componants:
import React, { Component, useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button} from 'reactstrap';
import { Redirect} from 'react-router-dom';

//Import user created componants:
import { Auth } from '../auth';

//Import page styles:
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

//Create the interface:
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      Player: false,
      Admin: false,
      modal: false,

      toggle: false,
      isOpen: false,

      submitHeader: "",
      submitBody: "",

      username: "",
      password: "",

      usernameValid: false,
      passwordValid: false

    };

    //Bind functions for state variable use:
    this.messageToggle = this.messageToggle.bind(this);

  }

  componentDidMount(){
    
    //Set the page title:
    document.title = "Word Game - Home";

  }

  messageToggle() {

    //Toggle the modal componant:
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

  }

  //Go to Player Login page:
  playerLogin = () => {
      this.setState(() => ({
        redirectToReferrer: true,
        Player: true
      }))
  }

  //Go to Admin Login page:
  adminLogin = () => {
      this.setState(() => ({
        redirectToReferrer: true,
        Admin: true
      }))
  }
  
  render() {

    //Setup Props:
    const { playerLogin } = this.props.location.state || { playerLogin: { pathname: '/playerLogin' } }                                                
    const { adminLogin } = this.props.location.state || { adminLogin: { pathname: '/adminLogin' } }
    
     //Setup referrer:
    const { redirectToReferrer } = this.state

    //If the user is an admin:
    if(this.state.Player){

      //If the refer is enabled:
      if (redirectToReferrer === true) {

        //Redirect the user to the admin page:
        return <Redirect to={playerLogin} />

      }

    //If the user needs to provide further details:
    }else if(this.state.Admin){

      //If the refer is enabled:
      if (redirectToReferrer === true) {

        //Redirect the user to the details page:
        return <Redirect to={adminLogin} />
        
      }
    }

    //Render the interface:
    return (
      <div className='divContent'>

        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Word Game</NavbarBrand>
          <NavbarToggler onClick={this.state.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/playerLogin">Player Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/adminLogin">Admin Login</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <div className='MainContent'>
          <div className='division'>
            <div className='loginDirections'>
              <div className='homePageHeadingCOnt'>
                <h2 className='homeText'>Welcome! Please Log In.</h2>
              </div>
              <div className='homePageButtonsCont'>
                <Button className='homePageButtons' onClick={this.playerLogin.bind(this)}>I am a Player</Button>
                <h4 className='homeText'> - or - </h4>
                <Button className='homePageButtons' onClick={this.adminLogin.bind(this)}>I am an Admin</Button>
              </div>
            </div>
          </div>

          <div className='division'>
            
          </div>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
