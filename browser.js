let isLoading = false;


window.addEventListener('load', function () {
	var iframe = document.querySelector('webview');
	iframe.getWebContents().on('before-input-event', (event, input) => {
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

	document.querySelector('#home').onclick = function () {
		navigateTo('https://opl.io/test/3d-cubes-01');
	};

	document.querySelector('#reload').onclick = function () {
		if (isLoading) {
			iframe.stop();
		} else {
			iframe.reload();
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

	iframe.addEventListener('close', handleExit);
	iframe.addEventListener('did-start-loading', handleLoadStart);
	iframe.addEventListener('did-stop-loading', handleLoadStop);
	iframe.addEventListener('did-fail-load', handleLoadAbort);
	iframe.addEventListener('did-get-redirect-request', handleLoadRedirect);
	iframe.addEventListener('did-finish-load', handleLoadCommit);
});

function navigateTo(url) {
	resetExitedState();
	const iframe = document.querySelector('webview');
	iframe.src = url;

	const contents = iframe.getWebContents();
	contents.executeJavaScript(`window.location.href = '${encodeURI(url)}'`)
}

function handleExit(event) {
	console.log(event.type);
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

function handleKeyDown(event) {
	console.log(event.code);
	if (event.code === 'F12') {
		document.body.classList.toggle('controlsActive');
	}
}

function handleLoadCommit() {
	resetExitedState();
	var iframe = document.querySelector('webview');
	document.querySelector('#location').value = iframe.getURL();
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