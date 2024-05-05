export const CONTRACT_ADDRESS_PATIENT = "0xb9efe6d85f31e542366934b6dfa26226edfbf442"
export const ABI_PATIENT = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fileName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "addFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "address1",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBirth",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isMale",
				"type": "bool"
			}
		],
		"name": "addPerson",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "cid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fileNames",
				"type": "string"
			}
		],
		"name": "fileAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "address1",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "publicAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dateOfBirth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isMale",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "string[]",
				"name": "files",
				"type": "string[]"
			}
		],
		"name": "newPerson",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAllPersons",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "password",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "address1",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "publicAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "dateOfBirth",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isMale",
						"type": "bool"
					},
					{
						"internalType": "string[]",
						"name": "files",
						"type": "string[]"
					},
					{
						"internalType": "string[]",
						"name": "fileNames",
						"type": "string[]"
					}
				],
				"internalType": "struct User.Person[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export const CONTRACT_ADDRESS_DOCTOR = "0xf82b1a4d7d10ada2796f0acccf297e4c81d00358"
export const ABI_DOCTOR = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "specialty",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "charge",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "publicAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "newDoctor",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "specialty",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "charge",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "publicAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "addDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllDoctors",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "specialty",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "charge",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "publicAddress",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "cid",
						"type": "string"
					}
				],
				"internalType": "struct User.Doctor[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const CONTRACT_ADDRESS_APPOINTMENT = "0x20802c2ccfaadcb1c5f35888b9ce676778a330be"
export const ABI_APPOINTMENT = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "doctorName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "doctorAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "timeOfBooking",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isPaid",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "charge",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "desc",
				"type": "string"
			}
		],
		"name": "newAppointment",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "patientName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "doctorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "patientAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "doctorAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "timeOfBooking",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "charge",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "desc",
				"type": "string"
			}
		],
		"name": "addAppointment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "deleteAppointment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "doPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllAppointment",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "patientName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "doctorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "patientAddress",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "doctorAddress",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dateOfBooking",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "timeOfBooking",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "charge",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "desc",
						"type": "string"
					}
				],
				"internalType": "struct AppointmentContract.Appointment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "desci",
				"type": "string"
			}
		],
		"name": "markComplete",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

export const CONTRACT_ADDRESS_DISEASE = "0xE7C139c6562229C7f04b4Da3cB3eef8F6686514B"
export const ABI_DISEASE = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "diseaseName",
				"type": "string"
			}
		],
		"name": "addDisease",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "diseaseName",
				"type": "string"
			}
		],
		"name": "addTimestamp",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "diseaseName",
				"type": "string"
			}
		],
		"name": "incrementDiseaseCount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "diseaseName",
				"type": "string"
			}
		],
		"name": "getAllTimestampForDisease",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256[]",
						"name": "timestamps",
						"type": "uint256[]"
					}
				],
				"internalType": "struct DiseaseContract.Data[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "diseaseName",
				"type": "string"
			}
		],
		"name": "getDiseasePatients",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
