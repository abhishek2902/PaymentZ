import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';

const customerSchema = zod
  .object({
    clientName: zod.string().min(1, { message: 'Client name is required!' }),
    businessName: zod.string().min(1, { message: 'Business name is required!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    password: zod.string().min(1, { message: 'New password is required!' }),
    confirmNewPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
    // paymentGateway: zod.string().min(1, { message: 'Payment gateway is required!' }),
  })
  .refine((data) => data.password === data.confirmNewPassword, {
    message: 'Passwords do not match!',
    path: ['confirmNewPassword'],
  });

const GENDERS = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

export function CustomerModal({ currentUser, open, onClose }) {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    listPaymentGateways({
      currentPage: 1,
      itemsPerPage: 25,
      order: 'asc',
      orderBy: 'clientName',
    }).then((res) => setPaymentGateways(res.items));
  }, []);

  const defaultValues = useMemo(
    () => ({
      clientName: currentUser?.clientName || '',
      businessName: currentUser?.businessName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      // paymentGateway: currentUser?.paymentGateway || ''
    }),
    [currentUser]
  );

  const password = useBoolean();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // React Query Mutation
  const createMutation = useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      toast.success('Merchant created successfully');
      queryClient.invalidateQueries(['merchants']); // Refetch the data
      reset();
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create merchant');
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
    // if (currentUser?.id) {
    //   updateMutation.mutate({ id: currentUser.id, body: { ...data } });
    // } else {
    //   createMutation.mutate(data);
    // }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentUser ? 'Update customer' : 'Add customer'}</DialogTitle>

        <DialogContent sx={{ pt: 2 }} dividers>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="clientName" label="Client name" />
            <Field.Text name="businessName" label="Business name" />
            <Field.Phone name="phone" label="Phone number" />
            <Field.Text name="email" type="email" label="Email address" />
            <Field.Text
              name="password"
              label="New password"
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                <Stack component="span" direction="row" alignItems="center">
                  <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be
                  minimum 6+
                </Stack>
              }
            />
            <Field.Text
              name="confirmNewPassword"
              type={password.value ? 'text' : 'password'}
              label="Confirm new password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* <Field.Select
              multiple
              name="paymentGateway"
              label="Payment gateway"
            >
              {paymentGateways.map((pg) => (
                <MenuItem key={pg.id} value={pg.id}>
                  <Checkbox
                    disableRipple
                    size="small"
                    // checked={.includes(pg)}
                  />
                  {pg.name}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
