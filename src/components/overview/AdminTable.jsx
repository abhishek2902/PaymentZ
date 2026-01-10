import React from 'react';
import { Icon } from '@iconify/react';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Chip,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

function PlanChip({ plan = 'Standard' }) {
  const map = {
    Premium: { color: 'secondary', bg: (t) => alpha(t.palette.secondary.main, 0.12) },
    Business: { color: 'info', bg: (t) => alpha(t.palette.info.main, 0.12) },
    Standard: { color: 'default', bg: (t) => alpha(t.palette.grey[500], 0.16) },
  };
  const cfg = map[plan] || map.Standard;
  return (
    <Chip
      label={plan}
      size="small"
      variant={cfg.color === 'default' ? 'outlined' : 'filled'}
      color={cfg.color === 'default' ? undefined : cfg.color}
      sx={{ bgcolor: cfg.bg, fontWeight: 600 }}
    />
  );
}

function StatusPill({ status = 'Active' }) {
  const map = {
    Active: { color: 'success', text: 'Active' },
    Pending: { color: 'warning', text: 'Pending' },
    Suspended: { color: 'error', text: 'Suspended' },
  };
  const cfg = map[status] || map.Active;
  return (
    <Chip
      size="small"
      label={cfg.text}
      color={cfg.color}
      variant="soft"
      sx={{
        borderRadius: 2,
        fontWeight: 700,
        bgcolor: (t) => alpha(t.palette[cfg.color].main, 0.12),
      }}
    />
  );
}

function Money({ value }) {
  return (
    <Typography variant="body2" fontWeight={700}>
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
      }).format(value)}
    </Typography>
  );
}

export default function AdminTable({ rows = [], onEdit, onMore }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Admin</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Plan</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Volume (30d)</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Commission</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Avatar src={r.avatar} alt={r.name} sx={{ width: 36, height: 36 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {r.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <PlanChip plan={r.plan} />
              </TableCell>
              <TableCell>
                <Money value={r.volume} />
              </TableCell>
              <TableCell>{(r.commission * 100).toFixed(1)}%</TableCell>
              <TableCell>
                <StatusPill status={r.status} />
              </TableCell>

              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit?.(r)}>
                  <Icon icon="mdi:square-edit-outline" />
                </IconButton>
                <IconButton size="small" onClick={() => onMore?.(r)}>
                  <Icon icon="mdi:dots-horizontal" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
