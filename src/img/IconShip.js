import L from 'leaflet';

const IconShip = new L.Icon({
  iconUrl: require('./ship.png'),
  iconRetinaUrl: require('./ship.png'),
  iconAnchor: [30, 75], // anchor point of the icon, adjusted to center
  popupAnchor: [0, -75], // point from which the popup should open relative to the iconAnchor
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 75),
  className: 'leaflet-ship-icon' // class name for additional styling
});

export { IconShip };
