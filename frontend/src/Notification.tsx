import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, open, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
