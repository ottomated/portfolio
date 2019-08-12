let going = false;
let currentEl = null;
const lang_buttons = document.querySelectorAll('.lang-button');
const lineDownSvg = document.querySelector('#linedown');
const lineDown = lineDownSvg.firstElementChild;
const left = document.querySelector('#rectleft');
const right = document.querySelector('#rectright');
const details = document.querySelector('#details');
const langHint = document.querySelector('#langhint');
const modal = document.querySelector('#modal');

if (!window.localStorage.hideClickToLang) {
	langHint.langTimeout = setTimeout(() => {
		langHint.innerText = '(click to view details)';
		langHint.style.left = '50%';
		langHint.style.opacity = '0.5';
	}, 5000);
}

for (let button of lang_buttons) {
	button.addEventListener('click', () => {
		if (going) return;
		going = true;
		clearTimeout(langHint.langTimeout);
		langHint.style.opacity = '0';
		window.localStorage.hideClickToLang = true;
		clearTimeout(langHint.exitTimeout);

		if (button.className.includes('active')) {
			button.className = 'lang-button';
			undoPath(0.5);
			setTimeout(() => {
				details.classList.remove('gone');
			}, 250);
			setTimeout(() => {
				left.style.stroke = 'transparent';
				right.style.stroke = 'transparent';
				going = false;
			}, 500);
			langHint.style.opacity = '0';
			clearTimeout(langHint.exitTimeout);
			window.localStorage.hideClickToExit = true;
			return;
		}

		// Remove underline from old lang
		if (currentEl) currentEl.className = 'lang-button';
		button.className = 'lang-button active';

		// Do line down animation
		let x = (button.offsetLeft + button.clientWidth / 2);
		lineDownSvg.style.left = x + 'px';
		lineDownSvg.style.opacity = '1';
		lineDown.style.transition = 'stroke-dashoffset 0.5s linear';
		lineDown.style.stroke = button.style.color;
		lineDown.style.strokeDashoffset = '-100px';

		// Place exit thingy
		langHint.style.left = x + 'px';


		// Do rectangle path
		currentEl = button;
		setUpPath();
		undoPath(0.25);
		setTimeout(doPath, 250, button.style.color);

		details.classList.add('gone');
		setTimeout(() => {
			// Reset lineDown
			lineDownSvg.style.opacity = '0';
			lineDown.style.transition = 'initial';
			lineDown.style.strokeDashoffset = '100px';
			let panel = document.getElementById(button.getAttribute('data-panel'));
			panel.classList.add('shown');
			going = false;

			// Animate all the children
			let divs = panel.querySelectorAll('.projects>.proj');
			let timeout = 200;
			for (let div of divs) {
				setTimeout(() => div.classList.add('loaded'), timeout);
				timeout += 100;
			}
		}, 500);

		// exit thingy timeout
		if (!window.localStorage.hideClickToExit) {
			langHint.exitTimeout = setTimeout(() => {
				langHint.innerText = '(click again to exit)';
				langHint.style.opacity = '0.5';
			}, 2500);
		}

	});
}

function setUpPath() {
	let x = (currentEl.offsetLeft + currentEl.clientWidth / 2);

	x -= 20;
	let h = window.innerHeight - left.parentElement.getBoundingClientRect().y - 20;
	let x2 = window.innerWidth - x - 40;

	// Create svg paths
	left.setAttribute('d', `M ${x + 2},0
							C 100,0 40,0 40,0
							40,0 0,0 0,40
							0,40 0,60 0,${h - 40}
							0,${h - 40} 0,${h} 40,${h}
							93.75,${h} 100,${h} ${x2},${h}`);
	right.setAttribute('d', `M -2,0
							 C -2,0 ${x2 - 40},0 ${x2 - 40},0
							 ${x2 - 40},0 ${x2},0 ${x2},40
							 ${x2},40 ${x2},60 ${x2},${h - 40}
							 ${x2},${h - 40} ${x2},${h} ${x2 - 40},${h}
							 ${x2 - x + 40},${h} ${x2 - x},${h} ${x2 - x},${h}`);
	right.style.transform = `translateX(${x + 1}px) translateY(1px)`;
	// Reset everything
	let len = left.getTotalLength();
	left.style.transition = 'initial';
	left.style.strokeDasharray = len;
	right.style.transition = 'initial';
	right.style.strokeDasharray = len;

}

function doPath(color) {
	left.style.stroke = color;
	right.style.stroke = color;

	// Do animation
	left.style.transition = 'stroke-dashoffset .75s ease-in-out';
	right.style.transition = 'stroke-dashoffset .75s ease-in-out';
	left.style.strokeDashoffset = '0';
	right.style.strokeDashoffset = '0';
}

function undoPath(seconds) {
	let len = left.getTotalLength();
	left.style.transition = `stroke-dashoffset ${seconds}s ease-in-out`;
	right.style.transition = `stroke-dashoffset ${seconds}s ease-in-out`;
	left.style.strokeDashoffset = len;
	right.style.strokeDashoffset = len;

	// Hide current panel
	let shownPanel = document.querySelector('.lang-panel.shown');
	if (shownPanel) {
		shownPanel.classList.remove('shown');
		shownPanel.querySelectorAll('.projects>.proj').forEach(c => c.className = 'proj');
	}
}

let projs = document.querySelectorAll('.proj');

for (let p of projs) {
	p.addEventListener('click', () => {
		let data = ProjectData[p.getAttribute('data-proj')];
		let color = p.parentElement.getAttribute('data-cat');
		modal.children[0].innerHTML = data.title;
		modal.children[1].innerHTML = data.description;
		if (data.github) {
			modal.children[2].style.display = 'block';
			modal.children[2].firstElementChild.href = data.github;
		} else {
			modal.children[2].style.display = 'hidden';
		}
		modal.classList = 'shown';
		modal.classList.add(color);
		modal.openingElement = p;
		var pattern = Trianglify({
			width: modal.clientWidth,
			height: modal.clientHeight,
			x_colors: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#333333', '#1a1a1a', '#000000']
		});
		modal.style.background = 'url(' + pattern.png() + ')';
	});
}

modal.querySelector('.close').addEventListener('click', () => {
	modal.classList.remove('shown');
})


const projectDivs = document.querySelectorAll('.projects');

function updateProjectDivHeights() {
	for (let div of projectDivs) {
		div.style.height = window.innerHeight - div.getBoundingClientRect().y - 30 + 'px';
	}
	for (let bar of scrollbars) {
		bar.update();
	}
}
let scrollbars = Array.from(document.querySelectorAll('.projects')).map(bar => new PerfectScrollbar(bar));
window.addEventListener('resize', () => {
	if (currentEl)
		setUpPath();
	updateProjectDivHeights();
});
updateProjectDivHeights();

