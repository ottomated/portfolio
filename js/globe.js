globe = new ENCOM.Globe(window.innerWidth, window.innerHeight - (main.clientTop + main.clientHeight), {
    font: "Inconsolata",
    data: [],
    tiles: grid.tiles,
    baseColor: "#000000",
    markerColor: "#8e44ad",
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
    fetch('https://ip-api.io/json').then(r => r.text()).then(r => {
        let loc = JSON.parse(r);
        globe.addMarker(loc.latitude, loc.longitude, loc.ip);
        fetch('https://ip-api.io/json/209.182.233.230').then(r => r.text()).then(r => {
            let loc2 = JSON.parse(r);
            globe.addMarker(loc2.latitude, loc2.longitude, loc2.ip, Math.abs(loc.lon - loc2.lon) > 25);
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
