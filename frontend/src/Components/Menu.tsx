import { slide as Menu } from "react-burger-menu";
import { Button, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import hamburger from "./hamburger.svg";
import Menuwithicon from "./MenuIcon";
import Toggleopt from "./Toggle";
import { useState } from "react";
import Swal from "sweetalert2";

interface menuprops {
  state: boolean;
}

async function handlelogout() {
  try {
    axios
      .post(
        `${process.env.REACT_APP_SERVER_ENV}/api/logout`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        window.location.reload();
      });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
        throw new Error(error.message);
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
}

interface Menuprops {
  uid?: number;
  checked?: boolean;
}

const Mymenu: React.FC<Menuprops> = ({ uid, checked }) => {
  const pathname: string = window.location.pathname;

  // Split the pathname by '/' and get the last segment
  const lastSegment: string = pathname.split("/").filter(Boolean).pop() || "";

  // Capitalize the first letter
  const profile: string =
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [password, setPassword] = useState<string>("");

  const styles = {
    bmBurgerButton: {
      position: "absolute",
      width: "54px",
      height: "45px",
      left: "27px",
      top: "27px",
    },
    bmBurgerBars: {
      background: "#373a47",
    },
    bmBurgerBarsHover: {
      background: "#a90000",
    },
    bmCrossButton: {
      width: "24px",
      height: "24px",
    },
    bmCross: {
      background: "white", //'#bdc3c7'
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
      textAlign: "center",
    },
    bmMenu: {
      background: "black", //'#373a47',
      padding: "2.5em 0em 0",
      fontSize: "1.2em",
      overflow: "hidden",
    },
    bmMorphShape: {
      fill: " #FFDF00", //'#373a47'
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em",
      fontWeight: "650",
    },
    bmItem: {
      display: "inline-block",
      color: "white",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  return (
    <Menu styles={styles} customBurgerIcon={<img src={hamburger} />}>
      {/* <Menuwithicon text="Acasă" url="/" />
      <br /> */}
      <Menuwithicon text="Magazin" url="https://eternitas-shop.ro/" />

      {profile == "Profile" && (
        <>
          <br />
          <Menuwithicon text="Editează Profilul" url="/Profilepagesetup" />
        </>
      )}

      <br />
      {/* {uid ? <Menuwithicon text="Vizualizare" url={"/profile/" + uid} /> : ""} */}
      {lastSegment.toLowerCase() !== "profilepagesetup" ? (
        <Menuwithicon text="Cautare Profil" url="/cautare" />
      ) : (
        ""
      )}

      {checked !== undefined && <Toggleopt tstate={checked} />}
      <div>
        <Button
          variant="outlined"
          component="label"
          sx={{
            borderColor: "white",
            color: "white",
            fontFamily: "monospace",
            "&:hover": { borderColor: "#ffca28" },
            borderRadius: 1,
          }}
        >
          <a id="logout" className="menu-item" onClick={handlelogout}>
            Log out
          </a>
        </Button>
      </div>
    </Menu>
  );
};

export default Mymenu;
