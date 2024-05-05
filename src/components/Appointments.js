import React, { useContext, useEffect, useState } from 'react';
import MyContext from '../MyContext';
import { CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT, CONTRACT_ADDRESS_DISEASE, ABI_DISEASE } from '../Constants';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsClipboard } from 'react-icons/bs';
import { BigNumber } from "@ethersproject/bignumber";

const myStyle = {
    textAlign: "left",
};

const Appointments = () => {
    const { isAdmin, patientData, isDoctor, doctorAddress } = useContext(MyContext);
    const [appointments, setAppointments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ desc: '', disease: '' });
    const [timestamp, setTimestamp] = useState("");
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMarkSubmit = (e) => {
        e.preventDefault();
        setFormData({ desc: '', disease: '' });
        markComplete(formData.desc);
        setIsFormOpen(false);
    };

    useEffect(() => {
        const connectToMetaMask = async () => {
            if (window.ethereum) {
                try {
                    // Request account access if needed
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    // Accounts now exposed
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                } catch (error) {
                    console.error('User denied accont access');
                }
            } else {
                console.error('MetaMask not detected');
            }
        };
        connectToMetaMask();
    }, []);

    function toDate(timestamp) {
        const dob = new Date(parseInt(timestamp.toString()) * 1000);
        const day = dob.getDate().toString().padStart(2, '0');
        const month = (dob.getMonth() + 1).toString().padStart(2, '0');
        const year = dob.getFullYear();
        const formattedDOB = `${day}/${month}/${year}`;
        return formattedDOB;
    }

    const handleAppCompleteClick = (ts) => {
        alert("Completing Appointment...")
        setIsFormOpen(true);
        setTimestamp(ts)
    };

    const fetchData = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const sig = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT, sig);

            const reg1 = await contract.getAllAppointment();
            console.log(reg1)
            setAppointments(reg1);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function copyButton(text) {
        navigator.clipboard.writeText(text)
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    async function doPayment(timestamp, doctorAddress, charge) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const addressToValue = doctorAddress;
            const ETHAmountValue = (charge.toNumber() * 0.0000052).toFixed(18).toString();
            const weiAmountValue = ethers.utils.parseEther(ETHAmountValue);

            // Setting gas limit
            const transactionRequest = {
                to: addressToValue,
                value: weiAmountValue,
                gasLimit: ethers.utils.hexlify(3000000) // limit as needed
            };

            // Sending transaction
            const receipt = await signer.sendTransaction(transactionRequest);
            console.log("Transaction receipt:", receipt);

            // Switching Ethereum chain
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });

            // Interacting with contract
            const contract = new ethers.Contract(CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT, signer);
            const transactionResponse = await contract.doPayment(timestamp);
            await transactionResponse.wait();
            console.log("Transaction response:", transactionResponse);
            await fetchData()
            // fetching updated appointment data 

        } catch (error) {
            console.error('Error during payment:', error);
        }
    }

    async function deleteAppointment(timestamp, isPaid) {
        if(isPaid) {
            alert("Can not delete paid appointment...");
        } else {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
    
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(11155111) }]
                });
    
                // Interacting with contract
                const contract = new ethers.Contract(CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT, signer);
                const gasLimit = BigNumber.from("1000000");
                const transactionResponse = await contract.deleteAppointment(timestamp, { gasLimit });
                await transactionResponse.wait();
                console.log("Transaction response:", transactionResponse);
                await fetchData()
                // updated appointment data 
    
            } catch (error) {
                console.error('Error during deletion:', error);
            }   
        }
    }

    async function markComplete(desc) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });

            // Interacting with contract
            const contract = new ethers.Contract(CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT, signer);
            // const gasLimit = BigNumber.from("1000000");
            console.log("Timestamp is :::::" + timestamp);
            const transactionResponse = await contract.markComplete(timestamp, desc);
            await transactionResponse.wait();
            console.log("Transaction response:", transactionResponse);
            await fetchData()
            // updated appointment data 

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS_DISEASE, ABI_DISEASE, signer);
                const updateDisease = await contract.incrementDiseaseCount(formData.disease);
                await updateDisease.wait();

            } catch (error) {
                console.error('Error fetching patients:', error);
            }

        } catch (error) {
            console.error('Error during deletion:', error);
        }
    }
    return (
        <div className='poppins-regular' style={{ background: '#eff0f3', minHeight: '100vh', paddingTop: '1px', padding: '20px' }}>
            {isFormOpen && (
                <div className="modal-container d-flex" style={myStyle}>
                    <div className="modal-background" onClick={() => setIsFormOpen(false)}></div>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: "#fffffe", border: '1px solid #ccc', width: '400px', margin: '50px auto', padding: '20px' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Enter Remarks</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsFormOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleMarkSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="desc" className="form-label">Description</label>
                                        <textarea className="form-control" id="desc" name="desc" value={formData.desc} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="disease" className="form-label">disease</label>
                                        <input type="text" className="form-control" id="disease" name="disease" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <button type="submit" style={{ backgroundColor: "#d9376e", border: "2px solid #d9376e" }} className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!isFormOpen && <div>
                {isAdmin ? (
                    <h2>All Appointments</h2>
                ) : (
                    <h2>Your Appointments</h2>
                )}
                <table className="table table-borderless table-hover custom-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            {(isDoctor || isAdmin) && <th>Patient Name</th>}
                            <th>Doctor Name</th>
                            {(isDoctor || isAdmin) && <th>Patient Address</th>}
                            {!isDoctor && <th>Doctor Address</th>}
                            <th>Timestamp</th>
                            <th>Date of Booking</th>
                            <th>Time of Booking</th>
                            <th colSpan={2}>Payment Status</th>
                            {!isAdmin && <th> Consultation Fee</th>}
                            {!isAdmin && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isAdmin && !isDoctor && appointments.map((appointment, index) => (
                            <tr key={index + 1} style={{ textAlign: 'center' }}>
                                {<td>{appointment[0]}</td>}
                                <td>{appointment[1]}</td>
                                {<td>{appointment[2]}</td>}
                                <td>
                                    {appointment[3]}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>{copied ? 'Copied!' : 'Copy to Clipboard'}</Tooltip>}
                                    >
                                        <Button variant="link" onClick={() => copyButton(appointment[3])}>
                                            <BsClipboard size={20} style={{ fill: '#d9376e' }} />
                                        </Button>
                                    </OverlayTrigger>
                                </td>
                                <td>{appointment[4].toNumber()}</td>
                                <td>{toDate(appointment[5].toNumber())}</td>
                                <td>{appointment[6]}</td>
                                <td>{!appointment[7] && <button className="btn btn-primary" style={{ backgroundColor: '#ff8e3c', color: '#fffffe', borderColor: '#ff8e3c' }}>Pending</button>}</td>
                                <td>{appointment[7] && <button className="btn btn-primary" style={{ backgroundColor: '#d9376e', color: '#fffffe', borderColor: '#d9376e' }}>Paid</button>}</td>
                            </tr>
                        ))}

                        {isDoctor && !isAdmin && appointments.map((appointment, index) => (
                            appointment[1] === doctorAddress && appointment[9] === false && (
                                <tr key={index} style={{ textAlign: 'center' }}>
                                    {<td>{appointment[0]}</td>}
                                    <td>{appointment[1]}</td>
                                    {<td>{appointment[2]}</td>}
                                    <td>{appointment[4].toNumber()}</td>
                                    <td>{toDate(appointment[5].toNumber())}</td>
                                    <td>{appointment[6]}</td>
                                    <td>{!appointment[7] && <button className="btn btn-primary" style={{ backgroundColor: '#ff8e3c', color: '#fffffe', borderColor: '#ff8e3c' }} onClick={() => doPayment(appointment[4], appointment[3], appointment[8])}>Pending</button>}</td>
                                    <td>{appointment[7] && <button className="btn btn-primary" style={{ backgroundColor: '#d9376e', color: '#fffffe', borderColor: '#d9376e' }}>Paid</button>}</td>
                                    <td>{appointment[8].toNumber()}</td>
                                    <td><button className="btn btn-primary" style={{ backgroundColor: '#A34343', color: '#fffffe', borderColor: '#A34343' }} onClick={() => handleAppCompleteClick(appointment[4])}>Complete</button></td>
                                </tr>
                            )
                        ))}

                        {!isAdmin && !isDoctor && appointments.map((appointment, index) => (
                            appointment[0] === patientData.name && appointment[9] === false && (
                                <tr key={index} style={{ textAlign: 'center' }}>
                                    <td>{appointment[1]}</td>
                                    <td>
                                        {appointment[3]}
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>{copied ? 'Copied!' : 'Copy to Clipboard'}</Tooltip>}
                                        >
                                            <Button variant="link" onClick={() => copyButton(appointment[3])}>
                                                <BsClipboard size={20} style={{ fill: '#d9376e' }} />
                                            </Button>
                                        </OverlayTrigger>
                                    </td>
                                    <td>{appointment[4].toNumber()}</td>
                                    <td>{toDate(appointment[5].toNumber())}</td>
                                    <td>{appointment[6]}</td>
                                    <td>{!appointment[7] && <button className="btn btn-primary" style={{ backgroundColor: '#ff8e3c', color: '#fffffe', borderColor: '#ff8e3c' }} onClick={() => doPayment(appointment[4], appointment[3], appointment[8])}>Pending</button>}</td>
                                    <td>{appointment[7] && <button className="btn btn-primary" style={{ backgroundColor: '#d9376e', color: '#fffffe', borderColor: '#d9376e' }}>Paid</button>}</td>
                                    <td>{appointment[8].toNumber()}</td>
                                    <td><button className="btn btn-primary" style={{ backgroundColor: '#A34343', color: '#fffffe', borderColor: '#A34343' }} onClick={() => deleteAppointment(appointment[4], appointment[7])}>Delete</button></td>
                                </tr>
                            )
                        ))}

                    </tbody>
                </table>
            </div>}
        </div>
    );
}

export default Appointments;
