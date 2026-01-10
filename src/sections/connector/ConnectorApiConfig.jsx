import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
  Box,
  Button,
  Divider
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ConnectorApiConfig({
  apiConfigData,
  onApiConfigChange,
  showApiKey,
  toggleShowApiKey
}) {
  const handleChange = (field, value) => {
    onApiConfigChange(field, value);
  };

  const handleBankChange = (index, field, value) => {
    const updatedBanks = [...apiConfigData.banks];
    updatedBanks[index] = { ...updatedBanks[index], [field]: value };
    handleChange('banks', updatedBanks);
  };

  const handleAddBank = () => {
    const newBank = {
      accountName: '',
      baseUrl: '',
      apiKey: '',
      webhookUrl: ''
    };
    handleChange('banks', [...apiConfigData.banks, newBank]);
  };

  const handleRemoveBank = (index) => {
    const updatedBanks = apiConfigData.banks.filter((_, i) => i !== index);
    handleChange('banks', updatedBanks);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Iconify icon="carbon:api-key" width={24} height={24} color="success.main" />
          <Typography variant="subtitle1">API Configuration</Typography>
        </Box>

        {/* General Config */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="API Version"
              fullWidth
              value={apiConfigData.apiVersion}
              onChange={(e) => handleChange('apiVersion', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Authentication Type"
              select
              fullWidth
              value={apiConfigData.authType}
              onChange={(e) => handleChange('authType', e.target.value)}
            >
              <MenuItem value="apiKey">API Key</MenuItem>
              <MenuItem value="oauth">OAuth 2.0</MenuItem>
              <MenuItem value="basic">Basic Auth</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Timeout (seconds)"
              fullWidth
              value={apiConfigData.timeout}
              onChange={(e) => handleChange('timeout', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Rate Limit (per minute)"
              fullWidth
              value={apiConfigData.rateLimit}
              onChange={(e) => handleChange('rateLimit', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Retry Attempts"
              fullWidth
              value={apiConfigData.retryAttempts}
              onChange={(e) => handleChange('retryAttempts', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Retry Delay (ms)"
              fullWidth
              value={apiConfigData.retryDelay}
              onChange={(e) => handleChange('retryDelay', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Banks Config */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2">Banks</Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={handleAddBank}
          >
            Add Bank
          </Button>
        </Box>

        {apiConfigData.banks.map((bank, index) => (
          <Box
            key={index}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              mb: 2
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body1" fontWeight="bold">
                Bank #{index + 1}
              </Typography>
              <IconButton color="error" onClick={() => handleRemoveBank(index)}>
                <Iconify icon="mdi:trash-can-outline" />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Account Name"
                  fullWidth
                  value={bank.accountName}
                  onChange={(e) => handleBankChange(index, 'accountName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Base URL"
                  fullWidth
                  value={bank.baseUrl}
                  onChange={(e) => handleBankChange(index, 'baseUrl', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="API Key"
                  fullWidth
                  type={showApiKey ? 'text' : 'password'}
                  value={bank.apiKey}
                  onChange={(e) => handleBankChange(index, 'apiKey', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowApiKey}>
                          <Iconify
                            icon={
                              showApiKey
                                ? 'mdi:eye-off-outline'
                                : 'mdi:eye-outline'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Webhook URL"
                  fullWidth
                  value={bank.webhookUrl}
                  onChange={(e) => handleBankChange(index, 'webhookUrl', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
