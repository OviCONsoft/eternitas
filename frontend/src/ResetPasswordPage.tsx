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
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { updatepassword } from "./api";

const url = window.location.href;
const urlParams = new URLSearchParams(url.split("#")[1]);
const accessToken = urlParams.get("access_token");
const refreshToken = urlParams.get("refresh_token");

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

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, resetstatus] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

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
        document.cookie = `access_token_Eternitas=${accessToken}; SameSite=Strict;`;
        document.cookie = `refresh_token_Eternitas=${refreshToken}; SameSite=Strict;`;
        const result = await updatepassword(password);
        resetstatus("Password update successful");
      } catch (error) {
        resetstatus(`${error}`);
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
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <ThemeProvider theme={fieldtheme}>
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
                "&:hover": { bgcolor: "#ffca28" },
              }}
            >
              Submit
            </Button>
            {status && (
              <Typography color="black" sx={{ mt: 2 }}>
                {status}
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

export default ResetPasswordPage;
