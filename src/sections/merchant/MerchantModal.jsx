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

export function MerchantModal({ currentUser, open, onClose }) {
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

  // merchant schema
  const MerchantSchema = zod
    .object({
      clientName: zod.string().min(1, { message: 'Client name is required!' }),
      businessName: zod.string().min(1, { message: 'Business name is required!' }),
      email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
      phone: zod.string().min(10, { message: 'Phone number must be at least 10 digits!' }),
      ...(isUpdate && !updatePassword
        ? {} // No password fields if updating and checkbox is not checked
        : {
            password: zod.string().min(1, { message: 'New password is required!' }),
            confirmNewPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
          }),
      status: zod.enum(['ACTIVE', 'ARCHIVE']).default('ACTIVE'),
      websites: zod.array(
        zod.object({
          id: zod.string().optional(),
          paymentGatewayId: zod.string().min(1, { message: 'Payment Gateway is required!' }),
          type: zod.enum(['WEBSITE']),
          siteUrl: zod.string().url({ message: 'Invalid URL format' }).default('https://'),
          description: zod.string().min(1, { message: 'Description is required!' }),
        })
      ),
    })
    .refine((data) => data.password === data.confirmNewPassword, {
      message: 'Passwords do not match!',
      path: ['confirmNewPassword'],
    });

  const defaultValues = useMemo(
    () => ({
      clientName: currentUser?.clientName || '',
      businessName: currentUser?.businessName || '',
      email: currentUser?.emailAddress || '',
      phone: currentUser?.phone || '',
      status: currentUser?.status || 'ACTIVE',
      websites:
        currentUser?.websites && currentUser?.websites.length > 0
          ? currentUser?.websites?.map((website) => ({
              id: website.id,
              paymentGatewayId: website.paymentId,
              type: website.type,
              siteUrl: website.Url,
              description: website.description,
              isExisting: true,
            }))
          : [
              {
                paymentGatewayId: '',
                type: 'WEBSITE',
                siteUrl: 'https://',
                description: '',
                isExisting: false, // New website
              },
            ],
    }),
    [currentUser]
  );

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
          <DialogTitle>{currentUser ? 'Update Business' : 'Add Business'}</DialogTitle>

          <DialogContent sx={{ pt: 2 }} dividers>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text
                defaultValue={currentUser?.clientName}
                name="clientName"
                label="Client name"
              />
              <Field.Text
                defaultValue={currentUser?.businessName}
                name="businessName"
                label="Business name"
              />
              <Field.Text defaultValue={currentUser?.phone} name="phone" label="Phone number" />
              {/* <Field.Phone defaultValue={currentUser?.phone} name="phone" label="Phone number" /> */}
              <Field.Text
                defaultValue={currentUser?.emailAddress}
                name="email"
                type="email"
                label="Email address"
              />

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
            {/* Websites Section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Websites
              </Typography>
              {fields.map((website, index) => (
                <Box
                  key={website.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr', // 1 column on extra-small screens (mobile)
                      sm: 'repeat(2, 1fr)', // 2 columns on small screens (tablet)
                      md: 'repeat(4, 1fr)', // 4 columns on medium+ screens (desktop)
                    },
                    gap: 2,
                    border: '1px solid #ddd',
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Field.Select
                    label="Payment Gateway"
                    name={`websites.${index}.paymentGatewayId`}
                    defaultValue={website.paymentId}
                    disabled={website.isExisting} // Disable if it's an existing website
                  >
                    {paymentGateways.map((gateway) => (
                      <MenuItem key={gateway.id} value={gateway.id}>
                        {capitalizeWords(gateway.name)}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Text
                    name={`websites.${index}.siteUrl`}
                    defaultValue={website.Url}
                    label="Website URL"
                  />
                  <Field.Text
                    name={`websites.${index}.description`}
                    defaultValue={website.Url}
                    label="Description"
                  />

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      onClick={() =>
                        append({
                          paymentGatewayId: '',
                          type: 'WEBSITE',
                          siteUrl: 'https://',
                          description: '',
                        })
                      }
                    >
                      <Icon icon="ic:round-add" />
                    </IconButton>
                    {fields.length > 1 && (
                      <IconButton onClick={() => remove(index)}>
                        <Icon icon="ic:round-remove" />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              ))}
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
