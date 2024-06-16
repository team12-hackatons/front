import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box, Toolbar, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AddObjectModal from './AddObjectDialog';

const drawerWidth = 240;

const Sidebar = ({ objects = [], onListItemClick, onDelete, onAdd }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px', // Adjust the margin to match the header height
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', padding: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleOpen}
        >
          Add Object
        </Button>
        <List>
          {objects.map((obj) => (
            <ListItem button key={obj.id} onClick={() => onListItemClick(obj)}>
              <ListItemText primary={obj.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(obj.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
      <AddObjectModal open={open} handleClose={handleClose} onAdd={onAdd} />
    </Drawer>
  );
};

export default Sidebar;
