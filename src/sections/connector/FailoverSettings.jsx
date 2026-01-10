// src/sections/connector/FailoverSettings.jsx

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function FailoverSettings({ settings, onSettingsChange }) {

  const handleChange = (field) => (event) => {
    onSettingsChange({
      ...settings,
      [field]: event.target.value
    });
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle2" gutterBottom mb={4}>
        Failover Settings
      </Typography>

      <Stack spacing={4}>
        <TextField
          select
          label="Primary Failover"
          value={settings.primary}
          onChange={handleChange('primary')}
          fullWidth
        >
          <MenuItem value="Wells Fargo">Wells Fargo</MenuItem>
          <MenuItem value="Bank of America">Bank of America</MenuItem>
          <MenuItem value="PayPal">PayPal</MenuItem>
        </TextField>

        <TextField
          select
          label="Secondary Failover"
          value={settings.secondary}
          onChange={handleChange('secondary')}
          fullWidth
        >
          <MenuItem value="Bank of America">Bank of America</MenuItem>
          <MenuItem value="Wells Fargo">Wells Fargo</MenuItem>
          <MenuItem value="Stripe">Stripe</MenuItem>
        </TextField>

        <TextField
          select
          label="Trigger Threshold"
          value={settings.threshold}
          onChange={handleChange('threshold')}
          fullWidth
        >
          <MenuItem value="60% failure rate">60% failure rate</MenuItem>
          <MenuItem value="75% failure rate">75% failure rate</MenuItem>
          <MenuItem value="90% failure rate">90% failure rate</MenuItem>
        </TextField>
      </Stack>
    </Card>
  );
}
