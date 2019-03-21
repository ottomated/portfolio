

globe = new ENCOM.Globe(window.innerWidth, window.innerHeight - (main.clientTop + main.clientHeight), {
	font: "Inconsolata",
	data: data,
	tiles: grid.tiles,
	baseColor: "#000000",
	markerColor: "#aacfd1",
	pinColor: "#aacfd1",
	satelliteColor: "#aacfd1",
	scale: 1,
	dayLength: 14000,
	introLinesDuration: 2000,
	maxPins: 500,
	maxMarkers: 4,
	viewAngle: 0.1
});
document.getElementById('details').appendChild(globe.domElement);
function animate() {
	if (globe) {
		globe.tick();
	}
	requestAnimationFrame(animate);
}
let initGlobe = () => {
	globe.init();
	animate();
	fetch('http://ip-api.com/json/?fields=lat,lon,query').then(r => r.text()).then(r => {
		let loc = JSON.parse(r);
		globe.addMarker(loc.lat, loc.lon, loc.query, true);
		fetch('http://ip-api.com/json/ottomated.net?fields=lat,lon,query').then(r => r.text()).then(r => {
			let loc = JSON.parse(r);
			globe.addMarker(loc.lat, loc.lon, loc.query, true);
		});
	});
	var constellation = [];
	var opts = {
		coreColor: "#ff0000",
		numWaves: 8
	};
	var alt = 1;

	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 3; j++) {
			constellation.push({
				lat: 50 * i - 30 + 15 * Math.random(),
				lon: 120 * j - 120 + 30 * i,
				altitude: alt
			});
		}
	}

	globe.addConstellation(constellation, opts);
}
window.addEventListener('resize', () => {
	let h = window.innerHeight - (main.clientTop + main.clientHeight);
	globe.camera.aspect = window.innerWidth / h;
	globe.camera.updateProjectionMatrix();
	globe.renderer.setSize(window.innerWidth, h);
})