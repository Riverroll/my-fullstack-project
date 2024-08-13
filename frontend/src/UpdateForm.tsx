import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Box, Typography, CircularProgress, IconButton, InputAdornment, InputLabel, FormControl, OutlinedInput, Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

interface UpdateFormValues {
  id: number;
  name: string;
  email: string;
  password?: string;
}

interface UpdateFormProps {
  userId: number;
  onClose: () => void;
  onUpdate: (updatedUser: UpdateFormValues) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long'),
});

const UpdateForm: React.FC<UpdateFormProps> = ({ userId, onClose, onUpdate }) => {
  const [initialValues, setInitialValues] = useState<UpdateFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`http://localhost:5001/users/${userId}`)
      .then(response => {
        setInitialValues({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          password: '',
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [userId]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <Paper elevation={24} sx={{ maxWidth: 400, width: '100%', m: 2 }}>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>Update User</Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            axios.put(`http://localhost:5001/users/${userId}`, values)
              .then(response => {
                onUpdate(response.data);
                actions.setSubmitting(false);
                onClose();
              })
              .catch(error => {
                console.error('Error updating user:', error);
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
                  name="id"
                  label="ID"
                  disabled
                  value={initialValues.id}
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Name"
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Password</InputLabel>
                  <Field
                    as={OutlinedInput}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    error={touched.password && !!errors.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {touched.password && errors.password && (
                    <Typography color="error" variant="caption">{errors.password}</Typography>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Paper>
  );
};

export default UpdateForm;