// Client ID and API key from the Developer Console
var CLIENT_ID = '707401385102-ebgj0ebkt1p1jelih8g04lenooc9l4kb.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBkOjuOvB7rSi3egT5tGQqa_BVSXZ8wE1s';
var DISCOVERY_DOCS = ['https://script.googleapis.com/$discovery/rest?version=v1'];
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

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
			gapi.client.load('https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest');
			// Listen for sign-in state changes.+
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
