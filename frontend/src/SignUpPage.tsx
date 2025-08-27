import React, { useState } from "react";
import { Avatar, Container, Paper, Typography, Box, TextField, Button, Grid2, Link, IconButton } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerUser } from "./api";
import Logo from './logo.png';

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState(""); 
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate(); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        let hasError = false;
        if (!email.includes("@")) {
            setEmailError("Invalid email address");
            hasError = true;
        } else {
            setEmailError("");
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        } else {
            setConfirmPasswordError("");
        }

        if (!hasError) {
            try {
                const result = await registerUser(email, password);
                setSuccessMessage("Registration successful. Please check your email to verify your account.");
                setApiError("");
                
            } catch (error) {
                setApiError(`${error}`);
                setSuccessMessage("");
            }
        }
    };

    return (
        <Container 
            maxWidth="xs"
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '90vh',
                padding: 2 
            }}
        >
            <Paper elevation={10} sx={{ padding: 2, width: '100%', maxWidth: '400px' }}>
                <Avatar sx={{
                    mx: "auto",
                    bgcolor:"#212121",
                    textAlign: "center",
                    mb: 2,
                }} >
                    <AccountCircleOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
                    Sign Up
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField 
                        placeholder="Enter email" 
                        fullWidth 
                        required 
                        autoFocus 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                        sx={{ mb: 2 }}
                    />

                    <TextField 
                        placeholder="Enter password" 
                        fullWidth 
                        required 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />

                    <TextField 
                        placeholder="Confirm password" 
                        fullWidth 
                        required 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    aria-label="toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />

                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        sx={{
                            mt: 2, 
                            bgcolor: "black", 
                            color: "white", 
                            '&:hover': { bgcolor: "#ffca28" }
                        }}
                    >
                        Sign Up
                    </Button>

                    {apiError && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {apiError}
                        </Typography>
                    )}
                    
                    {successMessage && (
                        <Typography color="success.main" sx={{ mt: 2 }}>
                            {successMessage}
                        </Typography>
                    )}
                </Box>

                <Grid2 container justifyContent='flex-end' sx={{ mt: 2 }}>
                    <Grid2>
                        <Link 
                            component={RouterLink} 
                            to="/login"
                            sx={{ color: '#212121', textDecoration: 'none', '&:hover': { color: '#ffca28' } }}
                        >
                            Already have an account? Sign In
                        </Link>
                    </Grid2>
                </Grid2>
            </Paper>
        </Container>
    );
}

export default SignUpPage;
