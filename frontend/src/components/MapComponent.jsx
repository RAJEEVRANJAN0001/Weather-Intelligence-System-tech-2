import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ location, pointsOfInterest = [] }) => {
  if (!location) return null;

  const { lat, lon, city, country } = location;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-light">Location Map</h2>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ height: '400px' }}>
        <MapContainer
          center={[lat, lon]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Main location marker */}
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-center">
                <strong>{city}</strong>
                <br />
                {country}
              </div>
            </Popup>
          </Marker>

          {/* Points of Interest */}
          {pointsOfInterest.slice(0, 10).map((poi, index) => (
            poi.lat && poi.lon && (
              <Marker key={index} position={[poi.lat, poi.lon]}>
                <Popup>
                  <div>
                    <strong>{poi.name}</strong>
                    <br />
                    <span className="text-xs text-gray-600">{poi.kind}</span>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {pointsOfInterest.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm text-white/60 uppercase tracking-wide mb-2">
            Points of Interest Nearby
          </h3>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {pointsOfInterest.slice(0, 6).map((poi, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-2 text-xs hover:bg-white/10 transition-all">
                <div className="font-medium truncate">{poi.name}</div>
                <div className="text-white/50">{poi.kind}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
