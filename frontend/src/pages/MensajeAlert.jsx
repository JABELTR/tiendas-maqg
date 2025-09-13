// src/components/MensajeAlert.jsx
import React from "react";
import { Snackbar, Alert } from "@mui/material";

const MensajeAlert = ({ open, message, severity = "info", onClose, duration = 5000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MensajeAlert;
