import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { createPaymentGateway, updatePaymentGateway } from 'src/api/payment-gateway';
import { listGenericLookups } from 'src/api/genericLookup';
// import { useGenericLookup } from 'src/utils/genericLookup';

// ----------------------------------------------------------------------

const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  status: zod.enum(['ACTIVE', 'ARCHIVE']).default('ACTIVE'),
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

export function PaymentGatewayModal({ currentUser, open, onClose }) {
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      description: currentUser?.description || '',
      status: currentUser?.status || 'ACTIVE', // Default status to "Active"
    }),
    [currentUser]
  );

  // Fetch payment gateway status
  const {
    data: paymentGatewayStatus = [],
    isLoading,
    error: paymentGatewayError,
  } = useQuery({
    queryKey: ['genericLookup'],
    queryFn: () =>
      listGenericLookups({
        lookupType: 'PAYMENTGATEWAY',
      }).then((res) => res),
    staleTime: 300000, // 5 minutes cache
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    enabled: open, // Fetch only when modal is open
  });

  const queryClient = useQueryClient();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // React Query Mutation
  const createMutation = useMutation({
    mutationFn: createPaymentGateway,
    onSuccess: () => {
      toast.success('Payment gateway created successfully');
      queryClient.invalidateQueries(['paymentGateways']); // Refetch the data
      reset();
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create payment gateway');
    },
  });

  // update payment gateway
  const updateMutation = useMutation({
    mutationFn: updatePaymentGateway,
    onSuccess: () => {
      toast.success('Payment gateway updated successfully!');
      queryClient.invalidateQueries(['paymentGateways']); // Refetch the data
      reset();
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update payment gateway');
    },
  });

  const onSubmit = handleSubmit((data) => {
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
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentUser ? 'Update Payment Gateway' : 'Add Payment Gateway'}</DialogTitle>

        <DialogContent sx={{ pt: 2 }} dividers>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="name" label="Full name" />
            <Field.Text name="description" label="Description" />
            <Field.Select name="status" label="Status">
              {paymentGatewayStatus.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.description}
                </MenuItem>
              ))}
            </Field.Select>
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
