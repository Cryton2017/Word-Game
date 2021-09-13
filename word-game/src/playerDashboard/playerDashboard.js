import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card, 
  CardText, 
  CardBody,
  CardTitle, 
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter} from 'reactstrap';
import global from "../lib/global";

import 'bootstrap/dist/css/bootstrap.min.css';
import './playerDashboard.css';

//Import images:
import profilePic from './images/profilePic.png';

//Import page content:
import MainGame from './MainGame/MainGame';

class playerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {

      redirectToReferrer: false,

      modal: false,
      PAHeading : "",
      PABody: "",

      mainGameActive: 'playerDashActiveNavBTN',
      pastGamesActive: 'playerDashNavBTN',

      playerDashCont: [<MainGame />]

    };

    this.toggleModal = this.toggleModal.bind(this);
    this.changeDashScreen = this.changeDashScreen.bind(this);

  }

  componentDidMount(){
    document.title = "Kashy Internal Operations - Dashboard";
  }
  toggleModal(){
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  changeDashScreen = (selection) => {
    var tmpPlayerDashCont = [];

    if(selection === 'MainGame'){
      tmpPlayerDashCont.pop();
      tmpPlayerDashCont.push(
        <MainGame />
      );
      this.setState({
        mainGameActive: 'playerDashActiveNavBTN',
        pastGamesActive: 'playerDashNavBTN'
      });
    }else if(selection === 'PastGames'){
      tmpPlayerDashCont.pop();
      tmpPlayerDashCont.push(
        // <PastGames />
      );
      this.setState({
        mainGameActive: 'playerDashNavBTN',
        pastGamesActive: 'playerDashActiveNavBTN',
      });
    }

    this.setState({
      playerDashCont: tmpPlayerDashCont
    });
  }

  render() {

    return (
      <div className='playerDashPageContent'>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className='LoginModal'>
          <ModalHeader toggle={this.toggleModal}>{this.state.PAHeading}</ModalHeader>
          <ModalBody>{this.state.PABody}</ModalBody>
          <ModalFooter>
            <Button className='btnModal' color="primary" onClick={this.toggleModal}>OK</Button>
          </ModalFooter>
        </Modal>

        <div className='playerDashNavigation'>
          <div className='playerDashNavLogo'>
            <img src={profilePic} width={250} alt='Aperture Science Logo' />
          </div>
          <NavLink onClick={this.changeDashScreen.bind(this, "MainGame")} className={this.state.mainGameActive}>Main Game</NavLink>
          <NavLink onClick={this.changeDashScreen.bind(this, "PastGames")} className={this.state.pastGamesActive}>Past Games</NavLink>
        </div>

        <div className='playerDashMainPage'>
          {this.state.playerDashCont}
        </div>

      </div>
    );
  }
}

export default playerDashboard;
