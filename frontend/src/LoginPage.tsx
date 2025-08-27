import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid2,
  Link,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loginUser } from "./api";
import Logo from "./logo.png";
import { AuthContext } from "./Auth/Auth";
import SearchIcon from "@mui/icons-material/Search";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const session = useContext(AuthContext);
  const [ischecked, setChecked] = useState(false);

  useEffect(() => {
    if (session?.isAuthenticated) {
      navigate("/profile");
    }
  }, [session]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked); // Update state based on the checkbox status
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;
    if (!email.includes("@")) {
      setEmailError("Invalid email address");
      hasError = true;
    } else {
      setEmailError(" ");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else {
      setPasswordError(" ");
    }

    if (!hasError) {
      try {
        await loginUser(email, password, ischecked).then(() => {
          window.location.reload();
        });
      } catch (error) {
        setApiError(`${error}`);
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
        minHeight: "60vh",
        padding: 2,
      }}
    >
      <Box
        sx={{
          mb: { xs: 8, sm: 10, md: 12 },
          mt: { xs: 4, sm: 5, md: 8 },
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ width: "60%", maxWidth: "450px" }}
        />
      </Box>

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
        <Typography sx={{ textAlign: "center" }}>
          <img src={`${process.env.PUBLIC_URL}/lock.svg`} width="10%" />
        </Typography>

        <Typography
          component="h1"
          variant="h5"
          sx={{
            textAlign: "center",
            fontSize: { xs: "h6.fontSize", sm: "h5.fontSize" },
            fontWeight: "bold",
          }}
        >
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <ThemeProvider theme={fieldtheme}>
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
          </ThemeProvider>

          <FormControlLabel
            control={
              <Checkbox
                checked={ischecked}
                onChange={handleCheck}
                icon={
                  <CheckBoxOutlineBlankIcon
                    sx={{ color: "#e1e2e6", backgroundColor: "#e1e2e6" }}
                  />
                }
              />
            }
            label="Remember me"
            sx={{ color: "#808080", padding: 0 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              bgcolor: "black",
              color: "white",
              "&:hover": { bgcolor: "#ffca28" },
              padding: 2,
              borderRadius: 3,
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>Sign in</Typography>
          </Button>

          {apiError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {apiError}
            </Typography>
          )}
        </Box>

        <Grid2 container justifyContent="space-between" sx={{ mt: 2 }}>
          <Grid2>
            <Link
              component={RouterLink}
              to="/forgot"
              sx={{
                color: "#212121",
                textDecoration: "none",
                "&:hover": { color: "#ffca28" },
              }}
            >
              Forgot password?
            </Link>
          </Grid2>
          <Grid2>
            <Link
              component={RouterLink}
              to="/cautare"
              sx={{
                color: "#212121",
                textDecoration: "none",
                "&:hover": { color: "#ffca28" },
              }}
            >
              <div style={{ display: "flex" }}>
                Cauta un profil
                <SearchIcon fontSize="small" />
              </div>
            </Link>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default LoginPage;
