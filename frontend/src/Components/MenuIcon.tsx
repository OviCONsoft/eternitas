import { SvgIconComponent } from "@mui/icons-material";
import React from "react";

type icprops = {
  text: string;
  url: string;
};

const Menuwithicon: React.FC<icprops> = ({ text, url }) => {
  return (
    <a href={url} style={{ color: "white", textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          fontFamily: "monospace",
          justifyContent: "center",
        }}
      >
        {text}
      </div>
    </a>
  );
};

export default Menuwithicon;
