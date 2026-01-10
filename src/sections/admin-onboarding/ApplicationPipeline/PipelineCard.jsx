import { Card, CardContent, Typography, Box } from "@mui/material";

export default function PipelineCard({ value, label, color, bg }) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, bgcolor: bg }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} sx={{ color }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          {label}
        </Typography>

        {/* Progress bar line */}
        <Box
          sx={{
            mt: 2,
            height: 4,
            borderRadius: 2,
            bgcolor: color,
            width: "80%",
            mx: "auto",
          }}
        />
      </CardContent>
    </Card>
  );
}
