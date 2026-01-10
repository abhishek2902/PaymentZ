// src/sections/connector/ConnectorStats.jsx

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Iconify } from 'src/components/iconify';

export function ConnectorStats({ stats }) {
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h6">{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: stat.changeColor }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: stat.iconBg,
                    color: 'primary.main',
                    width: 40,
                    height: 40,
                    borderRadius: '10px'
                  }}
                >
                  <Iconify icon={stat.icon} width={24} height={24} />
                </Avatar>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
