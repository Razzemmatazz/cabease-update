var scriptId = '1C_BiKPvlMv0IhMxmedlE4GWHz_lLFGWX6MLafwx9KlOwbK87h4koXYQp';

$(document).ready(function() {
	var email = sessionStorage.getItem('email');
	if (email) {
		parent.window.location.href = './main.html';
	}
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.getElementsByClassName('needs-validation');
	// Loop over them and prevent submission
	var validation = Array.prototype.filter.call(forms, function(form) {
		form.addEventListener(
			'submit',
			function(event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					event.preventDefault();
					event.stopPropagation();
					if ($('#confirmPassword').length > 0) {
						addNewUser();
					} else {
						validateLogin();
					}
				}
				form.classList.add('was-validated');
			},
			false
		);
	});
});

function validateLogin() {
	var email = $('#email').val();
	var password = $('#password').val();
	gapi.client.script.scripts
		.run({
			scriptId: scriptId,
			resource: {
				function: 'validateLogin',
				parameters: [email, password]
			}
		})
		.then(function(response) {
			var responseObj = response.result.response.result;
			if (responseObj.status) {
				sessionStorage.setItem('clocked', 'false');
				sessionStorage.setItem('email', responseObj.user.email);
				sessionStorage.setItem('id', responseObj.user.id);
				parent.window.location.href = './main.html';
			} else {
				$('#warning').html('Invalid Email or Password');
			}
		});
}

function verifyEmail(element) {
	var email = $(element).val();
	gapi.client.script.scripts
		.run({
			scriptId: scriptId,
			resource: {
				function: 'verifyEmail',
				parameters: [email],
				devMode: true
			}
		})
		.then(function(resp) {
			var status = resp.result.response.result.userStatus;
			var warning = $('#warning');
			switch (status) {
				case 'invalid':
					warning.html('Not a Cab-Ease email address');
					$('#password').prop('disabled', true);
					if ($('#confirmPassword').length > 0) {
						$('#confirmPassword')
							.parent()
							.remove();
					}
					break;
				case 'new':
					warning
						.html('This account does not yet have a password. Please create one now.')
						.addClass('text-success');
					$('#password').prop('disabled', false);
					if ($('#confirmPassword').length === 0) {
						createPasswordConfirmation();
					}
					break;
				default:
					warning.html('');
					$('#password').prop('disabled', false);
					if ($('#confirmPassword').length > 0) {
						$('#confirmPassword')
							.parent()
							.remove();
					}
					break;
			}
		});
}

function addNewUser() {
	var email = $('#email').val();
	var password = $('#password').val();
	gapi.client.script.scripts
		.run({
			scriptId: scriptId,
			resource: {
				function: 'addNewUser',
				parameters: [email, password]
			}
		})
		.then(function(response) {
			var responseObj = response.result.response.result;
			if (responseObj.status) {
				sessionStorage.setItem('clocked', 'false');
				sessionStorage.setItem('email', email);
				parent.window.location.href = 'http://localhost:1021/main.html';
			} else {
				$('#warning').html(responseObj.message);
			}
		});
}

function createPasswordConfirmation() {
	var newDiv = $(document.createElement('div')).addClass('form-group');
	var label = $(document.createElement('label'))
		.attr({ for: 'confirmPassword' })
		.html('Confirm Password');
	var input = $(document.createElement('input'))
		.attr({ type: 'password', id: 'confirmPassword', onfocusout: 'verifyPasswordMatch()' })
		.addClass('form-control');
	newDiv.append(label, input);
	$('#warning')
		.parent()
		.before(newDiv);
	$('#logPageSubmit').html('Create Account');
}

function verifyPasswordMatch() {
	var pass1 = $('#password').val();
	var pass2 = $('#confirmPassword').val();
	if (pass1 === pass2) {
		$('#logPageSubmit').prop('disabled', false);
		$('#warning').html('');
	} else {
		$('#logPageSubmit').prop('disabled', true);
		$('#warning').html('Passwords do not match');
	}
}
