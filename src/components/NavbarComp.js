import React, { Component } from 'react'
import { Navbar, Nav, Container} from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import Patients from './Patients';
import Doctors from './Doctors';
import Appointments from './Appointments';
import Donations from './Donations';
import Login from './Login';
import History from './History';
import Records from './Records';
import MyContext from '../MyContext';
import '../global-styles.css';



export default class NavbarComp extends Component {
  static contextType = MyContext;

  handleLogout = () => {
    const { updatePatientAfterLogout } = this.context;
    alert("Logged Out");
    updatePatientAfterLogout(); 
    // this.props.history.push('/login');
  };

  render() {
    const { isAdmin, isLoggedOut, isDoctor, patientData, doctorAddress } = this.context;

    return (
      <Router>
        <div>
        <Navbar className="poppins-medium" style={{ backgroundColor: '#eff0f3' }} variant="light" expand="lg">
            <Container fluid>
              <Navbar.Brand href="/">Capstone</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="my-2 my-lg-0 ms-auto"
                  style={{ maxHeight: '300px' }}
                  navbarScroll
                >
                  <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                  {isAdmin&&<Nav.Link as={Link} to={"/patients"}>Patients</Nav.Link>}
                  {(!isDoctor)&&<Nav.Link as={Link} to={"/doctors"}>Doctors</Nav.Link>}
                  <Nav.Link as={Link} to={"/appointments"}>Appointments</Nav.Link>
                  {(!isAdmin)&&<Nav.Link as={Link} to={"/history"}>History</Nav.Link>}
                  <Nav.Link as={Link} to={"/dashboard"}>Dashboard</Nav.Link>
                  <Nav.Link as={Link} to={"/records"}>Records</Nav.Link>
                  {isLoggedOut && <Nav.Link as={Link} to={"/login"}>Login</Nav.Link>}
                  {!isLoggedOut && <Nav.Link onClick={this.handleLogout}>Logout<b> <span style={{ color: "#d9376e" }}>{patientData.name} {doctorAddress}</span></b>
                  </Nav.Link>}
                </Nav>
              </Navbar.Collapse>
            </Container>
            
          </Navbar>
        </div>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            {isAdmin&&<Route path="/patients" element={<Patients />}></Route>}
            {(!isDoctor)&&<Route path="/doctors" element={<Doctors />}></Route>}
            <Route path="/appointments" element={<Appointments />}></Route>
            {(!isAdmin)&&<Route path="/history" element={<History />}></Route>}
            <Route path="/dashboard" element={<Donations />}></Route>
            <Route path="/records" element={<Records />}></Route>
            {isLoggedOut && <Route path="/login" element={<Login />}></Route>}
          </Routes>
        </div>
      </Router>
    )
  }
}