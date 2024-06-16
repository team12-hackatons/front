import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { IconShip } from '../img/IconShip';
import L from 'leaflet';
import './MapView.css';

const pointIcon = new L.Icon({
  iconUrl: require('../img/point.png'), // replace with your start point image
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



const MapView = React.forwardRef(({ objects }, mapRef) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {objects && 
        <React.Fragment key={objects.id}>
            {objects.currentPoint && 
             <Marker position={objects.currentPoint} icon={IconShip}>
                <Popup>{objects.name}</Popup>
            </Marker>}
          <Marker position={objects.startPoint} icon={pointIcon}>
            <Popup>Start Point</Popup>
          </Marker>
          <Marker position={objects.endPoint} icon={pointIcon}>
            <Popup>End Point</Popup>
          </Marker>
          {objects.path &&
                <>
                {console.log(objects.path)}
                <Polyline positions={objects.path.map(point => [point.lat, point.lon])} color="blue" />
                </>}
          </React.Fragment>
      }
    </MapContainer>
  );
});

export default MapView;
