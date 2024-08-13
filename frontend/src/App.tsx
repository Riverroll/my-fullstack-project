import React, { useState } from 'react';
import { Box, Modal, Backdrop, Tabs, Tab, Paper } from '@mui/material';
import MyForm from './MyForm';
import UserList from './UserList';
import UpdateForm from './UpdateForm';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [updateUser, setUpdateUser] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);

  const handleUpdateUser = (userId: number) => {
    setSelectedUserId(userId);
    setUpdateUser(true);
  };

  const handleCloseUpdateForm = () => {
    setUpdateUser(false);
    setSelectedUserId(null);
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUpdateUser(false);
    setSelectedUserId(null);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left side: Form */}
      <Box sx={{ 
        width: '30%', 
        minWidth: '300px', 
        p: 2, 
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Register" />
          <Tab label="Login" />
        </Tabs>
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '400px' }}>
            {tabValue === 0 ? <MyForm /> : <LoginForm />}
          </Paper>
        </Box>
      </Box>

      {/* Right side: Table */}
      <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
        <UserList onUpdateUser={handleUpdateUser} />
      </Box>

      {/* Update Modal */}
      <Modal
        open={updateUser}
        onClose={handleCloseUpdateForm}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          width: '90%',
        }}>
          {selectedUserId !== null && (
            <UpdateForm
              userId={selectedUserId}
              onClose={handleCloseUpdateForm}
              onUpdate={handleUserUpdate}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default App;