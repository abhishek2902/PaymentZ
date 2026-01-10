import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { useBoolean } from 'src/hooks/use-boolean';
import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { CustomField } from './FormField';

// ----------------------------------------------------------------------

export function PaymentNewCardForm({
  sx,
  isRHF,
  cvvField,
  dateField,
  numberField,
  holderField,
  onSave,
  onCancel,
  ...other
}) {
  const FormField = isRHF ? Field.Text : TextField;

  const showPassword = useBoolean();

  return (
    <Box
      sx={[
        () => ({
          gap: 2.5,
          width: 1,
          display: 'flex',
          flexDirection: 'column',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <FormField
        label="Card number"
        placeholder="xxxx xxxx xxxx xxxx"
        slotProps={{ inputLabel: { shrink: true } }}
        {...numberField}
        name={numberField?.name ?? ''}
        rules={{
          required: 'Card number is required',
          pattern: {
            value: /^\d{16}$/,
            message: 'Card number must be 16 digits',
          },
        }}
      />

      <Box sx={{ gap: 2, display: 'flex' }}>
        <FormField
          fullWidth
          label="Card Holder Name"
          // placeholder="John Doe"
          slotProps={{ inputLabel: { shrink: true } }}
          {...holderField}
          name={holderField?.name ?? ''}
          rules={{
            required: 'Card holder name is required',
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: 'Card holder name must only contain letters',
            },
          }}
        />
        <CustomField name="productPrice" label="Amount" />
      </Box>
      <Box sx={{ gap: 2, display: 'flex' }}>
        <FormField
          fullWidth
          label="Expiration date"
          placeholder="MM/YY"
          slotProps={{ inputLabel: { shrink: true } }}
          {...dateField}
          name={dateField?.name ?? ''}
          rules={{
            required: 'Expiration date is required',
            pattern: {
              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: 'Expiration date must be in MM/YY format',
            },
          }}
        />
        <FormField
          fullWidth
          label="CVV"
          placeholder="***"
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword.value ? 'text' : 'password'}
          {...cvvField}
          name={cvvField?.name ?? ''}
          rules={{
            required: 'CVV is required',
            pattern: {
              value: /^\d{3,4}$/,
              message: 'CVV must be 3 or 4 digits',
            },
          }}
        />
      </Box>

      <Box
        sx={{
          gap: 1,
          display: 'flex',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        <Iconify icon="solar:lock-password-outline" />
        Your transaction is secured with SSL encryption
      </Box>

      {/* Save and Cancel Buttons */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
      </Box> */}
    </Box>
  );
}
