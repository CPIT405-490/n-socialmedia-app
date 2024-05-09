import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../firebase';
import "./AddMessageForm.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddMessageForm = ({ onClose, uid, username }) => {
    const [tweetText, setTweetText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [url, setUrl] = useState("");
    const [postId, setPostId] = useState(uuidv4());
    const [img, setImg] = useState("");

    const handleImageUpload = async () => {
        try {
            if (imageFile) {
                const storageRef = ref(storage, url);
                await uploadBytes(storageRef, imageFile);
                const downloadUrl = await getDownloadURL(storageRef);
                setImg(downloadUrl);
                return downloadUrl; // Return the URL for immediate use
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleSubmit = async () => {
        let imageUrl = img;

        if (imageFile) {
            imageUrl = await handleImageUpload(); // Wait for the upload and get the URL
        }

        const postData = {
            uid: uid,
            id: postId,
            username: username,
            text: tweetText,
            timestamp: Timestamp.now(),
            image: imageUrl
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

        await updateDoc(userDocRef, { roars: (userDocSnap.data().roars || 0) + 1 });

        onClose();
    };

    return (
        <div className="floating-screen">
            <h2>Add Message</h2>
            <div className="floating-content">
                <textarea
                    className="floating-txt-area"
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    placeholder="Enter your tweet..."
                    rows={4}
                    cols={50}
                />
                <input
                    className="floating-btn-2"
                    type="file"
                    onChange={(e) => {
                        setImageFile(e.target.files[0]);
                        setUrl(`images/${uid}/image-${postId}`);
                    }}
                />
                <button className="floating-btn-1" onClick={handleSubmit}>Submit</button>
                <button className="floating-btn-1" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddMessageForm;
