import React from 'react';
import { Modal, Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function PaymentStatusMonremModal({
  open,
  onClose,
  success,
  transactionId,
  transactionStatus,
  transactionMessage,
}) {
  const navigate = useNavigate();
  //  redirect to transactions page
  const handleRedirectToTransactions = () => {
    navigate('/dashboard/transactions');
    onClose();
  };
  return (
    <Modal open={open} disableEscapeKeyDown>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
        }}
      >
        {success ? (
          <>
            <Typography variant="h6" gutterBottom>
              Transaction Processed Successfully
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Transaction ID:</strong> {transactionId || 'N/A'}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Status:</strong>{' '}
              {transactionStatus
                ? transactionStatus.charAt(0).toUpperCase() + transactionStatus.slice(1)
                : 'Unknown'}
            </Typography>
            {transactionMessage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Message:</strong> {transactionMessage || 'N/A'}
              </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 1 }}>
              You can go to the transaction page to view the full status and history.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, mr: 1 }} onClick={onClose}>
              Close
            </Button>
            <Button variant="outlined" sx={{ mt: 3 }} onClick={handleRedirectToTransactions}>
              Go to Transaction Page
            </Button>
          </>
        ) : (
          <>
            <CircularProgress />
            <Typography variant="h6" mt={2}>
              Your payment is processing…
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Please don’t refresh or go back during this process.
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}
