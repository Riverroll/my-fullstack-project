import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import Notification from './Notification';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

const LoginForm: React.FC = () => {
  const initialValues: LoginFormValues = { email: '', password: '' };
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState<'error' | 'success' >('success');

  const handleLogin = (values: LoginFormValues) => {
    axios.post('http://localhost:5001/login', values)
      .then(response => {
        setNotificationMessage('Login successful!');
        setNotificationSeverity('success');
        setNotificationOpen(true);
      })
      .catch(error => {
        setNotificationMessage('Login failed!');
        setNotificationSeverity('error')
        setNotificationOpen(true);
        console.error('Error:', error.response?.data || error.message);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        component="div"
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          User Login
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            handleLogin(values);
            actions.setSubmitting(false);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Box>
              <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Notification
          message={notificationMessage}
          severity={notificationSeverity}
          open={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        />
      </Box>
    </Container>
  );
};

export default LoginForm;
