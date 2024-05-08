import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore, storage } from "../firebase";

import EditProfileForm from "./EditProfileForm";
import NavBar from "./HomeHeader";

import "./Profile.css";

const Profile = () => {
    const params = useParams();
    const uid = params.uid;
    const [data, setData] = useState(null);
    const [showEditProfileForm, setEditProfileForm] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const docSnap = await getDoc(doc(firestore, "Users", uid));
            setData(docSnap.data());
        };

        fetchUserData();

        const unsubscribe = onSnapshot(doc(firestore, "Users", uid), (docSnapshot) => {
            setData(docSnapshot.data());
        });

        return () => unsubscribe();
    }, [uid]);

    useEffect(() => {
        const fetchAvatarUrl = async () => {
            if (data && data.avatar) {
                try {
                    const storageRef = ref(storage, data.avatar);
                    const url = await getDownloadURL(storageRef);
                    setUrl(url);
                } catch (error) {
                    console.error("Error fetching avatar URL:", error);
                }
            }
        };

        fetchAvatarUrl();
    }, [data]);

    return data && (
        <div className="whole-profile-container">
            <NavBar />
            <h1>Profile</h1>

            <button className="floating-button" onClick={() => setEditProfileForm(true)}>✏️</button>

            <div className="profile-container1">

                <img src={url || "https://icons.iconarchive.com/icons/paomedia/small-n-flat/128/profile-icon.png"}
                    alt="profile_picture"
                    width="200" height="200" />

                <h1 className="name">{data.username}</h1>
                <div className="stats-container">
                    <div className="stat-box">
                        <div className="number">{data.roars}</div>
                        <div className="label">Messages</div>
                    </div>
                </div>
            </div>
            <div className="profile-container2">
                <h3 className="biohead">Bio:</h3>
                <p className="bio" name="bio">
                    {data.bio}
                </p>
            </div>

            {showEditProfileForm && <EditProfileForm onClose={() => setEditProfileForm(false)} uid={uid} />}

        </div>
    );
};

export default Profile;
