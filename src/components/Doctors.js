import React, { useContext, useEffect, useState } from 'react';
import AdminContext from '../MyContext';
import { CONTRACT_ADDRESS_DOCTOR, ABI_DOCTOR, CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT } from '../Constants';
import { ethers } from 'ethers';
import Web3 from 'web3';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../global-styles.css';

const myStyle = {
    textAlign: "left",
};

const DoctorManagement = () => {
    const { isAdmin, patientData } = useContext(AdminContext);
    const [doctors, setDoctors] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFormOpenApp, setIsFormOpenApp] = useState(false);
    const [formData, setFormData] = useState({ name: '', specialty: '', charge: '', account: '' });
    const [searchQuery, setSearchQuery] = useState('');
    //pinata ipfs
    const VITE_PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzM2YzM2Y4MC1mOWRhLTQ5NzgtOGMwOC1jOTU3N2FjOGQ2MzIiLCJlbWFpbCI6InByaXlhbmthY2hvd2RodXJ5MjAwMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODNmNzA3YTI4YjU1YzM1ZTQ4NTkiLCJzY29wZWRLZXlTZWNyZXQiOiJhZTZhNzlhYzAwMThiOTRiYjhkMmFlNWMyOGY1MTE3YmRiMTJlYjhkMTc1OGE4MDNlNzAxZjk2NjU5YTNmZmM4IiwiaWF0IjoxNzEyOTQwNjU0fQ.rIs3X-NIOJHGi0Nzu0VsJ3i_EM1bMGkrByQPvjdJNwI'
    const VITE_GATEWAY_URL = 'https://orange-known-worm-405.mypinata.cloud'
    const [selectedFile, setSelectedFile] = useState(null);
    const [cid, setCid] = useState(null);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');

    //notif
    const [showNotification, setShowNotification] = useState(false);

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };
    //pinata file
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddDoctorClick = () => {
        if (isAdmin) {
            setIsFormOpen(true);
        } else {
            alert("ONLY ADMINS HAVE ACCESS");
        }
    };

    async function registerAppointmentData() {
        const dateObject = new Date(selectedDate);
        const timestamp = Math.floor(dateObject.getTime() / 1000);
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const sig = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT, sig);
            const reg1 = await contract.addAppointment(patientData.name, selectedDoctor[0], patientData.publicAddress, selectedDoctor[4], timestamp, selectedTime, selectedDoctor[3].toNumber(), "");
            console.log(reg1)
            const reg2 = await contract.getAllAppointment();
            console.log(reg2)
            // setDoctors(reg2);
        } catch (error) {
            console.error('Error registering Doctor:', error);
        }
    }

    const handleConfirmAppointment = () => {
        console.log(patientData)
        registerAppointmentData()
        setSelectedDoctor(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setIsFormOpenApp(false);
        alert("Confirming Appointment...")
    }

    async function registerDoctorData() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const sig = provider.getSigner();//yessy
            const contract = new ethers.Contract(CONTRACT_ADDRESS_DOCTOR, ABI_DOCTOR, sig);
            const reg1 = await contract.addDoctor(formData.name, formData.email, formData.specialty, parseInt(formData.charge), formData.account, cid);
            await reg1.wait();
            console.log(reg1)
            const reg2 = await contract.getAllDoctors();
            console.log(reg2)
            setDoctors(reg2);
        } catch (error) {
            console.error('Error registering Doctor:', error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        registerDoctorData();
        setFormData({ name: '', specialty: '', charge: '', account: '' });
        setIsFormOpen(false);
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(11155111) }]
                });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS_DOCTOR, ABI_DOCTOR, signer);
                const doctors = await contract.getAllDoctors();
                setDoctors(doctors);
                console.log(doctors)
            } catch (error) {
                console.error('Error fetching Doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doctor =>
        doctor[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor[1].toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAppointment = (doctor) => {
        if (!isAdmin) {
            setIsFormOpenApp(true); 

            setSelectedDoctor(doctor);
            // alert(patientData) // 
            // alert(doctor)
        }

        else alert("Only for patients")
        // setIsFormOpenApp(true);
    }

    const handleSubmission = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const metadata = JSON.stringify({
                name: "File name",
            });
            formData.append("pinataMetadata", metadata);

            const options = JSON.stringify({
                cidVersion: 0,
            });
            formData.append("pinataOptions", options);

            const res = await fetch(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${VITE_PINATA_JWT}`,
                    },
                    body: formData,
                }
            );
            const resData = await res.json();
            setCid(resData.IpfsHash);
            console.log(resData);

            // Show the notification
            setShowNotification(true);

            // Hide the notification after 3 seconds
            // setTimeout(() => {
            //     setShowNotification(false);
            // }, 4000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='poppins-regular' style={{ background: '#eff0f3', minHeight: '100vh', padding: '20px' }}>
            {isFormOpenApp && (
                <div className="modal-container d-flex" style={myStyle}>
                    <div className="modal-background" onClick={() => setIsFormOpenApp(false)}></div>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: "#fffffe", border: '1px solid #ccc', width: '400px', margin: 'auto', padding: '20px' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Book Appointment</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsFormOpenApp(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="doctorName" className="form-label">Doctor Name</label>
                                        <input type="text" className="form-control" id="doctorName" name="doctorName" value={selectedDoctor ? selectedDoctor[0] : ''} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="specialty" className="form-label">Specialty</label>
                                        <input type="text" className="form-control" id="specialty" name="specialty" value={selectedDoctor ? selectedDoctor[2] : ''} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="charge" className="form-label">Consultation Charge in INR</label>
                                        <input type="text" className="form-control" id="charge" name="charge" value={selectedDoctor ? selectedDoctor[3].toNumber() : ''} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="charge1" className="form-label">Consultation Charge in ETH</label>
                                        <input type="text" className="form-control" id="charge1" name="charge1" value={selectedDoctor[3].toNumber() * 0.0000052} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label me-3">Date</label>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={date => setSelectedDate(date)}
                                            minDate={new Date()} // Setting minimum date to today
                                            className="form-control"
                                            id="date"
                                            name="date"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="time" className="form-label">Time</label>
                                        <input
                                            type="time"
                                            id="time"
                                            name="time"
                                            value={selectedTime}
                                            onChange={handleTimeChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <button type="button" style={{ backgroundColor: "#d9376e", border: "2px solid #d9376e" }} className="btn btn-primary" onClick={handleConfirmAppointment}>Confirm Appointment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            )}
            {!isFormOpen && !isFormOpenApp && (
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Doctors Information</h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <table className="table table-borderless table-hover custom-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '10px' }}>NAME</th>
                                <th style={{ padding: '10px' }}>PHOTO</th>
                                <th style={{ padding: '10px' }}>SPECIALITY</th>
                                <th style={{ padding: '10px' }}>CONSULTATION CHARGE</th>
                                <th style={{ padding: '10px' }}>ACCOUNT ADDRESS</th>
                                <th style={{ padding: '10px' }}> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.map((doctor, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '10px' }}>{doctor[0]}</td>
                                    <td style={{ padding: '10px' }}>
                                        <img src={`${VITE_GATEWAY_URL}/ipfs/${doctor[5]}`}
                                            alt="ipfs image"
                                            style={{ width: '100px', height: '120px' }}
                                        /></td>
                                    <td style={{ padding: '10px' }}>{doctor[2]}</td>
                                    <td style={{ padding: '10px' }}>{doctor[3].toNumber()}</td>
                                    <td style={{ padding: '10px' }}>{doctor[4]}</td>
                                    <td><button type="button" className="btn btn-primary" style={{ backgroundColor: "#ff8e3c", border: "2px solid #ff8e3c" }} onClick={handleAppointment.bind(this, doctor)}>Book Appointment</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <button type="button" className="btn btn-primary" style={{ backgroundColor: "#d9376e", border: "2px solid #d9376e" }} onClick={handleAddDoctorClick}>
                    Add New Doctor
                </button>
            </div>
            {isFormOpen && isAdmin && (
                <div className="modal-container d-flex" style={myStyle}>
                    <div className="modal-background" onClick={() => setIsFormOpen(false)}></div>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: "#fffffe", border: '1px solid #ccc', width: '400px', margin: '50px auto', padding: '20px' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Doctor</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsFormOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3" >
                                        <label htmlFor="photo" className="form-label">Upload Image</label>
                                        <input type="file" className="form-control" id="photo" name="photo" onChange={changeHandler} required />
                                        <br></br>
                                        <div style={{ display: 'flex'}}>
                                        <button type='button' style={{ backgroundColor: "#ff8e3c", border: "2px solid #ff8e3c" }} className="btn btn-primary" onClick={handleSubmission}>Upload</button>
                                        {showNotification && (
                                            <div style={{ padding: '10px', fontSize: '14px', width: '100px',fontWeight: 'bold', color: 'red' }}>
                                                Uploaded!
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="specialty" className="form-label">Specialty</label>
                                        <input type="text" className="form-control" id="specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="charge" className="form-label">Consultation Charge</label>
                                        <input type="text" className="form-control" id="charge" name="charge" value={formData.charge} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="account" className="form-label">Account Address</label>
                                        <input type="text" className="form-control" id="account" name="account" value={formData.account} onChange={handleInputChange} required />
                                    </div>
                                    <button type="submit" style={{ backgroundColor: "#d9376e", border: "2px solid #d9376e" }} className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;