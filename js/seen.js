const seenEl = document.querySelector('#lastseen');

function updateSeen() {
    fetch('seen.json').then(r => r.text()).then(r => {
        let json = JSON.parse(r);
        if (json.project)
            seenEl.innerHTML = 'I was last seen working on <span style="color:#949494;">' + json.project + '</span>.';
    }).catch(console.log);
}

setInterval(updateSeen, 60 * 1000);
updateSeen();