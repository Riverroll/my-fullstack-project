import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

interface MyFormValues {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nama wajib diisi'),
  email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
  password: Yup.string().min(6, 'Password harus minimal 6 karakter').required('Password wajib diisi'),
});

const MyForm: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const initialValues: MyFormValues = { name: '', email: '', password: '' };

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
          position: 'relative', // Adjusts the position
          top: '10%', // Moves the form down, adjust as needed
          transform: 'translateY(-10%)', // Optionally fine-tunes positioning
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          User Registration
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            axios.post('http://localhost:5001/submit', values)
              .then(response => {
                console.log(response.data); // Handle successful response
                setSnackbarMessage('Registration successful!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                actions.setSubmitting(false);
                actions.resetForm(); // Optionally reset form on success
              })
              .catch(error => {
                const errorMessage = error.response?.data?.error || 'An error occurred';
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                console.error('Error:', errorMessage); // Handle error response
                actions.setSubmitting(false);
              });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Nama"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Box>
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
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={<Button color="inherit" onClick={handleCloseSnackbar}>Close</Button>}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyForm;
