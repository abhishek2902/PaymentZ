// src/sections/Connector/RecentActivity.jsx

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function RecentActivity({activitiesLaterFromApi}) {
  const activities = [
    { id: 1, text: 'API credentials updated', time: '2 hours ago', color: 'success.main' },
    { id: 2, text: 'New admin assigned', time: '1 day ago', color: 'info.main' },
    { id: 3, text: 'Failover configuration changed', time: '3 days ago', color: 'warning.main' },
    { id: 4, text: 'Processing limits updated', time: '1 week ago', color: 'info.main' }
  ];
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle2" gutterBottom  mb={4}>
        Recent Activity
      </Typography>

      <Stack spacing={2}>
        {activities.map((activity) => (
          <Stack key={activity.id} direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: activity.color,
                borderRadius: '50%',
                mt: '8px'
              }}
            />
            <Box>
              <Typography variant="body2">{activity.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.time}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
