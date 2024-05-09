import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

import { auth, firestore } from '../firebase';
import Header from './Header';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            
             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
             const user =  userCredential.user;

            
             await setDoc(doc(firestore, "Users", `${user.uid}`), {
                email: email,
                username: username,
                avatar:"",
                bio:"",
                roars:0,
              });

            navigate("/");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className="signup-container">
                <img className="iconPro" width="200" height="200"
                    src="https://cdn-icons-png.flaticon.com/512/4564/4564089.png" alt="Logo" />
                <h2 className='intHeaders1'>Sign Up</h2>
                <form className="form-container" onSubmit={handleSignUp}>
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
