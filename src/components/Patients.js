import React, { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS_PATIENT, ABI_PATIENT } from '../Constants';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../global-styles.css';
import { FaUpload } from 'react-icons/fa';


const Patients = () => {
    const [persons, setPersons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [cid, setCid] = useState('');
    const VITE_PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzM2YzM2Y4MC1mOWRhLTQ5NzgtOGMwOC1jOTU3N2FjOGQ2MzIiLCJlbWFpbCI6InByaXlhbmthY2hvd2RodXJ5MjAwMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODNmNzA3YTI4YjU1YzM1ZTQ4NTkiLCJzY29wZWRLZXlTZWNyZXQiOiJhZTZhNzlhYzAwMThiOTRiYjhkMmFlNWMyOGY1MTE3YmRiMTJlYjhkMTc1OGE4MDNlNzAxZjk2NjU5YTNmZmM4IiwiaWF0IjoxNzEyOTQwNjU0fQ.rIs3X-NIOJHGi0Nzu0VsJ3i_EM1bMGkrByQPvjdJNwI'
    const getFileInput = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      
    //   console.log("Selected File Name: " + selectedFile.name)
    };

    const handleSubmission = async () => {
        console.log("Uploading to IPFS...")
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
            console.log("IPFS Hash: " + resData.IpfsHash);
        } catch (error) {
            console.log(error);
        }
    }

    function toDOB(timestamp) {
        const dob = new Date(timestamp);
        const day = dob.getDate().toString().padStart(2, '0');
        const month = (dob.getMonth() + 1).toString().padStart(2, '0');
        const year = dob.getFullYear();
        const formattedDOB = `${day}/${month}/${year}`;
        return formattedDOB;
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(11155111) }]
                });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS_PATIENT, ABI_PATIENT, signer);
                const persons = await contract.getAllPersons();
                setPersons(persons);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchPatients();
    }, []);

    function copyButton() {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addFileToPatient = async (name) => {
        console.log(selectedFile);
        console.log('Button clicked with name:', name);
        await handleSubmission();
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS_PATIENT, ABI_PATIENT, signer);
            const persons = await contract.addFile(name, selectedFile.name, cid);
            await persons.wait();
            
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    }
    return (
        <div className='poppins-regular' style={{ textAlign: 'left',background:"#eff0f3",minHeight: '100vh', padding:'20px'}}>
            <h2>Patients</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <table className="table table-borderless table-hover custom-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Public Address</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPersons.map((person, index) => (
                        <tr key={index}>
                            <td>{person.name}</td>
                            <td>{person.email}</td>
                            <td>{person.address1}</td>
                            <td>{person.publicAddress}</td>
                            <td>{toDOB(person.dateOfBirth.toNumber())}</td>
                            <td>{person.isMale ? 'Male' : 'Female'}</td>
                            <td><input className="form-control" type="file" onChange={getFileInput} required />
                            <div className='mt-2'>
                            <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>{copied ? 'Uploaded!' : 'Click to Upload'}</Tooltip>}
                                    >
                                        <Button variant="link" onClick={() => copyButton()}>
                                            <FaUpload className='me-2' onClick={handleSubmission}></FaUpload>
                                        </Button>    
                                    </OverlayTrigger>
                            <button className="btn btn-primary" style={{ backgroundColor: "#ff8e3c", border: "2px solid #ff8e3c" }} onClick={() => addFileToPatient(person.name)}>Submit</button></div>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Patients;
