import { Box, Card, Chip, Stack, Typography, LinearProgress } from '@mui/material';
import { Iconify } from 'src/components/iconify'; // Adjust path as needed

export default function ErrorCodeAnalysis({errorData}) {
  return (
    <Card sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Iconify icon="eva:alert-circle-fill" width={24} height={24} color="error.main" />
        <Typography variant="h6" fontWeight="bold">
          Error Code Analysis
        </Typography>
        <Iconify icon="eva:refresh-fill" width={20} height={20} sx={{ ml: 'auto', cursor: 'pointer' }} />
      </Stack>

      {/* Error Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {errorData.map((error) => (
          <Card key={error.code} sx={{ flex: 1, p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Iconify icon={error.icon} width={24} height={24} color={error.color} />
              <Typography variant="subtitle1" fontWeight="bold">
                {error.code}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {error.count} occurrences
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" mb={1}>
              {error.description}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={error.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.300',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: error.color,
                },
              }}
            />

            <Typography variant="caption" color="text.secondary" mt={0.5}>
              {error.percentage}% of all errors
            </Typography>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
