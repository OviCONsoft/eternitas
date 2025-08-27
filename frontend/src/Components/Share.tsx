import React from "react";
import { RWebShare } from "react-web-share";
import { Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

// Define the types for the props
interface ShareProps {
  url: string;
}

const Share: React.FC<ShareProps> = ({ url }) => {
  return (
    <>
      <RWebShare
        data={{
          url: url, // Use the passed url prop
          title: "Share Profile",
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <Button style={{ marginLeft: 20 }}>
          Share <ShareIcon style={{ color: "black" }} fontSize="small" />
        </Button>
      </RWebShare>
    </>
  );
};

export default Share;
