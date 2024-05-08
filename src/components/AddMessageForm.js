import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore } from '../firebase';

const AddMessageForm = ({ onClose, uid }) => {
    const [tweetText, setTweetText] = useState("");

    const handleSubmit = async () => {
        const roarsCollectionRef = collection(firestore, "Users", uid, "Roars");

    
        const timestamp = serverTimestamp();

        const messageData = {
            text: tweetText,
            timestamp: timestamp
        };
        
        await setDoc(doc(roarsCollectionRef), messageData);

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
