import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import square from "./Components/emptysquare.png";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Grid,
  Tabs,
  Tab,
  createTheme,
  ThemeProvider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  getprofiledata,
  profileupload,
  mediaupload,
  getmedia,
  deletemedia,
} from "./api";
import { amber, brown, grey } from "@mui/material/colors";
import Swal from "sweetalert2";
import Mymenu from "./Components/Menu";
import Modal from "@mui/material/Modal";
import Logo from "./logo.png";
import Namecomp from "./Components/Namecomp";
import SetPasswordForm from "./Components/SetPassword";

type SetPassword = {
  password: string;
};

let passwordInput: HTMLInputElement;

const theme = createTheme({
  palette: {
    primary: {
      main: amber[400],
    },
    secondary: {
      main: brown[800],
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface PersonData {
  id: number;
  First_name: string; // First name of the person
  Middle_name: string; // Middle name (optional)
  Last_name: string; // Last name of the person
  Date_of_birth: string; // Date of birth in string format (or use Date if it's a Date object)
  Date_of_death: string; // Date of death (optional)
  Relationship: string; // Relationship (e.g., friend, family, etc.)
  Description: string; // Additional description (optional)
  Profile_pic: string;
  Privacy: boolean;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ textAlign: "justify" }}
    >
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [profileData, setprofiledata] = useState<PersonData | undefined>(
    undefined
  );
  const [value, setValue] = React.useState(0);
  const [medialinks, setMedialinks] = useState(Array<string>);
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".tif",
    ".webp",
    ".heif",
    ".raw",
    ".jfif",
    ".avif",
  ];
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mkv",
    ".mov",
    ".wmv",
    ".flv",
    ".webm",
    ".mpg",
    ".mpeg",
  ];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalpic, setmodalpic] = useState("");
  const [pfpic, setPfpic] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [remsq, setRemsq] = useState(3);
  const [mediarender, setmediarenderState] = useState(true);
  const [prender, setprenderState] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true); // Mark image as loaded
  };

  const style = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflowX: "auto",
    overflowY: "scroll",
    p: "0.8%",
    borderRadius: 2,
  };

  const imglink = "https://eternitas-media.s3.eu-central-1.amazonaws.com/";

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchprofile() {
      try {
        await getprofiledata().then((res) => {
          const pdata: PersonData = res?.data ? res.data[0] : undefined;
          if (pdata !== undefined) {
            setprofiledata(pdata);
            setPfpic(imglink + pdata.Profile_pic);
          } else {
            navigate("/profilepagesetup");
          }
        });
      } catch (error: unknown) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Profile couldn't be fetched",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchprofile();
  }, [prender]);

  useEffect(() => {
    async function getmlinks() {
      try {
        const data: Array<string> = await getmedia();
        setMedialinks(data);
        setRemsq(3 - (data.length % 3));
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Media couldn't be fetched",
        });
      }
    }
    getmlinks();
  }, [mediarender]);

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event?.target?.files && profileData) {
      const file = event.target.files[0];
      try {
        profileupload(file);
        console.log(file.name);

        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Imaginea de profil a fost actualizată.",
        }).then((result) => {
          if (result.isConfirmed) {
            setPfpic(URL.createObjectURL(file));
          }
        });
      } catch (error: unknown) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Actualizarea imaginii de profil a eșuat.",
        });
      }
    }
  };

  const handleMediaChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event?.target?.files && mediaFiles) {
      const filesArray = Array.from(event.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);

      const mediaset: Set<string | undefined> = new Set(
        medialinks.map((item) => item.split("/").pop())
      );

      const uniquefilesArray = filesArray.filter((ele) => {
        if (mediaset.has(ele.name)) {
          return false;
        }
        return true;
      });

      if (uniquefilesArray.length == 0) {
        const flist = filesArray
          .map((item) => `<pre>${item.name}</pre>`)
          .join("");

        Swal.fire({
          icon: "error",
          title: "Duplicates",
          html: `Media files with these names already exist:${flist}`,
        });
      } else if (uniquefilesArray.length < filesArray.length) {
        const ufnames = uniquefilesArray
          .map((ele) => `<pre>${ele.name}</pre>`)
          .join("");

        const dupnames = filesArray
          .map((ele) => {
            if (!ufnames.includes(ele.name)) {
              return `<pre>${ele.name}</pre>`;
            }
          })
          .join("");

        try {
          await mediaupload(filesArray);
          Swal.fire({
            icon: "info",
            title: "Selecție încărcată",
            html: `Au fost încărcate doar fișiere cu nume unice <h2>Încărcate</h2>${ufnames} <h2>Duplicat</h2> ${dupnames}`,
          }).then(() => {
            setmediarenderState(!mediarender);
          });
        } catch (error: unknown) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Media files update failed (will disappear on reload)",
          });
        }
      } else {
        try {
          await mediaupload(filesArray);
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `Încărcarea fișierelor media a fost realizată cu succes`,
          }).then(() => {
            setmediarenderState(!mediarender);
          });
        } catch (error: unknown) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Media files update failed (will disappear on reload)",
          });
        }
      }
    }

    event.target.value = "";
  };
  const handleEditMedia = (index: number) => {
    console.log("Edit media at index:", index);
  };

  const calculateAge = (Date_of_birth: string, Date_of_death?: string) => {
    const birthDate = new Date(Date_of_birth);
    const deathDateObj = Date_of_death ? new Date(Date_of_death) : new Date();
    let age = deathDateObj.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDateObj.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && deathDateObj.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;

    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen(); // Safari/Old Chrome
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen(); // IE/Edge
      }
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  } else {
    return (
      <>
        {profileData?.id && (
          <Mymenu uid={profileData.id} checked={profileData.Privacy} />
        )}

        <Container>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4, pt: 3 }}>
            <img src={Logo} alt="Logo" style={{ width: "150px" }} />
          </Box>

          <ThemeProvider theme={theme}>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                  id="profile-pic-upload"
                />
                <label htmlFor="profile-pic-upload">
                  <Avatar
                    sx={{
                      width: 170,
                      height: 170,
                      bgcolor: "white",
                      cursor: "pointer",
                      position: "relative",
                      marginTop: 1,
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    {!isImageLoaded && (
                      <CircularProgress style={{ color: "#ffca28" }} />
                    )}
                    <img
                      src={pfpic}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        display: isImageLoaded ? "flex" : "none",
                      }}
                      onLoad={() => {
                        setIsImageLoaded(true);
                      }}
                      onError={() =>
                        setPfpic(
                          `${process.env.PUBLIC_URL}/defaultprofile.jfif`
                        )
                      }
                    />
                  </Avatar>
                </label>
              </Box>

              {profileData ? (
                <Box sx={{ mt: 3 }}>
                  <Namecomp
                    first_name={profileData.First_name}
                    middle_name={profileData.Middle_name}
                    last_name={profileData.Last_name}
                    fweight={700}
                    fsize="20px"
                  />

                  {profileData.Date_of_death && profileData.Date_of_birth && (
                    <Typography
                      sx={{ fontFamily: "Times New Roman", fontWeight: 700 }}
                    >
                      <p></p>
                      {new Date(profileData.Date_of_birth).toLocaleDateString(
                        "ro-RO"
                      )}{" "}
                      -{" "}
                      {new Date(profileData.Date_of_death).toLocaleDateString(
                        "ro-RO"
                      )}
                    </Typography>
                  )}

                  {profileData.Date_of_death && (
                    <Typography
                      sx={{ fontFamily: "Times New Roman", fontWeight: 700 }}
                    >
                      Vârstă:{" "}
                      {calculateAge(
                        profileData.Date_of_birth,
                        profileData.Date_of_death
                      )}{" "}
                      ani
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography>No profile information provided.</Typography>
              )}
            </Box>

            <Box sx={{ p: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  variant="fullWidth"
                  textColor="primary"
                >
                  <Tab label="Despre" {...a11yProps(0)} />
                  <Tab label="Media" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {`${profileData?.Description ? profileData.Description : ""}`}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  {medialinks.map((file, index) => (
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {imageExtensions.some((ext) =>
                        file.toLowerCase().endsWith(ext)
                      ) ? (
                        <img
                          src={imglink + file}
                          onClick={() => {
                            setmodalpic(imglink + file);
                            handleOpen();
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            aspectRatio: 1 / 1,
                            objectFit: "cover",
                          }}
                          title={file.split("/").pop()}
                        />
                      ) : videoExtensions.some((ext) =>
                          file.toLowerCase().endsWith(ext)
                        ) ? (
                        <>
                          <div
                            title={file.split("/").pop()}
                            style={{
                              width: "100%",
                              height: "100%",
                              aspectRatio: 1 / 1,
                              objectFit: "cover",
                              backgroundColor: "#D3D3D3",
                              opacity: "65%",
                            }}
                            onClick={(e) => {
                              setmodalpic(imglink + file);
                              handleOpen();
                            }}
                            onPlay={(e) => {
                              setmodalpic(imglink + file);
                              handleOpen();
                            }}
                          ></div>
                          <PlayCircleFilledWhiteIcon
                            sx={{
                              position: "absolute",
                              width: "30%",
                              height: "30%",
                              color: "white",
                            }}
                            onClick={() => {
                              setmodalpic(imglink + file);
                              handleOpen();
                            }}
                          />
                        </>
                      ) : (
                        <Typography variant="body2" sx={{ marginRight: 2 }}>
                          {file}
                        </Typography>
                      )}
                    </Box>
                  ))}

                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button component="label" sx={{ p: 0 }}>
                      <img
                        src={square}
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1 / 1,
                          objectFit: "cover",
                        }}
                      />
                      <AddIcon
                        sx={{
                          position: "absolute",
                          width: "20%",
                          height: "20%",
                          color: "black",
                        }}
                      />
                      <input
                        type="file"
                        onChange={handleMediaChange}
                        hidden
                        multiple
                        accept="image/*,video/*"
                      />
                    </Button>
                  </Box>
                </Box>
              </CustomTabPanel>
            </Box>
          </ThemeProvider>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="modalContent">
              {imageExtensions.some((ext) =>
                modalpic.toLowerCase().endsWith(ext)
              ) ? (
                <img
                  src={modalpic}
                  style={{
                    objectFit: "contain",
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                  }}
                />
              ) : videoExtensions.some((ext) =>
                  modalpic.toLowerCase().endsWith(ext)
                ) ? (
                <video
                  autoPlay
                  muted
                  title={modalpic.split("/").pop()}
                  controls
                  style={{
                    maxWidth: "85vw",
                    maxHeight: "85vh",
                    objectFit: "cover",
                  }}
                >
                  <source
                    src={modalpic}
                    type={"video/" + modalpic.split(".").pop()}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                ""
              )}

              {/* <img
                src={modalpic}
                style={{
                  objectFit: "contain",
                  maxHeight: "80vh",
                  maxWidth: "80vw",
                }}
              /> */}
              <Button
                variant="contained"
                onClick={() => {
                  const fname = modalpic.split("/").pop();
                  if (fname !== undefined) {
                    deletemedia(fname)
                      .then(() => {
                        setmediarenderState(!mediarender);
                      })
                      .then(() => {
                        setOpen(false);
                      });
                  }
                }}
                sx={{
                  mb: 1,
                  bgcolor: "black",
                  borderRadius: 3,
                  padding: 1.5,
                  mt: 1,
                  "&:hover": {
                    color: "#ffca28",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  șterge amintirea{" "}
                </Typography>
              </Button>
            </Box>
          </Modal>
        </Container>
      </>
    );
  }
};
export default ProfilePage;
