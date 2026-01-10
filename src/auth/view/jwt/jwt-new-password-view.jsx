import { useState } from 'react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPassword } from 'src/auth/context/jwt';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { Iconify } from 'src/components/iconify';
import InputAdornment from '@mui/material/InputAdornment';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import IconButton from '@mui/material/IconButton';

import { Form, Field } from 'src/components/hook-form';
import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

const NewPasswordSchema = zod
  .object({
    newPassword: zod.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function JwtNewPasswordView() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const showNew = useBoolean();
  const showConfirm = useBoolean();

  // Pre-fill token from query param ?token=xxx
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const tokenFromLink = urlSearchParams.get('token') || '';
  const searchParams = useSearchParams();
  const tokenFromLink = searchParams.get('token');

  const methods = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await newPassword({
        token: tokenFromLink,
        newPass: data.newPassword,
        confirmPass: data.confirmPassword,
      });

      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';

      setErrorMsg(message);
    }
  });

  return (
    <>
      <FormHead
        title="Change your password"
        description="Enter your details to change your password."
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box gap={3} display="flex" flexDirection="column">

          <Field.Text
            name="newPassword"
            label="New Password"
            type={showNew.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showNew.onToggle}>
                    <Iconify icon={showNew.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Field.Text
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirm.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showConfirm.onToggle}>
                    <Iconify icon={showConfirm.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton 
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Changing..."
          >
            Change Password
          </LoadingButton >
        </Box>
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
