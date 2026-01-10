// src/sections/connector/ConnectorHealth.jsx

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Iconify } from 'src/components/iconify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';


export function ConnectorHealth({responseData,providersStatus}) {
  const [updatedAt] = useState('30 seconds ago');

  const getColor = (status) => {
    switch (status) {
      case 'active':
        return 'success.main';
      case 'slow':
        return 'warning.main';
      case 'down':
        return 'error.main';
      default:
        return 'grey.500';
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="mdi:heart-pulse" width={24} height={24} color="red"/>
          <Typography variant="h6">Real-Time Health Monitoring</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Last updated: {updatedAt}
          </Typography>
          <Button variant="outlined" startIcon={<Iconify icon="mdi:refresh" width={20} height={20} />}>
            Refresh
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Chart Section */}
				<Box
					sx={{
						width: { xs: '100%', md: '60%' },
						overflowX: 'auto',
						/* Hide scrollbar */
						'&::-webkit-scrollbar': {
							display: 'none'
						},
						scrollbarWidth: 'none', // for Firefox
						msOverflowStyle: 'none' // for IE and Edge
					}}
				>
					<Box> {/* adjust minWidth depending on record count */}
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={responseData}>
								<XAxis dataKey="time" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line type="monotone" dataKey="Chase Bank" stroke="#4caf50" strokeWidth={2} dot />
								<Line type="monotone" dataKey="Stripe" stroke="#2196f3" strokeWidth={2} dot />
								<Line type="monotone" dataKey="Wells Fargo" stroke="#ff9800" strokeWidth={2} dot />
								<Line type="monotone" dataKey="Bank of America" stroke="#f44336" strokeWidth={2} dot />
								<Line type="monotone" dataKey="Coinbase" stroke="#9c27b0" strokeWidth={2} dot />
							</LineChart>
						</ResponsiveContainer>
					</Box>
				</Box>

        {/* Status Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" mb={2}>
            Current Status
          </Typography>
					<Stack spacing={1}>
					{providersStatus.map((provider, idx) => {
							const color1 = getColor(provider.status);
							let background = '';
							
							if (provider.status === 'active') {
							background = '#e8f5e9'; // light green
							} else if (provider.status === 'slow') {
							background = '#fff8e1'; // light yellow
							} else if (provider.status === 'down') {
							background = '#ffebee'; // light red
							} else {
							background = '#f5f5f5';
							}

							return (
							<Card
									key={idx}
									sx={{
									p: 1.5,
									bgcolor: background,
									border: '1px solid',
									borderColor: color1,
									borderRadius: 1
									}}
							>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon="icon-park-outline:dot" width={20} height={20} color={color1} />
                      <Typography variant="body2">{provider.name}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: color1 }}>
                      {provider.time}
                    </Typography>
									</Stack>
							</Card>
							);
					})}
					</Stack>



          {/* Health Summary */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9',border: '1px solid', borderRadius: 1, borderColor: '#4cf03a' }}>
            <Typography variant="subtitle2" gutterBottom>
              Health Summary
            </Typography>
            <Typography variant="body2">• 20 providers healthy</Typography>
            <Typography variant="body2">• 2 providers slow</Typography>
            <Typography variant="body2">• 2 providers down</Typography>
            <Typography variant="body2">• 92% overall uptime</Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
