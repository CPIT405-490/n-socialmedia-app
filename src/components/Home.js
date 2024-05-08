import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import AddMessageForm from "./AddMessageForm";
import NavBar from "./HomeHeader";

const Home = () => {
    const params = useParams();
    const uid = params.uid;
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showAddTweetForm, setShowAddTweetForm] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const docSnap = await getDoc(doc(firestore, "Users", uid));
            setUserData(docSnap.data());
        };

        const fetchMessages = () => {
            const roarsCollectionRef = collection(firestore, "Users", uid, "Roars");
            const q = query(roarsCollectionRef);

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messagesData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    const timestamp = data.timestamp ? data.timestamp.toDate() : null;
                    
                    messagesData.push({ id: doc.id, ...data, timestamp });
                });
                setMessages(messagesData);
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
                <button className="floating-button" onClick={() => setShowAddTweetForm(true)}>
                    +
                </button>
                <div>
                    <h2>Messages</h2>
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>
                                <p>{message.text}</p>
                                
                                {message.timestamp && (
                                    <p>Sent at: {message.timestamp.toLocaleString()}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showAddTweetForm && <AddMessageForm onClose={() => setShowAddTweetForm(false)} uid={uid} />}
        </>
    );
};

export default Home;
