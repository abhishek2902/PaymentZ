// src/sections/Admin/AdminFieldGroup.jsx
import { Box, Typography, TextField } from "@mui/material";

export default function AdminFieldGroup({
  title,
  fields,
  register,
  values = {},
  note,
}) {
  const readonlyFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f5f5f5",
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset, &.Mui-focused fieldset": { borderColor: "#ddd" },
    },
    "& .MuiInputLabel-root": { color: "text.secondary" },
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
        {note && (
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic", ml: 1 }}
          >
            ({note})
          </Typography>
        )}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            {...register(field.name)}
            defaultValue={values[field.name] || ""}
            multiline={field.multiline}
            minRows={field.multiline ? 2 : 1}
          />
        ))}
      </Box>
    </Box>
  );
}