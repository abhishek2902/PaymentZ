import { Box, Card, Stack, Typography, Avatar, Chip, Divider } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function InfoCard({ name,description,status }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between">
        
        <Stack direction="row" spacing={2 } alignItems="center">
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.lighter' }}>
            <Iconify icon="mdi:bank-outline" width={28} height={28} color="success.main"/>
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <Chip label={status} size="small" color={status === 'ACTIVE' ? 'success' : 'error'}/>
              {/* <Typography variant="caption" color="text.secondary">
                ID: {id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last Updated: {lastUpdated}
              </Typography> */}
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={4} alignItems="center">
          <Box textAlign="right">
            <Typography variant="h6" fontWeight={700} color="success.main">
              {/* {uptime} */}
              98.5%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Uptime
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box textAlign="right">
            <Typography variant="h6" fontWeight={700}>
              {/* {responseTime} */}
              0.8s
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Response avg
            </Typography>
          </Box>
        </Stack>

      </Stack>
    </Card>
  );
}
