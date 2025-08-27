import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid2,
  Link,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { resetpassword } from "./api";

const fieldtheme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#e1e2e6",
          border: "0px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "0px",
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          },
          borderRadius: 10,
        },
      },
    },
  },
});

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailmsg, setemailmsg] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      try {
        await resetpassword(email);
        setemailmsg(`Reset password link submitted`);
      } catch (error) {
        setemailmsg("Sorry something went wrong");
      }
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: "7%",
          vw: "90%",
          maxWidth: "450px",
          borderRadius: "5%",
          backgroundColor: "#f3f3f3",
        }}
      >
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "#212121",
            textAlign: "center",
            mb: 2,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Forgot Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <ThemeProvider theme={fieldtheme}>
            <TextField
              placeholder="Enter your email"
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "#ffca28" },
              }}
            >
              Submit
            </Button>
            {emailmsg && (
              <Typography color="black" sx={{ mt: 2 }}>
                {emailmsg}
              </Typography>
            )}
          </ThemeProvider>
        </Box>

        <Grid2 container justifyContent="center" sx={{ mt: 2 }}>
          <Grid2>
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: "#212121",
                textDecoration: "none",
                "&:hover": { color: "#ffca28" },
              }}
            >
              Back to Login
            </Link>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
