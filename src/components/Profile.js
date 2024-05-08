import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import NavBar from "./HomeHeader";

const Profile =  () =>  {


    const params = useParams()

    const uid = params.uid

    const [data,SetData] = useState(null)

    useEffect(() => {

        const UploadHome = async () => {

            const docSnap = await getDoc(doc(firestore, "Users", uid));

           
            SetData(docSnap.data())

        }

        UploadHome()

    }

        , [uid])


        return data&&(
            <>
                <NavBar />
                <div className="home">
                    <h1>Hello {data.email}</h1>
                </div>
            </>
        );


}

export default Profile