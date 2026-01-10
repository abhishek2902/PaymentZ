import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export default function EditActions({
  onTestConnection,
  onExportConfig,
  onDeleteProvider,
  onCancel,
  onSaveChanges
}) {
  return (
    <Card sx={{ p: 3, mt: 4, borderRadius: 2, boxShadow: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="end" alignItems="center">
        
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Button variant="contained" color="primary" startIcon={<Iconify icon="mdi:play-circle-outline" width={24} />} onClick={onTestConnection}>
            Test Connection
          </Button>

          <Button variant="outlined" startIcon={<Iconify icon="mdi:download-outline" width={24} />} onClick={onExportConfig}>
            Export Config
          </Button>

          <Button variant="outlined" color="error" startIcon={<Iconify icon="mdi:delete-outline" width={24} />} onClick={onDeleteProvider}>
            Delete Provider
          </Button>
        </Stack> */}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Button variant="text" color="inherit" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="contained" color="secondary" startIcon={<Iconify icon="mdi:content-save-outline" width={24} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </Stack>

      </Stack>
    </Card>
  );
}
