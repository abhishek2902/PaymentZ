// src/sections/connector/ConnectorAssignments.jsx

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { Iconify } from 'src/components/iconify';
import { AvatarGroup } from '@mui/material';

export function ConnectorAssignments({ allConnectors = [] }) {
  // -----------------------------------
  // 1. Create colors based on status
  // -----------------------------------
  const connectorColorsByStatus = {
    ACTIVE: 'success',
    ARCHIVED: 'warning',
  };

  // Map connector name -> status color (for chips on left)
  const connectorStatusColorMap = allConnectors.reduce((acc, c) => {
    acc[c.name] = connectorColorsByStatus[c.commonStatus] || 'default';
    return acc;
  }, {});

  // -----------------------------------
  // 2. Create "connectors" list (Connector -> Admins)
  // -----------------------------------
  const connectors = allConnectors.map((connector) => ({
    name: connector.name,
    description: connector.description,
    admins: connector.adminNames || [],
    status: connector.commonStatus,
  }));

  // -----------------------------------
  // 3. Create "admins" list (Admin -> Connectors)
  // -----------------------------------
  const adminMap = {};

  allConnectors.forEach((connector) => {
    (connector.adminNames || []).forEach((admin) => {
      if (!adminMap[admin]) {
        adminMap[admin] = {
          name: admin,
          avatar: '',
          company: 'Quiklie',
          connectors: [],
        };
      }
      adminMap[admin].connectors.push(connector.name);
    });
  });

  const admins = Object.values(adminMap);

  // -----------------------------------
  // 4. Colorful avatar helper (based on name)
  // -----------------------------------
  const colorPalette = [
    'primary.main',
    'secondary.main',
    'success.main',
    'info.main',
    'warning.main',
    'warning.main',
  ];

  const getColorForName = (name = '') => {
    if (!name) return colorPalette[0];

    let hash = 0;

    for (let i = 0; i < name.length; i += 1) {
      hash = (hash + name.charCodeAt(i) * (i + 1)) % 100000;
    }

    const index = hash % colorPalette.length;
    return colorPalette[index];
  };

  // -----------------------------------
  // 5. "Show more" logic (3 cards each column)
  // -----------------------------------
  const [showAllAdmins, setShowAllAdmins] = useState(false);
  const [showAllConnectors, setShowAllConnectors] = useState(false);
  const [showAllConnectorsLabel, setShowAllConnectorsLabel] = useState(true);

  const visibleAdmins = showAllAdmins ? admins : admins.slice(0, 3);
  const visibleConnectors = showAllConnectors ? connectors : connectors.slice(0, 3);

  const hasMoreAdmins = admins.length > 3;
  const hasMoreConnectors = connectors.length > 3;

  // -----------------------------------
  // RENDER UI
  // -----------------------------------
  return (
    <Card sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="mdi:account-group-outline" width={24} height={24} />
          <Typography variant="h6">Admin-Connector Assignments</Typography>
        </Stack>
      </Stack>

      {/* Content */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Connectors by Admin */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Connectors by Admin
          </Typography>

          <Stack spacing={2}>
            {visibleAdmins.map((admin, idx) => {
              const visibleConnectorsForAdmin = showAllConnectorsLabel ? admin.connectors : admin.connectors.slice(0, 4);
              const remaining = admin.connectors.length - visibleConnectorsForAdmin.length;

              return (
                <Card key={idx} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Avatar
                      src={admin.avatar}
                      sx={
                        !admin.avatar
                          ? {
                              bgcolor: getColorForName(admin.name),
                              color: 'common.white',
                              width: 32,
                              height: 32,
                              fontSize: 14,
                              fontWeight: 600,
                            }
                          : {}
                      }
                    >
                      {!admin.avatar && admin.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{admin.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {admin.company}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {visibleConnectorsForAdmin.map((connectorName, i) => (
                      <Chip
                        key={i}
                        label={connectorName}
                        size="small"
                        color={connectorStatusColorMap[connectorName] || 'default'}
                      />
                    ))}

                    {remaining > 0 && (
                      <Chip label={`+${remaining} more`} size="small" variant="outlined" onClick={() => setShowAllConnectorsLabel((prev) => !prev)}/>
                    )}
                  </Stack>

                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {admin.connectors.length}{' '}
                    {admin.connectors.length === 1 ? 'connector' : 'connectors'}
                  </Typography>
                </Card>
              );
            })}
          </Stack>

          {hasMoreAdmins && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                size="small"
                variant="text"
                onClick={() => setShowAllAdmins((prev) => !prev)}
              >
                {showAllAdmins ? 'Show less' : 'Show more'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: 'none', md: 'block' } }}
        />

        {/* Admins by Connector */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Admins by Connector
          </Typography>

          <Stack spacing={2}>
            {visibleConnectors.map((connector, idx) => (
              <Card
                key={idx}
                sx={{
                  p: 2,
                  bgcolor:
                    connector.status === 'ARCHIVED'
                      ? 'warning.lighter'
                      : 'background.paper',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: 'primary.lighter' }}>
                    <Iconify icon="mdi:bank" width={24} height={24} color="success.main" />
                  </Avatar>

                  <Box>
                    <Typography variant="subtitle2">{connector.name}</Typography>
                    <Typography
                      variant="caption"
                      color={
                        connector.status === 'ARCHIVED' ? 'warning.main' : 'text.secondary'
                      }
                    >
                      {connector.description}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <AvatarGroup
                    max={4}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 24,
                        height: 24,
                        border: '2px solid white',
                        fontSize: 12,
                      },
                    }}
                  >
                    {connector.admins.slice(0, 4).map((adminName, i) => (
                      <Avatar
                        key={i}
                        sx={{
                          bgcolor: getColorForName(adminName),
                          color: 'common.white',
                        }}
                      >
                        {adminName?.[0]?.toUpperCase()}
                      </Avatar>
                    ))}
                  </AvatarGroup>

                  {connector.admins.length > 4 && (
                    <Typography variant="caption" color="text.secondary">
                      +{connector.admins.length - 4} more admins
                    </Typography>
                  )}
                </Stack>

                <Typography
                  variant="caption"
                  color={
                    connector.status === 'ARCHIVED' ? 'warning.main' : 'success.main'
                  }
                  sx={{ mt: 1, display: 'block' }}
                >
                  {connector.admins.length}{' '}
                  {connector.admins.length === 1 ? 'admin' : 'admins'}
                </Typography>
              </Card>
            ))}
          </Stack>

          {hasMoreConnectors && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                size="small"
                variant="text"
                onClick={() => setShowAllConnectors((prev) => !prev)}
              >
                {showAllConnectors ? 'Show less' : 'Show more'}
              </Button>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
