// src/sections/connector/ConnectorTable.jsx

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { AvatarGroup, Divider } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useNavigate } from 'react-router';
import { keyframes } from '@emotion/react'

export function ConnectorTable({
  providers,
  page,
  rowsPerPage,
  onPageChange,
  totalPages,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onEdit,
  onPowerToggle,
  onSettings,
  onMoreFilters,
  onExport,
  currentStatus,
  currentSearch,
  closingConnectorId
}) {

  const navigate=useNavigate();

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "archived":
        return "warning";
      default:
        return "default";
    }
  };

  const blink = keyframes`
    0% { opacity: 0.3; }
    25% { opacity: 0.6; }
    50% { opacity: 1; } 
    75% { opacity: 0.6; } 
    100% { opacity: 0.3; }
  `;

  const pulseGreen = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.6); }
    70% { box-shadow: 0 0 0 3px rgba(46, 125, 50, 0); }
    100% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
  `;
  
  const powerOff = keyframes`
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.05) rotate(-5deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    75% { transform: scale(1.05) rotate(-3deg); }
    100% { transform: scale(1) rotate(0deg); }
  `;

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              size="small"
              placeholder="Search connectors..."
              // onChange={(e) => onSearchChange(e.target.value)}
              defaultValue={currentSearch || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchChange(e.target.value);
                }
              }}
            />
            <TextField
              size="small"
              select
              // defaultValue="all"
              defaultValue={currentStatus || 'all'}
              label="Status"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="archieved">Archieved</MenuItem>
            </TextField>
            {/* <TextField
              size="small"
              select
              defaultValue="all"
              label="All Types"
              onChange={(e) => onTypeFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="bank">Bank</MenuItem>
              <MenuItem value="payment">Payment Gateway</MenuItem>
              <MenuItem value="crypto">Crypto Exchange</MenuItem>
            </TextField> */}
          </Stack>
          {/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Button variant="outlined" onClick={onMoreFilters}>
              More Filters
            </Button>
            <Button variant="contained" color="secondary" onClick={onExport}>
              Export
            </Button>
          </Stack> */}
        </Stack>
      </Card>

      <Card sx={{ py: 3, mt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} sx={{ px: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Connectors
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <TableContainer sx={{ px: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell  sx={{ pl: 8 }}>Provider</TableCell>
                <TableCell>Status</TableCell>
                {/* <TableCell>Type</TableCell> */}
                <TableCell>Assigned Admins</TableCell>
                {/* <TableCell>Health</TableCell> */}
                {/* <TableCell>Failover</TableCell> */}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.lighter' }}>
                        <Iconify icon="mdi:bank-outline" width={20} height={20} color="success.main"/>
                      </Avatar> */}
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            closingConnectorId === row.id
                              ? 'error.lighter'
                              : row.commonStatus === 'ACTIVE'
                              ? 'primary.lighter'
                              : 'error.lighter',
                          animation:
                            closingConnectorId === row.id
                              ? `${powerOff} 0.8s ease`
                              : row.commonStatus === 'ACTIVE'
                              ? `${pulseGreen} 2s infinite`
                              : 'none',
                        }}
                      >
                        <Iconify
                          icon="mdi:bank-outline"
                          width={20}
                          height={20}
                          color={
                            closingConnectorId === row.id
                              ? 'warning.main'
                              : row.commonStatus === 'ACTIVE'
                              ? 'success.main'
                              : 'warning.main'
                          }
                        />
                      </Avatar>
                      <Box>
                        {/* <Typography variant="subtitle2">{row.name}</Typography> */}
                        <Stack direction="row" spacing={0.4} alignItems="center">
                          <Typography variant="subtitle2">{row.name}</Typography>

                          {/* Blinking Dot */}
                          {/* {(row.commonStatus === "ACTIVE" || closingConnectorId === row.id) && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor:
                                  closingConnectorId === row.id
                                    ? "error.main"
                                    : "success.main",
                                animation:
                                  closingConnectorId === row.id
                                    ? "none"
                                    : `${blink} 1.5s linear infinite`,
                              }}
                            />
                          )} */}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {row.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.commonStatus} color={getStatusColor(row.commonStatus)} size="small" />
                  </TableCell>
                  {/* <TableCell>{row.type}</TableCell> */}
                  <TableCell>
                    {row.adminNames?.length > 0 ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AvatarGroup
                          max={4}
                          sx={{ '& .MuiAvatar-root': { width: 24, height: 24, border: '2px solid white' } }}
                        >
                          {row.adminNames?.slice(0, 2).map((admin, idx) => (
                            <Avatar key={idx}>{admin[0].toUpperCase()}</Avatar>
                          ))}
                        </AvatarGroup>
                        {row.adminNames?.length > 2 && (
                          <Typography color="text.secondary" variant="caption">+{(row.adminNames?.length ?? 0) - 2} more</Typography>
                          )}
                        {/* <Typography variant="caption">No more</Typography> */}
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No admins assigned
                      </Typography>
                     )}
                  </TableCell>
                  {/* <TableCell>
                    {row.rowsPerPage?.length > 0 ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AvatarGroup
                          max={4}
                          sx={{ '& .MuiAvatar-root': { width: 24, height: 24, border: '2px solid white' } }}
                        >
                          {row.admins?.slice(0, 2).map((admin, idx) => (
                            <Avatar key={idx}>{admin[0].toUpperCase()}</Avatar>
                          ))}
                        </AvatarGroup>
                        {row.admins?.length > 2 && (
                          <Typography variant="caption">+{(row.rowsPerPage?.length ?? 0) - 2} more</Typography>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No admins assigned
                      </Typography>
                    )}
                  </TableCell> */}  
                  {/* <TableCell>
                    {row.health !== null ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.300', borderRadius: 5 }}>
                          <Box
                            sx={{
                              width: `${row.health}%`,
                              height: 8,
                              bgcolor: 'success.main',
                              borderRadius: 5
                            }}
                          />
                        </Box>
                        <Typography variant="caption">{row.health}%</Typography>
                      </Stack>
                    ) : (
                      '--'
                    )}
                  </TableCell> */}
                  {/* <TableCell>
                    {row.failover ? (
                      <Typography variant="body2" color="primary.main">
                        {row.failover}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Not configured
                      </Typography>
                    )}
                  </TableCell> */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small" 
                        // onClick={() => navigate(`edit/${row.id}`)}
                          onClick={() =>
                          navigate(`edit/${row.id}`, {
                            state: { connectorRow: row },   // send the entire row object
                          })
                        }
                      >
                        <Iconify icon="mdi:pencil-outline" width={20} height={20} />
                      </IconButton>
                      <IconButton size="small" onClick={() => onPowerToggle(row)} >
                        <Iconify icon="mdi:power" width={20} height={20} color={row.commonStatus === 'ACTIVE' ? 'success.main' : 'error.main'}/>
                      </IconButton>
                      {/* <IconButton size="small" onClick={() => onSettings(row.id)}>
                        <Iconify icon="mdi:cog-outline" width={20} height={20} />
                      </IconButton> */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="flex-end" alignItems="center" mt={2} sx={{ px: 3 }}>
          <Pagination
            // count={Math.ceil(providers.length / rowsPerPage)}
            count={totalPages}
            page={page}
            // onChange={(e, value) => onPageChange(value)}
            onChange={onPageChange}
            color="primary"
          />
        </Stack>
      </Card>
    </>
  );
}
