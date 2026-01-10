import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Box
} from '@mui/material';

export function AssignedAdmins({ admins = [], onRemove }) {
  return (
    <Card>
      <CardHeader title="Assigned Admins" />

      <CardContent>
        {admins.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 3
            }}
          >
            <Typography variant="body2">No admins assigned.</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {admins.map((admin, index) => (
              <Stack
                key={admin || index}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 1,
                  backgroundColor: '#fafafa',
                }}
              >
                {/* Admin Info */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={admin || admin || ""}
                    sx={{ width: 36, height: 36 }}
                  />

                  <Stack spacing={0}>
                    <Typography variant="subtitle2">
                      {admin || "Unnamed Admin"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {admin || admin.businessName || "—"}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Remove Button */}
                {/* {onRemove && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemove(index)}
                  >
                    <Iconify icon="mdi:close" width={20} height={20} />
                  </IconButton>
                )} */}
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
