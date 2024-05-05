import './global-styles.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './components/NavbarComp';
import MyContext from './MyContext';

import { useState } from 'react';



function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor,setIsDoctor] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [doctorAddress, setDoctorAddress] = useState("");
  

  const [patientData,setPatientData] = useState({
    name : '',
    publicAddress: ''
  });

  const updateIsAdmin = (newValue) => {
    setIsAdmin(newValue);
    setIsLoggedOut(false);
    setIsDoctor(false);
    setDoctorAddress("");
  };
  const updateIsDoctor = (newValue) =>{
    setIsDoctor(true);
    console.log(newValue)
    setDoctorAddress(newValue);
    setIsLoggedOut(false);
    setIsAdmin(false)
  }
  const updatePatientData = (newValue, isLogin, name, account) => {
    setIsLoggedOut(false);
    setIsDoctor(false);
    setDoctorAddress("");
    setIsAdmin(false);
    if(isLogin) {
      patientData.name = newValue[0];
      patientData.publicAddress = newValue[4];
    } else {
      patientData.name = name;
      patientData.publicAddress = account;
    }
  };

  const updatePatientAfterLogout = () => {
    setIsLoggedOut(true)
    setIsAdmin(false)
    setIsDoctor(false)
    patientData.name = ""
    patientData.publicAddress = ""
    setDoctorAddress("");
  }
  return (
    <MyContext.Provider value={{ isDoctor, doctorAddress, updateIsDoctor,isAdmin, updateIsAdmin ,patientData,updatePatientData, isLoggedOut, setIsLoggedOut, updatePatientAfterLogout}}>
      <div className="App">
        <NavbarComp />
      </div>
    </MyContext.Provider>
  );
}

export default App;
