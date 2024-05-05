import React, { useContext, useEffect, useState } from 'react';
import MyContext from '../MyContext';
import { CONTRACT_ADDRESS_APPOINTMENT, ABI_APPOINTMENT } from '../Constants';
import { ethers } from 'ethers';
import Web3 from 'web3';


const History = () => {
    const { isAdmin, patientData, isDoctor, doctorAddress } = useContext(MyContext);
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Accounts now exposed
                await window.ethereum.request({ method: 'eth_accounts' });
            } catch (error) {
                console.error('User denied account access');
            }
        } else {
            console.error('MetaMask not detected');
        }
    };

    useEffect(() => {
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

        fetchData();
        connectToMetaMask();
    }, []);

    useEffect(() => {
        // Filter appointments based on search query, selected month, and selected year
        const filtered = appointments.filter(appointment => {
            const doctorName = appointment[1].toLowerCase();
            const patientName = appointment[0].toLowerCase();
            const query = searchQuery.toLowerCase();
            const appointmentDate = new Date(appointment[5].toNumber() * 1000);
            const appointmentMonth = appointmentDate.getMonth() + 1;
            const appointmentYear = appointmentDate.getFullYear();
            return (doctorName.includes(query) || patientName.includes(query)) &&
                (!selectedMonth || appointmentMonth === selectedMonth) &&
                (!selectedYear || appointmentYear === selectedYear);
        });
        setFilteredAppointments(filtered);
    }, [appointments, searchQuery, selectedMonth, selectedYear]);

    function toDate(timestamp) {
        const dob = new Date(parseInt(timestamp.toString()) * 1000);
        const day = dob.getDate().toString().padStart(2, '0');
        const month = (dob.getMonth() + 1).toString().padStart(2, '0');
        const year = dob.getFullYear();
        const formattedDOB = `${day}/${month}/${year}`;
        return formattedDOB;
    }

    // January to December
    const months = Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        return <option key={monthNum} value={monthNum}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>;
    });

    // 2024 to 2030
    const years = Array.from({ length: 7 }, (_, i) => {
        const yearNum = 2024 + i;
        return <option key={yearNum} value={yearNum}>{yearNum}</option>;
    });

    return (
        <div className='poppins-regular' style={{ background: '#eff0f3', minHeight: '100vh', paddingTop: '1px', padding: '20px' }}>
            <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    placeholder="Search by doctor or patient name"
                    style={{ marginBottom: '10px' }}
                />
                <div style={{ display: 'flex'}}>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="form-select"
                        style={{ width: '120px' }}
                    >
                        <option value="">Select Month</option>
                        {months}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="form-select"
                        style={{ marginLeft: '10px', width: '120px' }}
                    >
                        <option value="">Select Year</option>
                        {years}
                    </select>
                </div>
            </div>
            <table className="table table-borderless table-hover custom-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        {<th>Patient Name</th>}
                        <th>Doctor Name</th>
                        <th>Date of Appointment</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {!isAdmin && isDoctor && filteredAppointments.map((appointment, index) => (
                        appointment[1] === doctorAddress && appointment[9] === true && (
                            <tr key={index} style={{ textAlign: 'center' }}>
                                {<td>{appointment[0]}</td>}
                                <td>{appointment[1]}</td>
                                <td>{toDate(appointment[5].toNumber())}</td>
                                <td>{appointment[10]}</td>
                            </tr>
                        )
                    ))}
                    {!isAdmin && !isDoctor && filteredAppointments.map((appointment, index) => (
                        appointment[0] === patientData.name && appointment[9] === true && (
                            <tr key={index} style={{ textAlign: 'center' }}>
                                {<td>{appointment[0]}</td>}
                                <td>{appointment[1]}</td>
                                <td>{toDate(appointment[5].toNumber())}</td>
                                <td>{appointment[10]}</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default History;
