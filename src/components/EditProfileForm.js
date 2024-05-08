import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { firestore, storage } from '../firebase';
import "./EditProfileForm.css";

const EditProfileForm = ({ onClose, uid }) => {
    const [bio, setBio] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleImageUpload = async () => {
        try {
            if (imageFile) {
                const storageRef = ref(storage,`avatars/${uid}/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                
                
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            await handleImageUpload();
    
            const updateData = {};
    
      
            if (imageFile) {
                updateData.avatar = `avatars/${uid}/${imageFile.name}`;
            }
    
            if (bio.trim() !== "") {
                updateData.bio = bio;
            }
    
            // Check if there are any fields to update
            if (Object.keys(updateData).length > 0) {
                await updateDoc(doc(firestore, "Users", uid), updateData);
                onClose();
            } else {
                console.error("No fields to update.");

            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    
    

    return (
        <div className="floating-screen">
            <div className="floating-content">
                <h2>Edit Profile</h2>
        
                <label>Avatar:</label>
                <input
                    type="file"
                    onChange={(e) => {
                        setImageFile(e.target.files[0])
                        }}
                />
                <label>Bio:</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EditProfileForm;
