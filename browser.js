
const initWebviewParams = () => {
	webview.setAttribute('autoresize', 'true');
}

const homeURL = 'https://opl.io/random';

let isLoading = false;
let webview = document.createElement('webview');

window.addEventListener('load', function () {
	document.body.appendChild(webview);
	navigateTo(homeURL);

	document.querySelector('#home').onclick = function () {
		navigateTo(homeURL);
	};

	document.querySelector('#reload').onclick = function () {
		if (isLoading) {
			webview.stop();
		} else {
			webview.reload();
		}
	};
	document.querySelector('#reload').addEventListener(
		'webkitAnimationIteration',
		function () {
			if (!isLoading) {
				document.body.classList.remove('loading');
			}
		});

	document.querySelector('#location-form').onsubmit = function (e) {
		e.preventDefault();
		navigateTo(document.querySelector('#location').value);
	};
});

const urlBarUpdate = () => {
	document.querySelector('#location').value = webview.getURL();
}

function navigateTo(url) {
	resetExitedState();
	//webview.src = url;
	webview.parentElement.removeChild(webview);

	webview = document.createElement('webview');
	initWebviewParams();

	webview.addEventListener('will-navigate', urlBarUpdate);
	webview.addEventListener('did-navigate', urlBarUpdate);
	webview.addEventListener('did-navigate-in-page', urlBarUpdate);
	
	webview.addEventListener('dom-ready', (e)=>{
		//Handle muted audio
		webview.setAudioMuted(isMuted);

		//Reset and set zoom levels
		webview.setZoomLevel(1);
		webview.setVisualZoomLevelLimits(1,1);
		webview.setLayoutZoomLevelLimits(0,0);

		const contents = webview.getWebContents();

		webview.getWebContents().on('before-input-event', (event, input) => {
			if (input.type !== 'keyDown') {
				return;
			}
		
			// Create a fake KeyboardEvent from the data provided
			const emulatedKeyboardEvent = new KeyboardEvent('keydown', {
				code: input.code,
				key: input.key,
				shiftKey: input.shift,
				altKey: input.alt,
				ctrlKey: input.control,
				metaKey: input.meta,
				repeat: input.isAutoRepeat
			});
		
			// do something with the event as before
			handleKeyDown(emulatedKeyboardEvent);
		});
	})
	

	webview.addEventListener('close', handleExit);
	webview.addEventListener('did-start-loading', handleLoadStart);
	webview.addEventListener('did-stop-loading', handleLoadStop);
	webview.addEventListener('did-fail-load', handleLoadAbort);
	webview.addEventListener('did-get-redirect-request', handleLoadRedirect);
	webview.addEventListener('did-finish-load', handleLoadCommit);

	webview.addEventListener('enter-html-full-screen', webviewFullscreen);
	webview.addEventListener('leave-html-full-screen', webviewExitFullscreen);

	if (url.match(/:\/\//) !== null) {
		webview.setAttribute('src', url);
	} else {
		webview.setAttribute('src', 'http://'+ url);
	}
	
	document.body.appendChild(webview);
}

function handleExit(event) {
	document.body.classList.add('exited');
	if (event.type == 'abnormal') {
		document.body.classList.add('crashed');
	} else if (event.type == 'killed') {
		document.body.classList.add('killed');
	}
}

function resetExitedState() {
	document.body.classList.remove('exited');
	document.body.classList.remove('crashed');
	document.body.classList.remove('killed');
}

let debounceTimestamp = 0;
let keyPressDebounce = false;

function handleKeyDown(event) {

	if (event.code === 'F12') {
		if (keyPressDebounce) return;
		
		keyPressDebounce = true;
		window.requestAnimationFrame(()=>{
			keyPressDebounce = false;
		})

		document.body.classList.toggle('controlsActive');
	}
}

function handleLoadCommit() {
	resetExitedState();
	var webview = document.querySelector('webview');
	document.querySelector('#location').value = webview.getURL();
}

function handleLoadStart(event) {
	document.body.classList.add('loading');
	isLoading = true;

	resetExitedState();
	if (!event.isTopLevel) {
		return;
	}

	document.querySelector('#location').value = event.url;
}

function handleLoadStop(event) {
	// We don't remove the loading class immediately, instead we let the animation
	// finish, so that the spinner doesn't jerkily reset back to the 0 position.
	isLoading = false;
}

function handleLoadAbort(event) {
	console.log('LoadAbort');
	console.log('  url: ' + event.url);
	console.log('  isTopLevel: ' + event.isTopLevel);
	console.log('  type: ' + event.type);
}

function handleLoadRedirect(event) {
	resetExitedState();
	document.querySelector('#location').value = event.newUrl;
}

let isMuted = false;
const toggleMute = () => {
	isMuted = !isMuted;
	webview.setAudioMuted(isMuted);
}


const timeElement = document.getElementById('time');
const timeTick = ()=>{
	window.requestAnimationFrame(timeTick);

	const date = new Date();
	let hour = date.getHours();
	if (hour > 12) hour -= 12;

	let minutes = String(date.getMinutes());
	if (minutes.length === 1) minutes = '0'+minutes;

	let seconds = String(date.getSeconds());
	if (seconds.length === 1) seconds = '0'+seconds;

	timeElement.textContent = `
		${hour}:${minutes}:${seconds}
	`;
};
window.requestAnimationFrame(timeTick);

let isWebviewFullscreen = false;
const webviewFullscreen = () => {
	isWebviewFullscreen = true;
};
const webviewExitFullscreen = () => {
	isWebviewFullscreen = false;
};


let fullscreenDebounce = false;
const toggleFullscreen = (e)=>{
	if (fullscreenDebounce) return;
	
	fullscreenDebounce = true;
	window.setTimeout(()=>{
		fullscreenDebounce = false;
	}, 500)

	if(e && e.preventDefault)
		e.preventDefault();

	if (!document.fullscreenElement && !isWebviewFullscreen)
		document.body.requestFullscreen();
	else {
		if (isWebviewFullscreen) {
			isWebviewFullscreen = false;
			webview.getWebContents().executeJavaScript(`document.exitFullscreen()`);
		}
		document.exitFullscreen();
	}
};

const fullScreenIcon = document.getElementById('fullscreenIcon');
fullScreenIcon.addEventListener('click', toggleFullscreen);