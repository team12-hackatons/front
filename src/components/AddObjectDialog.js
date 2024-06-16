import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddObjectModal = ({ open, handleClose, onAdd }) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [currentPoint, setCurrentPoint] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [speed, setSpeed] = useState('');
  const [iceClass, setIceClass] = useState('');

  const handleSubmit = async () => {
    const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
    const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));
    const readyDate = new Date().toISOString();

    const payload = {
      start: startCoords,
      end: endCoords,
      ship_name: name,
      ice_class: iceClass,
      speed: parseFloat(speed),
      ready_date: readyDate,
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/addShip', payload);
      const path = response.data.map(point => ({
        lat: point.lat,
        lon: point.lon,
        current_time: point.current_time,
      }));

      const newObject = {
        id: Date.now(),
        name,
        startTime: new Date(startTime),
        endTime: null,
        currentPoint: null,
        startPoint: startCoords,
        endPoint: endCoords,
        path: path
      };

      onAdd(newObject);
      handleClose();
    } catch (error) {
      console.error('Error adding ship:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Ship
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Ship Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ice Class"
              fullWidth
              value={iceClass}
              onChange={(e) => setIceClass(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Speed"
              fullWidth
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid> */}
          {/* <Grid item xs={12}>
            <TextField
              label="Current Point (lat, lon)"
              fullWidth
              value={currentPoint}
              onChange={(e) => setCurrentPoint(e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              label="Start Point (lat, lon)"
              fullWidth
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="End Point (lat, lon)"
              fullWidth
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add Ship
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddObjectModal;
