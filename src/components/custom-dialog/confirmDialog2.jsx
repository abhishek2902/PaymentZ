import { createRoot } from 'react-dom/client';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function confirmDialog2({
  title = 'Confirm Action',
  description = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning', // warning | danger | success
}) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleClose = (result) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    const config = {
      warning: {
        icon: 'mdi:alert-circle-outline',
        color: 'warning.main',
        button: 'warning',
      },
      danger: {
        icon: 'mdi:alert-circle-outline',
        color: 'error.main',
        button: 'error',
      },
      success: {
        icon: 'mdi:check-circle-outline',
        color: 'success.main',
        button: 'success',
      },
    }[variant];

    root.render(
      <Dialog
        open
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: `${config.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon={config.icon}
                width={32}
                height={32}
                color={config.color}
              />
            </Box>

            <Typography variant="h6">{title}</Typography>

            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => handleClose(false)}
          >
            {cancelText}
          </Button>

          <Button
            fullWidth
            variant="contained"
            color={config.button}
            onClick={() => handleClose(true)}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  });
}
