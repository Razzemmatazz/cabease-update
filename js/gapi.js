// Client ID and API key from the Developer Console
var CLIENT_ID = '180966977438-fqqes4kqp6dpr502v0btgnvt00f62u97.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBfNFyUUHzR9M1Q-L29Z3BGLG2s8uly8hY';
var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
var SCOPES =
	'https://www.googleapis.com/auth/script.external_request https://www.googleapis.com/auth/script.send_mail https://www.googleapis.com/auth/spreadsheets';

// var authorizeButton = document.getElementById('authorize-button');
// var signoutButton = document.getElementById('signout-button');
function handleClientLoad() {
	gapi.load('client', initClient);
}
function initClient() {
	gapi.client
		.init({
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
		})
		.then(function() {
			console.log('Google API signed-in status: ' + gapi.auth2.getAuthInstance().isSignedIn.get());
			if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
				$('.gapi-verification').removeClass('d-none');
			}
			gapi.client.load('https://script.googleapis.com/$discovery/rest?version=v1');

			// Listen for sign-in state changes.
		});
}

function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
	$('.gapi-verification').addClass('d-none');
}
function handleSignoutClick(event) {
	console.log('signout');
	gapi.auth2.getAuthInstance().signOut();
}
