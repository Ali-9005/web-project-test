import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([47.9774, 29.3759]),
    zoom: 10
  })
});

const modal = document.createElement('div');
modal.id = 'modal';
modal.style.display = 'none';
modal.innerHTML = `
  <div id="modal-content">
    <p>Do you accept the marker information?</p>
    <button id="accept-btn">Accept</button>
  </div>
`;
document.body.appendChild(modal);

// Style the modal with CSS
const style = document.createElement('style');
style.innerHTML = `
  #modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  #modal-content button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

function addPin(coords) {
  const pinFeature = new Feature({
    geometry: new Point(fromLonLat(coords)),
    name: 'My Location' 
  });
  pinFeature.setStyle(new Style({
    image: new Icon({
      anchor: [0.5, 1], 
      src: 'https://openlayers.org/en/latest/examples/data/icon.png' 
    })
  }));

  const vectorSource = new VectorSource({
    features: [pinFeature]
  });
  const vectorLayer = new VectorLayer({
    source: vectorSource
  });

  map.addLayer(vectorLayer);

  map.on('click', function (event) {
    map.forEachFeatureAtPixel(event.pixel, function (feature) {
      if (feature === pinFeature) {
        modal.style.display = 'flex';
      }
    });
  });
}

navigator.geolocation.getCurrentPosition(function(pos) {
  const userCoords = [pos.coords.longitude, pos.coords.latitude];
  console.log(userCoords);
  addPin(userCoords); 
}, function(error) {
  console.error('Geolocation error:', error);
  addPin([47.9774, 29.3759]); 
});

document.getElementById('accept-btn').addEventListener('click', function() {
  modal.style.display = 'none'; 
});
