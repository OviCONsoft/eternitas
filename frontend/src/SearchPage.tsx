import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Container,
  Divider,
  List,
  TextField,
  InputAdornment,
} from "@mui/material";
import Publicmenu from "./Components/Publicmenu";
import Logo from "./logo.png";
import { publicprof } from "./api";
import Publicprofile from "./Components/Publicprofile";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { escape } from "querystring";

type pubproftype = {
  Fname: string;
  Id: number;
  Privacy: boolean;
  Pic: string;
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
  height: "auto",
  width: "60vw",
  maxWidth: "400px",
  p: 3,
  borderRadius: 2,
  overflowX: "auto",
  overflowY: "scroll",
};

const dividerstyle = {
  py: 0,
  width: "100%",
  borderRadius: 2,
  borderColor: "divider",
  backgroundColor: "background.paper",
};

const SearchPage: React.FC = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [items, setItems] = useState<pubproftype[]>([]);
  const [filtered, setFiltered] = useState<pubproftype[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    publicprof()
      .then((res) => {
        if (res !== undefined) {
          const transformed: pubproftype[] = res.map((uitem) => ({
            Fname:
              uitem.First_name +
              " " +
              uitem.Middle_name +
              " " +
              uitem.Last_name,
            Id: uitem.id,
            Privacy: uitem.Privacy,
            Pic: uitem.Profile_pic,
          }));
          setItems(transformed);
          setFiltered(transformed);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const hasOpened = sessionStorage.getItem("modalOpened");
    if (!hasOpened) {
      setOpen(true);
      sessionStorage.setItem("modalOpened", "true");
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    setFiltered(
      items.filter((item) => {
        return item.Fname.replace(/\s+/g, "")
          .toLowerCase()
          .includes(value.replace(/\s+/g, "").toLowerCase());
      })
    );
  }

  function handleClear() {
    setInputValue("");
    setFiltered(items);
  }

  if (loading) {
    return <div className="loader">Loading...</div>;
  } else {
    return (
      <>
        <Publicmenu />
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4, pt: 3 }}>
            <img src={Logo} alt="Logo" style={{ width: "150px" }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              pl: 3,
              pr: 3,
            }}
          >
            <Typography
              sx={{
                mb: "6%",
                width: "100%",
                display: "flex",
              }}
            >
              <TextField
                variant="outlined"
                onChange={handleChange}
                value={inputValue}
                placeholder="Caută numele persoanei dragi"
                sx={{
                  justifyContent: "center",
                  borderRadius: "10px",
                  bgcolor: "#DCDCDC",
                  width: "88%",
                  height: "40px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    borderColor: "transparent",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& input:-webkit-autofill": {
                    height: "0px",
                    WebkitBoxShadow: "0 0 0 30px #DCDCDC inset !important",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Typography
                component="span" // Keeps the inline behavior of <span>
                onClick={handleClear}
                sx={{
                  display: "flex",
                  width: "100%",
                  flex: 1,
                  ml: 2, // marginLeft shorthand in MUI
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1em",
                  fontFamily: "monospace",
                  fontWeight: "650",
                }}
              >
                Anulează
              </Typography>
            </Typography>
          </Box>
        </Container>

        <List style={dividerstyle}>
          <Divider component="li" />
        </List>

        {filtered.map((item) => (
          <Publicprofile
            full_name={item.Fname}
            privacy={item.Privacy}
            id={item.Id}
            pic={item.Pic}
          />
        ))}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="modalContent">
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              sx={{
                position: "relative",
                mb: 1.5,
                bgcolor: "black",
                borderRadius: 3,
                padding: 1,
                mt: 1.5,
                width: "66%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 650,
                  fontFamily: "monospace",
                  fontSize: "100%",
                }}
              >
                {" "}
                caută profil
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{
                position: "relative",
                mb: 1.5,
                bgcolor: "black",
                borderRadius: 3,
                padding: 1,
                mt: 1.5,
                width: "66%",
                height: "auto",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 650,
                  fontFamily: "monospace",
                  fontSize: "100%",
                }}
              >
                {" "}
                conectează-te
              </Typography>
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                (window.location.href =
                  "https://eternitas-shop.ro/products/eternitas-star")
              }
              sx={{
                position: "relative",
                bgcolor: "black",
                borderRadius: 4,
                padding: 1.5,
                mt: 1.5,
                mb: 1.5,
                width: "66%",
                height: "auto",
                backgroundColor: "#ffca28",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 650,
                  fontFamily: "monospace",
                  fontSize: "100%",
                }}
              >
                {" "}
                magazin
              </Typography>
            </Button>
          </Box>
        </Modal>
      </>
    );
  }
};

export default SearchPage;
