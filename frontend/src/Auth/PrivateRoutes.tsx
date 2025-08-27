import { Outlet, Navigate } from 'react-router-dom'
import React,{useState,useContext} from 'react'
import axios from 'axios';
import { AuthContext } from './Auth';


function PrivateRoutes(){
    const session = useContext(AuthContext);
    // console.log(session)

    return(
       session?.isAuthenticated ? <Outlet/> : <Navigate to = '/login'/>)
};

export {PrivateRoutes};