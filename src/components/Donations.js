import React, { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS_DISEASE, ABI_DISEASE } from '../Constants';
import { ethers } from 'ethers';
import Web3 from 'web3';
import '../global-styles.css';


const Donations = () => {
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState([]);

    const [showForm, setShowForm] = useState(false); // State to control the visibility of the form
    // Function to toggle the visibility of the form
    const toggleForm = () => {
        setShowForm(!showForm);
    };


    // Function to handle input change
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(11155111) }]
                });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS_DISEASE, ABI_DISEASE, signer);
                const persons = await contract.getData();
                console.log(persons)
                setData(persons)

            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchPatients();
    }, []);


    async function addDisease() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS_DISEASE, ABI_DISEASE, signer);
            const persons = await contract.addDisease(inputValue);
            console.log(persons)

        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    }

    async function addPatient(inputVal) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(11155111) }]
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS_DISEASE, ABI_DISEASE, signer);
            const persons = await contract.addTimestamp(inputVal);
            console.log(persons)


        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    }
    function timestampToDateTime(timestamp) {
        // Create a new Date object with the timestamp in milliseconds
        const date = new Date(timestamp * 1000);

        // Get the date and time components
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        // Format the date and time
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    }

    
    return (
        <div className='poppins-regular' style={{ background:'#eff0f3', minHeight: '100vh', paddingTop: '1px',padding:'20px' }} >
            {showForm && (
                <div
                    className="position-fixed p-4 rounded border "
                    style={{ bottom: '80px', right: '20px', width: '300px', zIndex: '9998' , backgroundColor:"#fffffe"}}
                >
                    <button type="button" className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={toggleForm}></button>
                    <label className='m-2' style={{ textAlign: 'left' }}>Enter New Disease</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        id="dname"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter new disease"
                    />
                    <div class="alert" role="alert" style={{backgroundColor: '#ffeaf4', borderColor: '#d9376e', color: '#d9376e'}}>
                        Ensure to add a new disease only if it hasn't been added already.
                    </div>
                    <button onClick={() => {
                        addDisease();
                        setInputValue('');
                        setShowForm(false);
                    }} className="btn btn-primary" style={{backgroundColor:"#d9376e", border:"#d9376e"}}>Submit</button>
                </div>
            )}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {data.map((item, index) => (
                    <div key={index} className="col">
                        <div className="card h-100 position-relative">
                            <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                <h5 className="card-title">{item[0]}</h5>
                                <p className="card-text" style={{ fontSize: '50px'}}>{item[1].length}</p>
                            </div>
                            <div className="card-footer text-muted">
                                <label>Last Updated At</label><br></br>
                                <span><i>{item[1].length > 0 ? timestampToDateTime(item[1][item[1].length - 1].toNumber()) : "Patient Not Added"}</i></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Donations;