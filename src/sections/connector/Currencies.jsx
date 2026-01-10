import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function Currencies({primaryCurrency,setPrimaryCurrency,additionalCurrencies,setAdditionalCurrencies,onPrimaryCurrencyChange,onAdditionalCurrencyToggle}) {

  const handleToggle = (currency) => {
    setAdditionalCurrencies({
      ...additionalCurrencies,
      [currency]: !additionalCurrencies[currency]
    });
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={4}>
          <Iconify icon="mdi:currency-usd-circle-outline" width={24} height={24} color="success.main"/>
          <Typography variant="subtitle1" ml={1}>
            Supported Currencies
          </Typography>
        </Box>

        <TextField
          select
          fullWidth
          label="Primary Currency"
          value={primaryCurrency}
          onChange={(e) => setPrimaryCurrency(e.target.value)}
          sx={{ mb: 4 }}
        >
          <MenuItem value="USD">USD - US Dollar</MenuItem>
          <MenuItem value="EUR">EUR - Euro</MenuItem>
          <MenuItem value="GBP">GBP - British Pound</MenuItem>
          <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
          <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
          <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
          <MenuItem value="CHF">CHF - Swiss Franc</MenuItem>
          <MenuItem value="SEK">SEK - Swedish Krona</MenuItem>
        </TextField>

        <Typography variant="body2" mb={1}>
          Additional Supported Currencies
        </Typography>

        <FormGroup row>
          {Object.keys(additionalCurrencies).map((currency) => (
            <FormControlLabel
              key={currency}
              control={
                <Checkbox
                  checked={additionalCurrencies[currency]}
                  onChange={() => handleToggle(currency)}
                />
              }
              label={currency}
            />
          ))}
        </FormGroup>

        <Box mt={4} display="flex" gap={1} p={2} bgcolor="#f0f4ff" borderRadius={1}>
          <Iconify icon="mdi:information" width={24} height={24} color="success.main"/>
          <Typography variant="body2" color="text.secondary">
            <strong>Currency Processing Notes</strong>
            <br />
            Selected currencies will be available for transaction processing. Ensure your connector
            supports these currencies before enabling them.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
