
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard", // Use the standard style for the map
  projection: "globe", // display the map as a globe
  zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
  center: targetCampground.geometry.coordinates, // center the map on this longitude and latitude
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
  .setLngLat(targetCampground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup( {offset: 25})
    .setHTML(`<h4>${targetCampground.title}</h4>`)
  )
  .addTo(map);

