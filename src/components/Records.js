    import React, { useContext, useEffect, useState } from 'react';
    import MyContext from '../MyContext';
    import { CONTRACT_ADDRESS_PATIENT, ABI_PATIENT } from '../Constants';
    import { ethers } from 'ethers';
    import Web3 from 'web3';
    import '../global-styles.css';

      
    const Records = () => {
        const { isAdmin, patientData, isDoctor } = useContext(MyContext);
        const [persons, setPersons] = useState([]);
        const [searchQuery, setSearchQuery] = useState('');
        const [recordsOpen, setRecordsOpen] = useState(false);
        const [cids, setCids] = useState([]);
        const [fileName, setFileNames] = useState([]);

        const VITE_GATEWAY_URL = 'https://orange-known-worm-405.mypinata.cloud'
        

        const openLinkInNewTab = (url) => {
            window.open(url, '_blank');
        };
    

        const filteredPersons = persons.filter(person =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

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

        const getRecords = (param, param1) => {
            console.log('Button clicked with parameter:', param);
            // const reversedArray = [...array].reverse();
            // setArray(reversedArray);
            const reversedCids = [...param].reverse();
            const reversedFileNames = [...param1].reverse();
            setCids(reversedCids);
            setFileNames(reversedFileNames);
            setRecordsOpen(true);
        }
        const openLink = (link) => {
            const cidLink = `${VITE_GATEWAY_URL}/ipfs/${link}`;
            openLinkInNewTab(cidLink);
          };
        return(
    <div className='poppins-regular' style={{ textAlign: 'left',background:"#eff0f3",minHeight: '100vh', padding:'20px'}}>
                <h2>Reports & Records</h2>
                <div className="mb-3">
                    <input
                        type="text" 
                        className="form-control"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {!recordsOpen && (
                    <table className="table table-borderless table-hover custom-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isAdmin||isDoctor) && filteredPersons.map((person, index) => (
                            (<tr key={index}>
                                <td>{person.name}</td>
                                <td>{person.email}</td>
                                <td>{toDOB(person.dateOfBirth.toNumber())}</td>
                                <td>{person.isMale ? 'Male' : 'Female'}</td>
                                <td><button className="btn btn-primary me-3" style={{ backgroundColor: '#ff8e3c', color: '#fffffe' ,borderColor: '#ff8e3c'}} onClick={() => getRecords(person.files, person.fileNames)}>Show Records</button></td>
                            </tr>)
                        ))}
                        {persons.map((person, index) => (
                            person.name === patientData.name && (<tr key={index}>
                                <td>{person.name}</td>
                                <td>{person.email}</td>
                                <td>{toDOB(person.dateOfBirth.toNumber())}</td>
                                <td>{person.isMale ? 'Male' : 'Female'}</td>
                                <td><button className="btn btn-primary me-3" style={{ backgroundColor: '#ff8e3c', color: '#fffffe' ,borderColor: '#ff8e3c'}} onClick={() => getRecords(person.files, person.fileNames)}>Show Records</button></td>
                            </tr>)
                        ))}
                    </tbody>
                </table>
                )}
                {recordsOpen && (
                    <table className="table table-borderless table-hover custom-table">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>CID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cids.map((cid, index) => (
                            <tr key={index}>
                            
                                <td>{fileName[index]}</td>
                                <td>{cid}</td>
                                <td><button className="btn btn-primary me-3 mt-3" style={{ backgroundColor: '#d9376e', color: '#fffffe' ,borderColor: '#d9376e'}} onClick={() => openLink(cid)}>Open in New Tab</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>

        );
    };

    export default Records;