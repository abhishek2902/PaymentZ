import { Box, Typography, useTheme } from "@mui/material";

export default function PipelineStep({ number, label, subtitle, color, isLast }) {
  const theme = useTheme();

  return (
    <Box
      textAlign="center"
      flex={1}
      position="relative"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 2
      }}
    >
      {/* Circle Number */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          mb: 1,
          zIndex: 1,
          position: "relative",
        }}
      >
        {number}
      </Box>

      {/* Colored line */}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 18, // vertically centered on circle
            left: "0%",
            width: "100%",
            height: 4,
            bgcolor: color,
            zIndex: 0,
            transform: "translateX(50%)",
            display: { xs: "none", md: "block" }, // hide on small screens
          }}
        />
      )}

      {/* Title */}
      <Typography fontWeight={600} fontSize={14}>
        {label}
      </Typography>

      {/* Subtitle */}
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}
