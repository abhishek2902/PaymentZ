import * as React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Chip,
  Paper,
  Stack,
  Tooltip,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

/** Helpers */
const fLatency = (ms) => (ms || ms === 0 ? `${ms} ms` : '—');
const fUptime = (v) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '—');

const STATUS_META = {
  up: { label: 'UP', color: 'success' },
  degraded: { label: 'DEGRADED', color: 'warning' },
  down: { label: 'DOWN', color: 'error' },
  unknown: { label: 'UNKNOWN', color: 'default' },
};

function StatusChip({ status = 'unknown' }) {
  const meta = STATUS_META[status] || STATUS_META.unknown;
  return (
    <Chip
      size="small"
      color={meta.color}
      label={meta.label}
      sx={{
        fontWeight: 600,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  );
}

function HealthRow({ name, icon, status, latencyMs, uptime }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        borderRadius: 1,
      }}
    >
      {/* Left: icon + name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
        <Box
          sx={{
            width: 30,
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 0.75,
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          {icon ? <Icon icon={icon} width={18} height={18} /> : null}
        </Box>
        <Typography variant="body1" noWrap>
          {name}
        </Typography>
      </Box>

      {/* Right: status + metrics */}
      <Box sx={{ ml: 'auto', textAlign: 'right' }}>
        <StatusChip status={status} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {fLatency(latencyMs)} • {fUptime(uptime)} uptime
        </Typography>
      </Box>
    </Paper>
  );
}

/**
 * BankApiHealthCard
 * props:
 * - title?: string
 * - items: Array<{ key: string; name: string; icon?: string; status?: 'up'|'degraded'|'down'|'unknown'; latencyMs?: number|null; uptime?: number }>
 */
export default function BankApiHealthCard({ title = 'Bank API Health', items = [] }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        sx={{ pb: 1, '& .MuiCardHeader-title': { fontSize: 20, fontWeight: 600 } }}
      />
      <CardContent>
        <Stack spacing={1.25}>
          {items.map((it) => (
            <Tooltip
              key={it.key}
              title={`${it.name} • ${STATUS_META[it.status || 'unknown']?.label}`}
              arrow
              placement="top"
            >
              <div>
                <HealthRow
                  name={it.name}
                  icon={it.icon}
                  status={it.status}
                  latencyMs={it.latencyMs}
                  uptime={it.uptime}
                />
              </div>
            </Tooltip>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
