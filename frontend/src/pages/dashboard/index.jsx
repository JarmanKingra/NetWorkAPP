import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Dashboard() {

    const router = useRouter();

    const dispatch = useDispatch();
    const [isTokenThere, setisTokenThere] = useState(false);

    useEffect(() => {
        if(localStorage.getItem("token") == null){
            router.push("/login");
        }
        setisTokenThere(true);
    })

    useEffect(() => {
        if(isTokenThere){
            dispatch(getAllPosts());
            dispatch(getAboutUser({token: localStorage.getItem('token')}))
        } 
    }, [isTokenThere])
    return (
        <div>
        <h1>Dashboard</h1>
        </div>
    )
}