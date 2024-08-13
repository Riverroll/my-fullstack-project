import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  IconButton, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  onUpdateUser: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ onUpdateUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:5001/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching users');
        setLoading(false);
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:5001/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        setError('Error deleting user');
        console.error('Error deleting user:', error);
      });
  };

  const handleUpdate = (user: User) => {
    onUpdateUser(user.id);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton color="primary" onClick={() => handleUpdate(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
