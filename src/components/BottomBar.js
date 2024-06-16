import React from 'react';
import { BottomNavigation, BottomNavigationAction, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BottomBar = ({ date, onDateChange }) => {
  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction label="Back" icon={<ArrowBackIcon />} onClick={() => onDateChange('back')} />
      <Typography variant="h6" sx={{ alignSelf: 'center', mx: 2 }}>
        {date.toDateString()}
      </Typography>
      <BottomNavigationAction label="Forward" icon={<ArrowForwardIcon />} onClick={() => onDateChange('forward')} />
    </BottomNavigation>
  );
};

export default BottomBar;
