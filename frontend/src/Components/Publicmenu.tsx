import { slide as Menu } from "react-burger-menu";
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import hamburger from "./hamburger.svg";
import Menuwithicon from "./MenuIcon";

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
}

const Publicmenu: React.FC<Menuprops> = ({ uid }) => {
  const pathname: string = window.location.pathname;

  // Split the pathname by '/' and get the last segment
  const lastSegment: string = pathname.split("/").filter(Boolean).pop() || "";

  // Capitalize the first letter
  const profile: string =
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  console.log(lastSegment);

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
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: "white", //'#bdc3c7
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
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
      <Menuwithicon text="Magazin" url="https://eternitas-shop.ro/" />
      <br />
      <Menuwithicon text="Conectează-te" url="/login" />
      <br />
      {lastSegment.toLowerCase() !== "cautare" ? (
        <Menuwithicon text="Cautare Profil" url="/cautare" />
      ) : (
        ""
      )}
    </Menu>
  );
};

export default Publicmenu;
