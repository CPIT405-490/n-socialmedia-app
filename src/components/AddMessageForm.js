import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../firebase';
import "./AddMessageForm.css";

const AddMessageForm = ({ onClose, uid, username }) => {
    const [tweetText, setTweetText] = useState("");
    const [postId, setPostId] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const handlePostSubmission = async () => {
            if (postId) {
                try {
                    await handleImageUpload();

                    const postData = {
                        uid: uid,
                        id: postId,
                        username: username,
                        text: tweetText,
                        timestamp: Timestamp.now(),
                        likes:0,
                        dislikes:0
                    };

                    if (imageFile) {
                        postData.PostImg = `postImg/${postId}/${imageFile.name}`;
                    }

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
                
                        await updateDoc(userDocRef, { roars: userDocSnap.data().roars + 1 });
                        onClose();
                    
                } catch (error) {
                    console.error("Error Adding a Post:", error);
                }
            }
        };

        handlePostSubmission();
    }, [postId]);

    const handleImageUpload = async () => {
        try {
            if (imageFile) {
                const storageRef = ref(storage, `postImg/${postId}/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            
            if (!tweetText) {
                alert("Please enter your tweet before submitting.");
                return;
            }
            const newPostId = uuidv4();
            setPostId(newPostId);
            setPostId(newPostId);
            setPostId(newPostId);
        } catch (error) {
            console.error("Error Adding a Post:", error);
        }
    };

    return (
        <div className="floating-screen">
            <h2>Add a Roar</h2>
            <div className="floating-content">
                <textarea
                    className="floating-txt-area"
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    placeholder="Enter your roar..."
                    rows={4}
                    cols={50}
                />
                <input
                    className="floating-btn-2"
                    type="file"
                    onChange={(e) => {
                        setImageFile(e.target.files[0]);
                    }}
                />
                <button className="floating-btn-1" onClick={handleSubmit}>Submit</button>
                <button className="floating-btn-1" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddMessageForm;
