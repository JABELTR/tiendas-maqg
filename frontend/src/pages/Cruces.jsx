import React, { useState } from "react";
import CruceAddi from "./CruceAddi";
import CruceSiste from "./CruceSiste";
import CruceRedeban from "./CruceRedeban";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab
} from "@mui/material";

const Cruces = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box mt={2} component={Paper} p={3}>
      <Typography variant="h6" gutterBottom>
        Cruces de Información
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Addi" />
        <Tab label="Sistecrédito" />
        <Tab label="Redeban" />
      </Tabs>

      <Box mt={3}>
        {tabIndex === 0 && <CruceAddi />}
        {tabIndex === 1 && <CruceSiste />}
        {tabIndex === 2 && <CruceRedeban />}
      </Box>
    </Box>
  );
};

export default Cruces;
