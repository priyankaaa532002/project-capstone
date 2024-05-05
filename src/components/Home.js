import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../global-styles.css';

const Home = () => {
  useEffect(() => {
  }, []);

  return (
    <div style={{ background:'#eff0f3', minHeight: '100vh', paddingTop: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1 className="poppins-bold" style={{ fontSize: '50px', color: '#0d0d0d', marginBottom: '20px' }}>Welcome to our Blockchain Health Platform</h1>
        <p className="poppins-regular" style={{ fontSize: '18px',color: '#2a2a2a', lineHeight: '1.6', marginBottom: '30px', paddingTop: '30px' }}>
          Our platform leverages blockchain technology to ensure data integrity and security in the healthcare industry.
          With blockchain, we guarantee tamper-proof records, secure data sharing, and enhanced patient privacy.
        </p>
        <Link to="/login">
          <button className="poppins-regular btn btn-primary" style={{ borderRadius: '8px', padding: '10px 30px', fontSize: '18px', backgroundColor: '#d9376e',color: "#fffffe", border: 'none', transition: 'background-color 0.3s', ':hover': { backgroundColor: '#f9bc60' } }}>Get Started</button>
        </Link>
      </div>
      <footer style={{ background: '#ff8e3c', color: '#001e1d', position: 'fixed', bottom: '0', left: '0', width: '100%', padding: '0px', textAlign: 'center'}}>
        <p className='poppins-regular'>&copy; 2024 Blockchain Health Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
