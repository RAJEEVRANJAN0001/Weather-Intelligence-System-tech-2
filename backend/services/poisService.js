class PointsOfInterestService {
  async getPOIs(lat, lon, radius = 5000) {
    // Generate mock Points of Interest based on location
    console.log('Generating demo points of interest for location:', lat, lon);
    
    const poiTypes = [
      { name: 'City Museum', kind: 'museum', offset: { lat: 0.01, lon: 0.01 } },
      { name: 'Central Park', kind: 'park', offset: { lat: -0.01, lon: 0.02 } },
      { name: 'Historic Cathedral', kind: 'religion', offset: { lat: 0.02, lon: -0.01 } },
      { name: 'Art Gallery', kind: 'art', offset: { lat: -0.02, lon: -0.02 } },
      { name: 'Shopping District', kind: 'shopping', offset: { lat: 0.015, lon: 0.015 } },
      { name: 'Public Library', kind: 'library', offset: { lat: -0.015, lon: 0.01 } },
      { name: 'City Hall', kind: 'government', offset: { lat: 0.01, lon: -0.015 } },
      { name: 'Main Square', kind: 'square', offset: { lat: 0.005, lon: 0.005 } },
      { name: 'Theater District', kind: 'theatre', offset: { lat: -0.01, lon: -0.01 } },
      { name: 'Botanical Garden', kind: 'garden', offset: { lat: 0.025, lon: 0.02 } }
    ];

    return poiTypes.map(poi => ({
      name: poi.name,
      kind: poi.kind,
      lat: parseFloat((lat + poi.offset.lat).toFixed(6)),
      lon: parseFloat((lon + poi.offset.lon).toFixed(6))
    }));
  }
}

module.exports = new PointsOfInterestService();
