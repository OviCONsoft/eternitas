import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Container } from "@mui/material";

const EmailVerificationPage = () => {
    const { token } = useParams<{ token: string }>(); 
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_ENV}/api/verify_email/${token}`);
                
                if (!response.ok) {
                    throw new Error("Email verification failed");
                }
                setMessage("Email verified successfully! Redirecting to profile setup...");
                setTimeout(() => {
                    navigate("/profilepagesetup");
                }, 3000); 

            } catch (error) {
                setMessage("Email verification failed. Please try again.");
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center">
                {message}
            </Typography>
        </Container>
    );
};

export default EmailVerificationPage;
