import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { toast } from 'sonner';

export function OtpModal({ open, onClose, onSubmit }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits or empty

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      onSubmit(otpCode);
    } else {
      alert('Please enter a 6-digit OTP');
    }
  };

  const cancelHandller = () => {
    setOtp(['', '', '', '', '', '']);
    toast.error('Cancelled by user');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} justifyContent="center" mt={1}>
          {otp.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                inputRef={(el) => {
                  inputRefs.current[index] = el;
                }}
                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                size="small"
                sx={{ width: 40 }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelHandller} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
