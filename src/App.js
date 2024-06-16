import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import { LatLng } from 'leaflet';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import BottomBar from './components/BottomBar';
import axios from 'axios';

const App = () => {
  const [date, setDate] = useState(new Date('2020-03-03'));
  const [objects, setObjects] = useState();
  const [selectedObject, setSelectedObject] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/ships');
        const ships = Object.values(response.data).map((ship, index) => ({
          id: index,
          name: ship.movement_type,
          startTime: new Date(ship.departure_date),
          endTime: new Date(ship.arrival_date),
          currentPoint: null, // Изначально текущая точка неизвестна
          startPoint: null, // Точки старта и окончания также неизвестны в данном контексте
          endPoint: null,
          path: [] 
        }));
        setObjects(ships);
      } catch (error) {
        console.error('Error fetching ships data:', error);
      }
    };

    fetchShips(); 


  }, []); // Пустой массив зависимостей указывает, что эффект выполняется только один раз при монтировании компонента


  const handleDateChange = (direction) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction === 'forward' ? 1 : -1));
      return newDate;
    });
  };

  const handleListItemClick = async (object) => {
    
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/ship/${object.id.toString()}`);
      console.log(response.data)
      const outputArray = response.data.path.map(item => ({
        current_time: item[2], // Берем третий элемент подмассива как current_time
        lat: item[0],          // Берем первый элемент подмассива как lat
        lon: item[1]           // Берем второй элемент подмассива как lon
      }));
      const ship = {
        id: object.id.toString(),
        name: response.data.movement_type,
        startTime: new Date(response.data.departure_date),
        endTime: new Date(response.data.arrival_date),
        currentPoint: null, // Изначально текущая точка неизвестна
        startPoint: [response.data.path[0][0], response.data.path[0][1]], // Точки старта и окончания также неизвестны в данном контексте
        endPoint: [response.data.path[response.data.path.length - 1][0], response.data.path[response.data.path.length - 1][1]],
        path: outputArray
      };
      console.log(ship)
      setSelectedObject(ship);
      // setSelectedObject(response.data);
    } catch (error) {
      setSelectedObject(object);
      console.log(object)
    }
    // if (object.endTime) {
    //   const selectedTime = new Date(object.startTime);
    //   if (date < object.startTime || date > object.endTime) {
    //     setDate(selectedTime);
    //   }
    // }
    // else{
    //   const selectedTime = new Date(object.startTime);
    //   if (date < object.startTime) {
    //     setDate(selectedTime);
    //   }
    // }
    // // const currentPoint = getCurrentPoint(object.path, date);
    // // if (currentPoint) {
    // //   mapRef.current.setView(new LatLng(currentPoint[0], currentPoint[1]), 13);
    // // }
    // mapRef.current.setView(object.currentPoint ? new LatLng(object.currentPoint[0], object.currentPoint[1]) : new LatLng(object.startPoint[0], object.startPoint[1]), 11);
    
  };

  const handleDelete = (id) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedObject && selectedObject.id === id) {
      setSelectedObject(null);
    }
  };

  const handleAddNewObject = ({ name, startTime, endTime, currentPoint, startPoint, endPoint, path }) => {
    const newObject = {
      id: objects.length ? objects[objects.length - 1].id + 1 : 1,
      name,
      startTime,
      endTime,
      currentPoint,
      startPoint,
      endPoint,
      path
    };
    console.log(newObject)
    setObjects([...objects, newObject]);
  };

  useEffect(() => {
    // console.log(selectedObject)
    if (selectedObject) {
      const currentPoint = getCurrentPoint(selectedObject.path, date);
      console.log(currentPoint)
      if (currentPoint) {
        // mapRef.current.setView(new LatLng(currentPoint[0], currentPoint[1]), 13);
        setSelectedObject((prevObj) => ({
          ...prevObj,
          currentPoint,
        }));
      }
    }
  }, [date]);

  const getCurrentPoint = (path, currentDate) => {
    const currentTimestamp = currentDate.getTime() / 1000;
    console.log(path)
    if (path == null){
      return;
    }
    let lastPoint = null;
    console.log(path[0].current_time, currentTimestamp )
    for (const point of path) {
      if (point.current_time <= currentTimestamp) {
        lastPoint = [point.lat, point.lon];
      } else {
        break;
      }
    }

    if (!lastPoint && path.length > 0) {
      lastPoint = [path[0].lat, path[0].lon];
    } else if (lastPoint && currentTimestamp > path[path.length - 2].current_time) {
      lastPoint = [path[path.length - 2].lat, path[path.length - 2].lon];
    }

    return lastPoint;
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar objects={objects} onListItemClick={handleListItemClick} onDelete={handleDelete} onAdd={handleAddNewObject} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <MapView objects={selectedObject} ref={mapRef} />
        </Box>
      </Box>
      <BottomBar date={date} onDateChange={handleDateChange} />
    </Container>
  );
};

export default App;
