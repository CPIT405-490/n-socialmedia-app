import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

import { auth } from '../firebase';
import Header from './Header';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {

            await createUserWithEmailAndPassword(auth,email,password)
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </>
    );
}

export default SignUp;
