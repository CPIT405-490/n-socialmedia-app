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
           
            const userCredential = await signInWithEmailAndPassword(auth,email,password)

            navigate(`/Home/${userCredential.user.uid}`)
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className="signin-container">
                <img className="iconPro" width="200" height="200"
                    src="https://cdn-icons-png.flaticon.com/512/4564/4564089.png" alt="Logo" />
                <h2 className='intHeaders1'>Sign In</h2>
                <form className="form-container" onSubmit={handleSignIn}>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </>
    );
}

export default SignIn;