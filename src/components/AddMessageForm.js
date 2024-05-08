import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { firestore } from '../firebase';
import "./AddMessageForm.css";

const AddMessageForm = ({ onClose, uid ,username}) => {
    const [tweetText, setTweetText] = useState("");

    const handleSubmit = async () => {

        const postId = uuidv4();

        const postData = {
            uid : uid,
            id: postId,
            username: username,
            text: tweetText,
            timestamp: Timestamp.now()
        };
    
        const roarsDocRef = doc(firestore, "Roars", uid);
        const roarsDocSnap = await getDoc(roarsDocRef);
    
        
        if (roarsDocSnap.exists()) {
            const existingMessages = roarsDocSnap.data().posts || [];
            const updatedMessages = [...existingMessages, postData];
    
            await setDoc(roarsDocRef, { posts: updatedMessages });
        } else {
           
            await setDoc(roarsDocRef, { posts: [postData] });
        }
    
        const userDocRef = doc(firestore, "Users", uid);
        const userDocSnap = await getDoc(userDocRef);

        await updateDoc(userDocRef, { roars: userDocSnap.data().roars+1 });

        onClose();
    };
    

    return (
        <div className="floating-screen">
            <div className="floating-content">
                <h2>Add Tweet</h2>
                <textarea
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    placeholder="Enter your tweet..."
                    rows={4}
                    cols={50}
                />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddMessageForm;
