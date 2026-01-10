import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Box
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ConnectorApiDocumentation({
  apiDocData,
  onApiDocChange
}) {
  const handleChange = (field, value) => {
    onApiDocChange(field, value);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={4}>
          <Iconify icon="mdi:file-document-outline" width={24} height={24} color="warning.main" />
          <Typography variant="subtitle1" ml={1}>
            API Documentation & References
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Official Documentation URL"
              fullWidth
              value={apiDocData.officialDocUrl}
              onChange={(e) => handleChange('officialDocUrl', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="SDK Documentation"
              fullWidth
              value={apiDocData.sdkDocUrl}
              onChange={(e) => handleChange('sdkDocUrl', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Postman Collection"
              fullWidth
              value={apiDocData.postmanCollection}
              onChange={(e) => handleChange('postmanCollection', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Status Page"
              fullWidth
              value={apiDocData.statusPage}
              onChange={(e) => handleChange('statusPage', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Integration Notes"
              fullWidth
              multiline
              rows={4}
              value={apiDocData.integrationNotes}
              onChange={(e) => handleChange('integrationNotes', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Error Handling Guide"
              fullWidth
              multiline
              rows={4}
              value={apiDocData.errorGuide}
              onChange={(e) => handleChange('errorGuide', e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={2} p={2} bgcolor="#fff3e0" borderRadius={1}>
          <Box display="flex" alignItems="center" mb={1}>
            <Iconify icon="mdi:lightbulb-on-outline" width={20} height={20} />
            <Typography variant="body2" fontWeight="bold" ml={1}>
              Documentation Tips
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Keep documentation URLs updated and add implementation notes to help future developers integrate with this provider efficiently.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
