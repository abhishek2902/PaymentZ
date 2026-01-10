import { Box, Typography, Button, Stack } from "@mui/material";
import { Icon } from "@iconify/react";

export default function AdminConfirmationStep({ onConfirm }) {
  return (
    <Box textAlign="center" py={8}>
      <Icon icon="mdi:account-check-outline" width={80} color="#1976d2" />
      <Typography variant="h5" mt={2}>
        Admin Review Required
      </Typography>
      <Typography color="text.secondary" mt={1} mb={3}>
        The Admin must confirm their details before any changes can be made.
      </Typography>
      <Stack alignItems="center">
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:check-decagram-outline" />}
          onClick={onConfirm}
        >
          Confirm and Proceed
        </Button>
      </Stack>
    </Box>
  );
}