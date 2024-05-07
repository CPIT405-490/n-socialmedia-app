import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Header from './Header';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
           
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/Home")
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className="signin-container">
                <h2>Sign In</h2>
                <form onSubmit={handleSignIn}>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </>
    );
}

export default SignIn;