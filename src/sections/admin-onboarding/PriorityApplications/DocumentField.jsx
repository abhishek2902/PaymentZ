import React, { useState } from "react";
import { Box, Typography, Stack, Button, CircularProgress } from "@mui/material";
import axios from "axios";

const baseURL= import.meta.env.VITE_API_BASE_URL;

export default function DocumentField({ label, filePath, fileName }) {
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    if (!filePath) return;
    setLoading(true);
    try {
      // Encode key properly for the backend API
      const encodedKey = encodeURIComponent(filePath);
      const response = await axios.get(`${baseURL}/files/view?key=${encodedKey}`);
      
      // API returns the signed URL directly in response body
      const signedUrl = response.data;

      if (signedUrl) {
        window.open(signedUrl, "_blank"); // open in new tab
      } else {
        console.error("No signed URL received from backend.");
      }
    } catch (err) {
      console.error("Failed to fetch signed URL:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!filePath) return;
    setLoading(true);
    try {
      const encodedKey = encodeURIComponent(filePath);
      const response = await axios.get(`${baseURL}/files/view?key=${encodedKey}`);
      const signedUrl = response.data;

      if (signedUrl) {
        const link = document.createElement("a");
        link.href = signedUrl;
        link.download = fileName || label.replace(/\s+/g, "_");
        link.click();
      }
    } catch (err) {
      console.error("Failed to download file:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        border: "1px solid #ddd",
        borderRadius: 1,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          onClick={handleView}
          disabled={!filePath || loading}
        >
          {loading ? <CircularProgress size={18} /> : "View"}
        </Button>
        {/* <Button
          variant="contained"
          size="small"
          onClick={handleDownload}
          disabled={!filePath || loading}
        >
          Download
        </Button> */}
      </Stack>
    </Box>
  );
}
