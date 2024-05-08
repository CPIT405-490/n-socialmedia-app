import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { firestore, storage } from "../firebase";
import "./Home.css";

import AddMessageForm from "./AddMessageForm";
import NavBar from "./HomeHeader";

const Home = () => {
    const params = useParams();
    const uid = params.uid;
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showAddTweetForm, setShowAddTweetForm] = useState(false);


    const fetchAvatar = async (userId) => {
        const userDoc = await getDoc(doc(firestore, "Users", userId));
        return userDoc.data().avatar;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const docSnap = await getDoc(doc(firestore, "Users", uid));
            setUserData(docSnap.data());
        };

        const fetchMessages = () => {
            const roarsCollectionRef = collection(firestore, "Roars");
            const q = query(roarsCollectionRef);

            const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                const postsData = [];
                for (const doc of querySnapshot.docs) {
                    const data = doc.data();
                    const postsArray = data.posts || [];

                    for (const post of postsArray) {
                        const avatar = await fetchAvatar(post.uid);
                        postsData.push({
                            uid: post.uid,
                            id: post.id,
                            username: post.username,
                            text: post.text,
                            timestamp: post.timestamp.toDate(),
                            avatar: avatar
                        });
                    }
                }
                setPosts(postsData);
            });

            return unsubscribe;
        };

        fetchUserData();
        const unsubscribeMessages = fetchMessages();

        return () => {
            unsubscribeMessages();
        };
    }, [uid]);

    return (
        <>
            <NavBar />
            <div className="home">
                {userData && <h1>Hello {userData.username}</h1>}
                <button className="floating-button" onClick={() => setShowAddTweetForm(true)}>+</button>
                <div>
                    <h2>Messages</h2>
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id} className="message-container">
                                <Link to={`/Profile/${post.uid}`}>
                                    <div className="message-header">
                                        <img
                                            src={post.avatar !== "" ?
                                                `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/${encodeURIComponent(post.avatar)}?alt=media` :
                                                "https://icons.iconarchive.com/icons/paomedia/small-n-flat/128/profile-icon.png"}
                                            alt="profile_picture"
                                            width="35"
                                            height="35"
                                        />
                                        <span className="message-owner-name"><strong>{post.username}</strong></span>
                                    </div>
                                    <div className="message-body">
                                        <p>{post.text}</p>
                                        {post.timestamp && (
                                            <p>Sent at: {post.timestamp.toLocaleString()}</p>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showAddTweetForm && <AddMessageForm onClose={() => setShowAddTweetForm(false)} uid={uid} username={userData.username} />}
        </>
    );
};

export default Home;
