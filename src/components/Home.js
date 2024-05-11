import { collection, doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { firestore, storage } from "../firebase";
import "./Home.css";

import AddMessageForm from "./AddMessageForm";
import HomeNavBar from "./HomeNavBar";

const Home = () => {
    const params = useParams();
    const uid = params.uid;
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showAddTweetForm, setShowAddTweetForm] = useState(false);

    const fetchAvatar = async (userId) => {
        try {
            const userDoc = await getDoc(doc(firestore, "Users", userId));
            const userData = userDoc.data();
            if (userData && userData.avatar) {
                return userData.avatar;
            } else {
               
                return "";
            }
        } catch (error) {
            console.error("Error fetching avatar:", error);
            
            return "";
        }
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
                            avatar: avatar,
                            path: post.PostImg,
                            likes: post.likes,
                            dislikes: post.dislikes
                        });
                    }
                }

                postsData.sort((a, b) => b.timestamp - a.timestamp);
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

    const handleLike = async (postId) => {
        try {
            const postRef = doc(firestore, "Roars", uid);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const existingPosts = postSnap.data().posts || [];
                const updatedPosts = existingPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, likes: post.likes + 1 };
                    }
                    return post;
                });
                await updateDoc(postRef, { posts: updatedPosts });
            }
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };
    
    const handleDislike = async (postId) => {
        try {
            const postRef = doc(firestore, "Roars", uid);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const existingPosts = postSnap.data().posts || [];
                const updatedPosts = existingPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, dislikes: post.dislikes + 1 };
                    }
                    return post;
                });
                await updateDoc(postRef, { posts: updatedPosts });
            }
        } catch (error) {
            console.error("Error updating dislike:", error);
        }
    };


    return (
        <>
            <HomeNavBar  />
            <div className="home">
                <button className="floating-button" onClick={() => setShowAddTweetForm(true)}>+</button>
                <div className="homme"  height="auto">
                    <div className="homme2"  height="auto">
                        {userData && <p className="welcomemsg">--Welcome to the chat <strong>{userData.username}</strong>!--</p>}
                        {posts.map((post) => (
                            <>
                                <div key={post.id} className="message-container">
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
                                            <p className="message-text">{post.text}</p>
                                            {post.path && <img src={`https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/${encodeURIComponent(post.path)}?alt=media`} alt="post_picture" width="200" height="200" />}
                                        </div>
                                        <div className="message-footer">
                                            <p>Sent at: {post.timestamp.toLocaleString()}</p>
                                        </div>
                                    </Link>
                                </div>

                                <div className="like-dislike-buttons">
                                <button  className="like-button" onClick={() => handleLike(post.id)}>Like 👍( {post.likes} )</button>
                                <button  className="dislike-button" onClick={() => handleDislike(post.id)}>Dislike 👎( {post.dislikes} )</button>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
            {showAddTweetForm && <AddMessageForm onClose={() => setShowAddTweetForm(false)} uid={uid} username={userData.username} />}
        </>
    );
};

export default Home;
