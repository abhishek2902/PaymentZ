import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useBoolean } from 'src/hooks/use-boolean';
import { listPaymentGateways } from 'src/api/payment-gateway';
import { createMerchant, updateMerchant } from 'src/api/merchant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listGenericLookups } from 'src/api/genericLookup';
import { FormControl, InputLabel, Select, TextField, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { capitalizeWords } from 'src/utils/helper';

export function UserModal({ currentUser, open, onClose }) {
  const queryClient = useQueryClient();
  const [updatePassword, setUpdatePassword] = useState(false);
  const password = useBoolean();
  const isUpdate = !!currentUser?.id; // Check if it's an update

  const {
    data: paymentGateways = [],
    isLoading: isPaymentgatewayLoading,
    error: isPaymentGatewayError,
  } = useQuery({
    queryKey: ['paymentGateways'],
    queryFn: () =>
      listPaymentGateways({
        currentPage: 1,
        itemsPerPage: 25,
        status: 'ACTIVE',
        order: 'desc',
        orderBy: 'createdDate',
      }).then((res) => res.items),

    enabled: open, // Fetch only when modal is open
  });

  const defaultValues = useMemo(
    () => ({
      clientName: currentUser?.clientName || '',
      businessName: currentUser?.businessName || '',
      email: currentUser?.emailAddress || '',
      phone: currentUser?.phone || '',
      status: currentUser?.status || 'ACTIVE',
      roles: currentUser?.roles || '',
      assignedConnectors: currentUser?.assignedConnectors || [],
      AssignedBusiness: currentUser?.AssignedBusiness || [],
    }),
    [currentUser]
  );

  // Dummy default role for schema evaluation before form loads
  const tempRole = currentUser?.roles || '';

  const MerchantSchema = useMemo(() => {
    let base = zod.object({
      name: zod.string().min(1, 'Name is required!'),
      email: zod.string().min(1, 'Email is required!').email('Invalid email address!'),
      phone: zod.string().min(10, 'Phone number must be at least 10 digits!'),
      roles: zod.string().min(1, 'Role is required!'),
      status: zod.enum(['ACTIVE', 'ARCHIVE']).default('ACTIVE'),
      ...(isUpdate && !updatePassword
        ? {}
        : {
            password: zod.string().min(1, 'New password is required!'),
            confirmNewPassword: zod.string().min(1, 'Confirm password is required!'),
          }),
    });

    if (tempRole !== 'superadmin') {
      base = base.extend({
        assignedConnectors: zod
          .array(zod.string().min(1))
          .min(1, { message: 'Assigned Connectors is required!' }),
        AssignedBusiness: zod
          .array(zod.string().min(1))
          .min(1, { message: 'Assigned Business is required!' }),
      });
    }

    return base.refine((data) => data.password === data.confirmNewPassword, {
      message: 'Passwords do not match!',
      path: ['confirmNewPassword'],
    });
  }, [isUpdate, updatePassword, tempRole]);

  const roles = [
    {
      code: 'superadmin',
      description: 'Super Admin',
    },
    {
      code: 'manager',
      description: 'Manager',
    },
    {
      code: 'viewer',
      description: 'Viewer',
    },
  ];

  const {
    data: merchantStatusOptions = [],
    isLoading,
    error: merchantError,
  } = useQuery({
    queryKey: ['genericLookup'],
    queryFn: () =>
      listGenericLookups({
        lookupType: 'MERCHANT',
      }).then((res) => res),
    staleTime: 300000, // 5 minutes cache
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    enabled: open, // Fetch only when modal is open
  });

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(MerchantSchema),
    defaultValues,
  });

  const selectedRole = methods.watch('roles');

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'websites' });

  // React Query Mutation
  const createMutation = useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      toast.success('Merchant created successfully!');
      queryClient.invalidateQueries(['merchants']); // Refetch the data
      reset();
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.error?.description
          ? `${error?.error?.description}. Check for duplicate entries`
          : 'Failed to create merchant'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMerchant,
    onSuccess: () => {
      toast.success('Merchant updated successfully!');
      queryClient.invalidateQueries(['merchants']); // Refetch the data
      reset();
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update merchant');
    },
  });

  // add and update merchant modal
  const onSubmit = handleSubmit((data) => {
    const uniqueSet = new Set();
    const hasDuplicates = data.websites.some(({ siteUrl, paymentGatewayId }) => {
      const key = `${siteUrl}-${paymentGatewayId}`;
      if (uniqueSet.has(key)) return true; // Duplicate found
      uniqueSet.add(key);
      return false;
    });

    if (hasDuplicates) {
      toast.error('You cannot add or update with duplicate website URLs and payment gateways!');
      return;
    }

    if (currentUser?.id) {
      updateMutation.mutate({ id: currentUser.id, body: { ...data } });
    } else {
      createMutation.mutate(data);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 950 } }}
    >
      {open && (
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>{currentUser ? 'Update User' : 'Add User'}</DialogTitle>

          <DialogContent sx={{ pt: 2 }} dividers>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text defaultValue={currentUser?.clientName} name="name" label="Name" />

              <Field.Text defaultValue={currentUser?.phone} name="phone" label="Phone number" />
              {/* <Field.Phone defaultValue={currentUser?.phone} name="phone" label="Phone number" /> */}
              <Field.Text
                defaultValue={currentUser?.emailAddress}
                name="email"
                type="email"
                label="Email address"
              />
              <Field.Select name="roles" label="Roles">
                {roles?.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.description}
                  </MenuItem>
                ))}
              </Field.Select>
              {selectedRole !== 'superadmin' && (
                <>
                  <Field.Select name="assignedConnectors" label="Assigned Connectors">
                    <MenuItem>
                      <Checkbox />
                      <Typography variant="body2">Assigned Connectors</Typography>
                    </MenuItem>
                  </Field.Select>
                  <Field.Select name="AssignedBusiness" label="Assigned Business">
                    <MenuItem>
                      <Checkbox />
                      <Typography variant="body2">Assigned Business</Typography>
                    </MenuItem>
                  </Field.Select>
                </>
              )}

              {(!isUpdate || updatePassword) && (
                <>
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
                    name="confirmNewPassword"
                    label="Confirm New Password"
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
                </>
              )}

              <Field.Select name="status" label="Status">
                {merchantStatusOptions?.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.description}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>
          </DialogContent>

          <DialogActions>
            {isUpdate && (
              <Stack
                sx={{ justifyContent: 'flex-start', flexGrow: 1 }}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Checkbox
                  checked={updatePassword}
                  onChange={() => setUpdatePassword(!updatePassword)}
                />
                <Typography variant="body2">Update Password</Typography>
              </Stack>
            )}
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </DialogActions>
        </Form>
      )}
    </Dialog>
  );
}
