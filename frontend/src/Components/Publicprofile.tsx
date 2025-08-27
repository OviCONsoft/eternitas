import React, { FormEventHandler, MouseEventHandler, useState } from "react";
import { getprofiledata } from "../api";
import { SlotProps } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  Link,
  Modal,
  createTheme,
  ThemeProvider,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { error } from "console";
import CircularProgress from "@mui/material/CircularProgress";

type PixelString = `${number}px`;

type nameplate = {
  full_name: string;
  id: number;
  privacy: boolean;
  pic: string;
};

const imglink = "https://eternitas-media.s3.eu-central-1.amazonaws.com/";

const dividerstyle = {
  py: 0,
  width: "100%",
  borderRadius: 2,
  borderColor: "divider",
  backgroundColor: "background.paper",
};

function handleChange(id: number) {
  alert(`${id}`);
}

const style = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  p: 4,
  borderRadius: 2,
  maxWidth: "450px",
  width: "60vw",
};

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

const Publicprofile: React.FC<nameplate> = ({
  full_name,
  privacy,
  id,
  pic,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [errorimgload, seterrImageloaded] = useState(false);
  const [picerror, setPicerror] = useState(false);

  console.log(isImageLoaded, pic, picerror);

  const handleImageLoad = () => {
    seterrImageloaded(false);
    setIsImageLoaded(true); // Mark image as loaded
  };

  async function privacyhandler(privacy: boolean) {
    if (privacy == false) {
      navigate(`/profile/${id}`);
    } else {
      const response = await axios
        .post(
          `${process.env.REACT_APP_SERVER_ENV}/api/verifycookie`,
          { uid: id },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.message === "Token is valid") {
            navigate(`/profile/${id}`);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setOpen(true);
            }
          }
        });
    }
  }

  async function handlePcookie(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await axios
      .post(
        `${process.env.REACT_APP_SERVER_ENV}/api/setpcookie`,
        { password: password, uid: id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message === "Private page access granted") {
          navigate(`/profile/${id}`);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            handleClose();
            Swal.fire({ title: "Incorrect password", text: "", icon: "error" });
          }
        }
      });
  }

  return (
    <>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
          fontFamily: "monospace",
        }}
        onClick={() => privacyhandler(privacy)}
      >
        <Avatar
          sx={{
            width: "6%",
            height: "6%",
            minHeight: 50,
            minWidth: 50,
            aspectRatio: 1 / 1,
            bgcolor: "white",
            cursor: "pointer",
            position: "relative",
            marginTop: "1%",
            marginBottom: "1%",
            marginLeft: "5%",
            marginRight: "5%",
            "&:hover": { opacity: 0.8 },
          }}
        >
          {!isImageLoaded && <CircularProgress style={{ color: "#ffca28" }} />}

          <img
            src={imglink + pic}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              display: isImageLoaded && !errorimgload ? "block" : "none",
            }}
            onLoad={handleImageLoad}
            onError={() => seterrImageloaded(true)}
          />

          {errorimgload && (
            <img
              src={`${process.env.PUBLIC_URL}/defaultprofile.jfif`}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
              }}
            />
          )}
        </Avatar>

        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "18px", md: "20px", lg: "22px" },
          }}
        >
          {full_name}
        </Typography>

        {privacy ? (
          <LockOutlinedIcon
            sx={{
              marginLeft: "auto",
              paddingRight: "5%",
              fontSize: { xs: "20px", sm: "24px", md: "28px", lg: "32px" },
            }}
          />
        ) : (
          <PeopleOutlineIcon
            sx={{
              marginLeft: "auto",
              paddingRight: "5%",
              fontSize: { xs: "22px", sm: "26px", md: "30px", lg: "34px" },
            }}
          />
        )}
      </Typography>
      <List style={dividerstyle}>
        <Divider component="li" />
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "1.8em",
              margin: "3%",
              textAlign: "center",
            }}
          >
            Accesează profilul
          </Typography>
          <Typography>
            <Avatar
              sx={{
                width: {
                  xs: "140px", // 40px on extra small screens (mobile)
                  sm: "160px", // 60px on small screens (tablet)
                  md: "180px", // 80px on medium screens (laptops)
                  lg: "200px", // 100px on large screens (desktops)
                },
                height: {
                  xs: "140px", // 40px on extra small screens
                  sm: "160px", // 60px on small screens
                  md: "180px", // 80px on medium screens
                  lg: "200px", // 100px on large screens
                },
                bgcolor: "secondary",
                cursor: "pointer",
                position: "relative",
                marginTop: 0.5,
                marginBottom: 0.5,
                "&:hover": { opacity: 0.8 },
              }}
            >
              <img
                src={imglink + pic}
                alt="Profile"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  display: isImageLoaded && !errorimgload ? "block" : "none",
                }}
              />
              {errorimgload && (
                <img
                  src={`${process.env.PUBLIC_URL}/defaultprofile.jfif`}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                />
              )}
            </Avatar>
          </Typography>
          <form style={{ width: "100%" }} onSubmit={handlePcookie}>
            <ThemeProvider theme={fieldtheme}>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontFamily: "monospace",
                  fontSize: "1.8em",
                  margin: "2%",
                }}
              >
                {full_name}
              </Typography>
              <TextField
                placeholder="Enter password"
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                slotProps={{ htmlInput: { minLength: 4 } }}
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
                <Typography sx={{ fontWeight: 700 }}>Accesează</Typography>
              </Button>
            </ThemeProvider>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Publicprofile;
