import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Icon } from '@iconify/react';

export function SiteModal({ currentUser, open, onClose }) {
  const [copyStatus, setCopyStatus] = useState({ merchantId: false, siteToken: false });
  console.log('currentUser', currentUser);
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [field]: true });

    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [field]: false });
    }, 2000);
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Details</DialogTitle>

      <DialogContent sx={{ pt: 2 }} dividers>
        <TextField
          label="Merchant ID"
          fullWidth
          margin="dense"
          value={currentUser?.merchantId || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Tooltip title={copyStatus.merchantId ? 'Copied!' : 'Copy'}>
                <IconButton onClick={() => handleCopy(currentUser?.merchantId, 'merchantId')}>
                  <Icon icon="mdi:content-copy" width={20} />
                </IconButton>
              </Tooltip>
            ),
          }}
        />

        <TextField
          label="Site Token"
          fullWidth
          margin="dense"
          value={currentUser?.siteToken || ''}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Tooltip title={copyStatus.siteToken ? 'Copied!' : 'Copy'}>
                <IconButton onClick={() => handleCopy(currentUser?.siteToken, 'siteToken')}>
                  <Icon icon="mdi:content-copy" width={20} />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
