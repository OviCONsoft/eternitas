import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  MenuItem,
} from "@mui/material";
import Logo from "./logo.png";
import { profilesubmit, getprofiledata, profiledata } from "./api";
import Swal from "sweetalert2";
import Mymenu from "./Components/Menu";

const fieldtheme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#EEEEEE",
          border: "0px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
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
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: 5,
        },
      },
    },
  },
});

interface PersonData {
  id: number;
  First_name: string; // First name of the person
  Middle_name: string; // Middle name (optional)
  Last_name: string; // Last name of the person
  Date_of_birth: string; // Date of birth in string format (or use Date if it's a Date object)
  Date_of_death: string; // Date of death (optional)
  Relationship: string; // Relationship (e.g., friend, family, etc.)
  Description: string; // Additional description (optional)
}

const ProfilePageSetup = () => {
  const [profileType, setProfileType] = useState<string | null>("Person");
  const [id, setid] = useState<number | undefined>(undefined);
  const [profilesetup, setProfilesetup] = useState(false);
  const [displayform, setForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [deathDate, setDeathDate] = useState(""); // Add death date state
  const [relationship, setRelationship] = useState("");
  const [description, setDescription] = useState("");
  const [isFormChanged, setIsFormChanged] = useState(false);

  const navigate = useNavigate();

  const handleProfileType = (type: string) => {
    setProfileType(type);
  };

  useEffect(() => {
    getprofiledata()
      .then((res) => {
        const pdata: PersonData = res?.data ? res.data[0] : undefined;
        if (pdata !== undefined) {
          setid(pdata.id);
          setFirstName(pdata.First_name);
          setMiddleName(pdata.Middle_name);
          setLastName(pdata.Last_name);
          setDob(pdata.Date_of_birth);
          setDeathDate(pdata.Date_of_death);
          setRelationship(pdata.Relationship);
          setDescription(pdata.Description);
          setProfilesetup(true);
        }
      })
      .then(() => {
        setIsFormChanged(false);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profileData = {
      profileType,
      firstName,
      middleName,
      lastName,
      dob, // Date of Birth
      deathDate, // Date of Death
      relationship,
      description,
    };
    // Navigate to ProfilePage and pass profileData as state
    try {
      if (isFormChanged) {
        await profilesubmit(profileData).then(() => {
          navigate("/profile");
        });
      } else {
        navigate("/profile");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error}`,
      });
    }
  };

  return (
    <div>
      <Mymenu uid={id} />
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4, pt: 3 }}>
          <img src={Logo} alt="Logo" style={{ width: "150px" }} />
        </Box>

        <Typography
          variant="h4"
          sx={{ textAlign: "center", mb: 1, fontWeight: 700 }}
        >
          Setup
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", mb: 4, fontWeight: 700 }}
        >
          începe prin a seta primele date despre persoană
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color={profileType === "Human" ? "primary" : "inherit"}
            onClick={() => {
              setForm(!displayform);
              if (displayform) {
                navigate("/profile");
              }
            }}
            sx={{ borderRadius: 5 }}
          >
            {profilesetup ? (
              displayform === true ? (
                <p>Anulează modificările</p>
              ) : (
                <p>
                  Editează {firstName} {lastName}
                </p>
              )
            ) : (
              <p>Set up profile</p>
            )}
          </Button>
        </Box>

        {displayform && (
          <Box sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
              <ThemeProvider theme={fieldtheme}>
                <Typography>Nume</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography>AI doilea prenume</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={middleName}
                  onChange={(e) => {
                    setMiddleName(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography>Prenume</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography>Data nașterii</Typography>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography>Data decesului</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={deathDate}
                  onChange={(e) => {
                    setDeathDate(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography>Relația cu persoana</Typography>
                <TextField
                  select
                  variant="outlined"
                  fullWidth
                  required
                  value={relationship}
                  onChange={(e) => {
                    setRelationship(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Brother">Brother</MenuItem>
                  <MenuItem value="Sister">Sister</MenuItem>
                  <MenuItem value="Friend">Friend</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <Typography>Descriere</Typography>
                <TextField
                  variant="outlined"
                  multiline
                  required
                  rows={4}
                  fullWidth
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsFormChanged(true);
                  }}
                  sx={{ mb: 2 }}
                />
              </ThemeProvider>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mb: 2,
                  bgcolor: "black",
                  borderRadius: 3,
                  padding: 2,
                  mt: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}> Salvează</Typography>
              </Button>
            </form>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default ProfilePageSetup;
