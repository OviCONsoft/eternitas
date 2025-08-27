import React, { FormEvent, useState } from "react";
import { changevisibility } from "../api";
import Swal from "sweetalert2";
import {
  Modal,
  TextField,
  IconButton,
  Button,
  Typography,
  Box,
  SlotProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type togglestate = {
  tstate: boolean;
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
  p: 4,
  borderRadius: 5,
  maxWidth: "450px",
  minWidth: "300px",
  gap: 4,
};

const Toggleopt: React.FC<togglestate> = ({ tstate }) => {
  const [togglestate, setTogglestate] = useState<boolean>(tstate);
  const [password, setPassword] = useState("");
  const [opentoggle, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClosetoggle = () => setOpen(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const togglechange: boolean = event.target.checked;
    if (togglechange) {
      setOpen(true);
    } else {
      changevisibility(false, "").then(() => {
        setTogglestate(false);
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changevisibility(true, password).then(() => {
      setTogglestate(true);
      handleClosetoggle();
    });
  };

  return (
    <>
      <br />
      <label className="switch">
        <input type="checkbox" checked={togglestate} onChange={handleChange} />
        <span className="slider round">
          {togglestate ? "Private" : "Public"}
        </span>
      </label>
      <br />
      <br />
      <Modal
        open={opentoggle}
        onClose={handleClosetoggle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{
              fontSize: "1.6em",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            Setează o parolă pentru vizibilitatea contului
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ gap: 20, display: "flex", flexDirection: "column" }}
          >
            <TextField
              placeholder="Introdu parola..."
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
            ></TextField>
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
              <Typography sx={{ fontWeight: 700 }}>Salvează Parola</Typography>
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Toggleopt;
