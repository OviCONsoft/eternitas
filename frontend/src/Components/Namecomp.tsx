import React from "react";
import { Box, Typography } from "@mui/material";

type PixelString = `${number}px`;

type nameplate = {
  first_name: string;
  middle_name: string;
  last_name: string;
  fweight: number;
  fsize: PixelString;
};

const Namecomp: React.FC<nameplate> = ({
  first_name,
  middle_name,
  last_name,
  fweight,
  fsize,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: -2.5 }}>
      {first_name && (
        <Typography sx={{ mr: 1, fontWeight: fweight, fontSize: fsize }}>
          {first_name}
        </Typography>
      )}
      {middle_name && (
        <Typography sx={{ mr: 1, fontWeight: fweight, fontSize: fsize }}>
          {middle_name}
        </Typography>
      )}
      {last_name && (
        <Typography sx={{ mr: 1, fontWeight: fweight, fontSize: fsize }}>
          {last_name}
        </Typography>
      )}
    </Box>
  );
};

export default Namecomp;
