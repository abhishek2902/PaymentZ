import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';

import { forgotPassword } from 'src/auth/context/jwt';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function JwtResetPasswordView() {
  const router = useRouter();

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const createRedirectPath = (query) => {
    const queryString = new URLSearchParams({ email: query }).toString();
    return `${paths.auth.amplify.updatePassword}?${queryString}`;
  };

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     // await resetPassword({ username: data.email });

  //     const redirectPath = createRedirectPath(data.email);

  //     router.push(redirectPath);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await forgotPassword({ email: data.email });

      if (response.success === false) {
        setError("email", { message: response.message });
        return;
      }

      const redirectPath = createRedirectPath(data.email);
      // router.push(redirectPath);
      toast.success(`Mail Send successfully`);  

    } catch (error) {
      console.error("Network or Server Error:", error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        autoFocus
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sending request..."
      >
        Send request
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Forgot your password?"
        description={`Please enter the email address associated with your account and we'll email you a link to reset your password.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
