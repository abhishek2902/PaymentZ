import { Card, CardContent, Typography, TextField, MenuItem, FormControlLabel, Checkbox, Stack } from '@mui/material';

export function StatusControl({ status, priority, onStatusChange, onPriorityChange, onEnableFailover, onHealthMonitoring }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom  mb={4}>
          Status Control
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Connector Status"
            select
            value={status}
            onChange={onStatusChange}
            fullWidth
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
            {/* <MenuItem value="Error">Error</MenuItem> */}
            {/* <MenuItem value="Disabled">Disabled</MenuItem> */}
          </TextField>

          {/* <TextField
            label="Priority Level"
            select
            value={priority}
            onChange={onPriorityChange}
            fullWidth
          >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </TextField> */}

          {/* <FormControlLabel
            control={<Checkbox checked onChange={onEnableFailover} />}
            label="Enable Auto Failover"
          />
          <FormControlLabel
            control={<Checkbox checked onChange={onHealthMonitoring} />}
            label="Health Monitoring"
          /> */}
        </Stack>
      </CardContent>
    </Card>
  );
}
