// src/sections/connector/ConnectorQuickActions.jsx

import { Box, Stack, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Link as RouterLink } from 'react-router-dom';

export default function ConnectorQuickActions({ actions }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 3 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
        color: 'common.white',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ mb: { xs: 3, md: 5 } }}>
        Manage your payment connectors efficiently with these common actions
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, md: 4 }}
        justifyContent="center"
        alignItems="center"
      >
        {actions.map((action, idx) => (
          <Box
            key={idx}
            component={RouterLink}
            to={action.path}
            sx={{
              flex: 1,
              minWidth: 150,
              maxWidth: 250,
              p: 3,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              transition: 'background-color 0.3s',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
              textDecoration: 'none',
              color: 'white'
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Iconify icon={action.icon} width={28} height={28} />
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              {action.title}
            </Typography>
            <Typography variant="caption">{action.description}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
