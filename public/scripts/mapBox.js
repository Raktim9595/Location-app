mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: campground.geometry.coordinates,
    zoom: 10
});
map.on('load', () => {
    var mapCanvas = document.querySelector(".mapboxgl-canvas");
    mapCanvas.classList.add("style-map")
});

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 15 })
    .setHTML(
        `<h3>${campground.name}</h3><p>${campground.location}</p>`
    )
)
.addTo(map)
