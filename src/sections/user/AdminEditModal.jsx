import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  Button,
  Typography,
  Box,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListItemText,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listConnector } from 'src/api/connector';
import { assignConnector } from 'src/api/admins';

export function AdminEditModal({ open, onClose, currentAdmin }) {
  const queryClient = useQueryClient();
  const password = useBoolean();
  const [updatePassword, setUpdatePassword] = useState(false);
  const isUpdate = !!currentAdmin?.id;
  const isMdUp = useMediaQuery('(min-width:900px)');

  // ✅ Fetch all connectors
  const {
    data: connectorData,
    isLoading: isConnectorLoading,
    isError,
  } = useQuery({
    queryKey: ['connectors-list'],
    queryFn: () =>
      listConnector({
        page: 0,
        size: 1000,
        status: '',
      }),
    keepPreviousData: true,
    enabled: open,
  });

  const allConnectors = connectorData?.content || [];

  // ✅ Schema
  const AdminSchema = useMemo(() => {
    let schema = zod.object({
      firstName: zod.string().min(1, 'First name is required'),
      lastName: zod.string().min(1, 'Last name is required'),
      email: zod.string().email('Invalid email').min(1, 'Email is required'),
      phone: zod.string().min(5, 'Phone number must be at least 5 digits'),
      commonStatus: zod.enum(['ACTIVE', 'ARCHIVED']),
      connectors: zod.array(zod.string()).min(0, 'Select at least one connector'),
    });

    if (updatePassword) {
      schema = schema
        .extend({
          password: zod.string().min(6, 'Password must be at least 6 characters'),
          confirmPassword: zod.string().min(1, 'Confirm password is required'),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        });
    }

    return schema;
  }, [updatePassword]);

  const defaultValues = useMemo(
    () => ({
      firstName: currentAdmin?.firstName || '',
      lastName: currentAdmin?.lastName || '',
      phone: currentAdmin?.phone || '',
      email: currentAdmin?.email || '',
      commonStatus: currentAdmin?.status || '',
      connectors: currentAdmin?.connectors?.map((c) => String(c.id)) || [],
      password: '',
      confirmPassword: '',
    }),
    [currentAdmin]
  );

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(AdminSchema),
    defaultValues,
  });

  const { handleSubmit, reset, control, watch, formState } = methods;
  const selectedConnectors = watch('connectors');

  // ✅ Reset form when admin changes
  useEffect(() => {
    if (currentAdmin) {
      reset({
        firstName: currentAdmin?.firstName || '',
        lastName: currentAdmin?.lastName || '',
        phone: currentAdmin?.phone || '',
        email: currentAdmin?.email || '',
        commonStatus: currentAdmin?.status|| 'ACTIVE',
        connectors: currentAdmin?.connectors?.map((c) => String(c.id)) || [],
        password: '',
        confirmPassword: '',
      });
    }
  }, [currentAdmin, reset]);

  const updateAdminMutation = useMutation({
    mutationFn: async (payload) => {
      console.log('Sending connector update payload:', payload);
      return assignConnector(payload);
    },
    onSuccess: () => {
      toast.success('Admin connector assignment updated successfully!');
      queryClient.invalidateQueries(['admin-list']);
      onClose();
      reset();
    },
    onError: (error) => {
      console.error('Connector update failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to update admin connector assignment');
    },
  });

  // ✅ On Submit — send activate/deactivate connector lists
  const onSubmit = handleSubmit((data) => {
    const previous = currentAdmin?.connectors?.map((c) => String(c.id)) || [];
    const current = data.connectors.map(String);

    const assignConnectors = current.filter((id) => !previous.includes(id));
    const revokeConnectors = previous.filter((id) => !current.includes(id));

    const editedData = Object.keys(formState.dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    // lets send all data because all data req from bakend
    // const editedData = {
    //   firstName: data.firstName,
    //   lastName: data.lastName,
    //   email: data.email,
    //   phone: data.phone,
    //   commonStatus: data.commonStatus,
    // };

    if (assignConnectors.length || revokeConnectors.length) {
      editedData.assignConnectors = assignConnectors;
      editedData.revokeConnectors = revokeConnectors;
    }

    if (Object.keys(editedData).length === 0) {
      toast.info('No changes to update.');
      return;
    }

    const payload = {
      userId: currentAdmin?.id,
      ...editedData,
      // assignConnectors,  // lets send all data because all data req from bakend  thatswhy
      // revokeConnectors,  // lets send all data because all data req from bakend thatswhy 
    };

    updateAdminMutation.mutate(payload);
  });

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {open && (
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>Edit Admin</DialogTitle>

          <DialogContent
            dividers
            sx={{
              flex: '1 1 auto',
              overflowY: 'auto',
              p: 3,
              pb: { xs: '20vh', sm: '10vh' },
              maxHeight: { xs: '70vh', sm: '75vh' },
            }}
          >
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: '1fr',
                sm: '1fr',
                md: 'repeat(2, 1fr)',
              }}
              gap={2.5}
            >
              <Field.Text name="firstName" label="First Name" />
              <Field.Text name="lastName" label="Last Name" />
              <Field.Text name="phone" label="Phone Number" />
              <Field.Text name="email" label="Email Address" />

              <Field.Select name="commonStatus" label="Status">
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Field.Select>
            </Box>

            {/* ✅ Enhanced connector field */}
            <Box mt={3}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Assigned Connectors
              </Typography>

              {/* ✅ Show already connected connectors (with unselect checkboxes) */}
              {selectedConnectors?.length > 0 && (
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {selectedConnectors.map((id) => {
                    // Convert both IDs to string to prevent mismatches
                    const connector = allConnectors.find((c) => String(c.id) === String(id));
                    return (
                      connector && (
                        <Box
                          key={connector.id}
                          display="flex"
                          alignItems="center"
                          pr={1}
                          borderRadius={1}
                          sx={{
                            bgcolor: 'background.paper',
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Checkbox
                            size="small"
                            checked
                            onChange={() => {
                              // On uncheck, remove connector
                              const updated = selectedConnectors.filter(
                                (val) => String(val) !== String(connector.id)
                              );
                              methods.setValue('connectors', updated, { shouldValidate: true });
                            }}
                          />
                          <Typography variant="body2" sx={{ ml: 0}}>
                            {connector.name}
                          </Typography>
                        </Box>
                      )
                    );
                  })}
                </Stack>
              )}

              {/* ✅ Dropdown field for adding new connectors */}
              <Controller
                name="connectors"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <Select
                      {...field}
                      multiple
                      displayEmpty
                      value={field.value || []}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Ensure all IDs are stored as strings
                        const normalized = (typeof value === 'string' ? value.split(',') : value).map(String);
                        field.onChange(normalized);
                      }}
                      input={<OutlinedInput />}
                      renderValue={() => (
                        <Typography variant="body2" color="text.secondary">
                          Select connectors to add
                        </Typography>
                      )}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 300 } },
                      }}
                    >
                      {allConnectors.map((connector) => {
                        const connectorId = String(connector.id);
                        return (
                          <MenuItem key={connector.id} value={connectorId}>
                            <Checkbox checked={field.value.map(String).includes(connectorId)} />
                            <ListItemText primary={connector.name} />
                          </MenuItem>
                        );
                      })}
                    </Select>

                    {/* ✅ Fixed error message spacing */}
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Password fields */}
            {updatePassword && (
              <Box
                mt={3}
                display="grid"
                gridTemplateColumns={{
                  xs: '1fr',
                  sm: '1fr',
                  md: 'repeat(2, 1fr)',
                }}
                gap={2.5}
              >
                <Field.Text
                  name="password"
                  label="New Password"
                  type={password.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Field.Text
                  name="confirmPassword"
                  label="Confirm Password"
                  type={password.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              flexShrink: 0,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
              px: 3,
              py: 2,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
              position: 'sticky',
              bottom: 0,
              zIndex: 2,
            }}
          >
            {isUpdate && (
              <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
                <Checkbox
                  checked={updatePassword}
                  onChange={() => setUpdatePassword(!updatePassword)}
                />
                <Typography variant="body2">Update Password</Typography>
              </Stack>
            )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button fullWidth variant="outlined" onClick={onClose}>
                Cancel
              </Button>

              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={formState.isSubmitting || updateAdminMutation.isPending}
              >
                Save
              </LoadingButton>
            </Stack>
          </DialogActions>
        </Form>
      )}
    </Dialog>
  );
}
