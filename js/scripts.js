var scriptId = '1C_BiKPvlMv0IhMxmedlE4GWHz_lLFGWX6MLafwx9KlOwbK87h4koXYQp';
$(document).ready(function() {
	console.log([sessionStorage.getItem('id'), sessionStorage.getItem('email')]);
	var email = sessionStorage.getItem('email');
	if (email) {
		$('main').removeClass('d-none');
	} else {
		var loginUrl = './index.html';
		var note = $(document.createElement('h1'))
			.html(
				'You are not an authorized user for Cab-Ease. Please return to the <a href="' +
					loginUrl +
					'">login page</a> and log in from there.'
			)
			.css('margin-top', '12vh');
		$('body').append(note);
	}
	var clockStatus = sessionStorage.getItem('clocked');
	createMenu(clockStatus);
	if (clockStatus == 'true') {
		$('#newFare')
			.parent()
			.click();
	} else {
		$('#logon')
			.parent()
			.click();
	}
	screenSize();
});

function createMenu(status) {
	var menu = {
		true: [
			{
				id: 'menu',
				text: '&#9776;',
				class: 'btn btn-warning'
			},
			{
				id: 'newFare',
				text: 'Add Fare',
				class: 'btn btn-light'
			},
			{
				id: 'newExpense',
				text: 'Add Expense/Gas',
				class: 'btn btn-dark'
			},
			{
				id: 'changeFare',
				text: 'Edit Fare',
				class: 'btn btn-light'
			},
			{
				id: 'logon',
				text: 'Log Off',
				class: 'btn btn-dark'
			}
		],
		false: [
			{
				id: 'menu',
				text: '&#9776;',
				class: 'btn btn-warning'
			},
			{
				id: 'logon',
				text: 'Log On',
				class: 'btn btn-light'
			}
		]
	};
	$('#menuButtons').html('');
	menu[status].forEach(function(item) {
		var label = $(document.createElement('label'))
			.attr({ for: item.id })
			.addClass(item.class)
			.html(item.text);
		var button = $(document.createElement('input')).attr({ type: 'radio', autocomplete: 'off', id: item.id });
		label.append(button);
		$('#menuButtons').append(label);
	});
}

function openTab(element) {
	setTimeout(function() {
		var name = $(element)
			.children('.active')
			.text();
		console.log('Open Tab ' + name);
		if (name == '☰') {
			toggleMenu($('#menuButtons').val());
		} else if (name == 'Edit Fare') {
			$('#currentForm').html('');
			$('#editTable').html('<div class="loader"></div>');
			gapi.client.script.scripts
				.run({
					scriptId: scriptId,
					resource: {
						function: 'getPastFares',
						parameters: [sessionStorage.getItem('id')]
					}
				})
				.then(function(response) {
					if (response.status === 200) {
						editFare(response.result.response.result);
					} else {
						noFare();
					}
				});
			toggleMenu('true');
		} else if (name == 'Log On' || name == 'Log Off') {
			$('#editTable').html('');
			var logStatus = $('#logon')
				.parent()
				.text();
			logStatus == 'Log On' ? addForm('logOn') : addForm('logOff');
			toggleMenu('true');
		} else {
			$('#editTable').html('');
			addForm(name);
			toggleMenu('true');
		}
	}, 200);
}

function addForm(formName) {
	var formData = forms[formName];
	var form = $(document.createElement('form'))
		.addClass('needs-validation')
		.attr({ id: formName, novalidate: 'novalidate', action: 'javascript:' + formData.submit.onclick });
	$(form).submit(function(event) {
		if (!$(form)[0].checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
			console.log('invalid');
		} else {
			$(form)
				.children('.submit-button')
				.prop('disabled', true);
			$(form).addClass('was-validated');
			return;
		}
	});
	formData.questions.forEach(function(question) {
		var formGroup = $(document.createElement('div')).addClass('form-group');
		var label = $(document.createElement('label'))
			.html(question.label)
			.attr({ for: question.name });
		var elementType;
		switch (question.type) {
			case 'input':
				elementType = {
					element: 'input',
					type: question.subtype,
					placeholder: question.placeholder ? question.placeholder : null,
					id: question.name,
					onfocusout: question.focusout ? question.focusout : null
				};
				if (question.step) {
					elementType.step = question.step;
				}
				break;
			case 'button':
				elementType = {
					element: 'button',
					type: question.subtype,
					id: question.name,
					onclick: question.click ? question.click : null
				};
				break;
			case 'btn-group':
				elementType = {
					element: 'div',
					class:
						question.subtype !== ''
							? question.type +
							  ' ' +
							  question.type +
							  '-lg ' +
							  question.type +
							  '-' +
							  question.subtype +
							  ' btn-group-toggle'
							: question.type + ' ' + question.type + '-lg' + ' btn-group-toggle',
					options: question.options,
					id: question.name,
					onclick: question.click ? question.click : ''
				};
				break;
		}
		var input = $(document.createElement(elementType.element));
		if (elementType.element === 'div') {
			input.attr({ 'data-toggle': 'buttons' });
		} else if (elementType.element === 'input') {
			input.prop('required', true);
		}
		Object.keys(elementType).forEach(function(key) {
			if (elementType[key] && elementType[key] !== '') {
				var obj = {};
				obj[key] = elementType[key];
			}
			if (key == 'options' && elementType[key].length > 0) {
				elementType[key].forEach(function(name) {
					var label = $(document.createElement('label')).addClass('btn btn-secondary');
					var button = $(document.createElement('input')).attr({
						type: 'radio',
						autocomplete: 'off',
						id: elementType.id + '-' + name
					});
					label.html(name).append(button);
					input.append(label);
				});
			} else if (key !== 'options' && key !== 'element' && obj) {
				input.attr(obj);
			}
		});
		formGroup.append(label, input);
		form.append(formGroup);
	});
	var submit = $(document.createElement('button'))
		.html(formData.submit.html)
		.addClass('btn-lg btn-info submit-button');
	Object.keys(formData.submit).forEach(function(key) {
		if (key !== 'html' && key !== 'onclick') {
			var obj = {};
			obj[key] = formData.submit[key];
			submit.attr(obj);
		}
	});
	form.append(submit);

	$('#currentForm')
		.html(form)
		.css({ display: 'block', width: '100%', height: '100%' });
}

function submit(formName) {
	var obj = {
		userId: sessionStorage.getItem('id'),
		menuType: '',
		tip: '',
		confirmationNum: '',
		fareAmt: '',
		fareType: '',
		expAmt: '',
		expType: '',
		description: '',
		log: '',
		mileage: ''
	};
	var date = new Date();
	var form = $('#currentForm').children();
	var inputs = $(form)
		.children('.form-group')
		.children('input');
	console.log(inputs);
	var selectedButtons = $(form)
		.children('.form-group')
		.children('.btn-group-toggle')
		.children('.active');

	switch (formName) {
		case 'addFareForm':
			obj.menuType = 'Add Fare';
			obj.confirmationNum = $(inputs[0]).val();
			obj.fareAmt = $(inputs[1]).val();

			obj.fareType = $(selectedButtons[0]).text();
			if (obj.fareType == 'Credit Card') {
				obj.tip = $(inputs[2]).val() ? $(inputs[2]).val() : '';
			}
			$(selectedButtons).each(function(index) {
				var button = $(this).text();
				var parent = $(this)
					.parent()
					.attr('id');
				switch (parent) {
					case 'fareType':
						obj.fareType = button;
						break;
					case 'stateStatus':
						if (!obj.description) {
							obj.description = $(selectedButtons[1]).text() + ', ' + $(selectedButtons[2]).text();
						}
						break;
					case 'paidStatus':
						if (!obj.description) {
							obj.description = $(selectedButtons[1]).text() + ', ' + $(selectedButtons[2]).text();
						}
						break;
					case 'fareDiscrepancy':
						if (button == 'Yes' && obj.description == '') {
							obj.description = $(form)
								.children('.form-group')
								.children('textarea')
								.val();
						}
						break;
				}
			});
			break;
		case 'addExpenseForm':
			obj.menuType = 'Add Expense/ Add Gas';
			obj.expAmt = $(inputs[0]).val();
			obj.expType = $(selectedButtons[0]).text();
			if (obj.expType == 'Expense') {
				obj.description = $(form)
					.children('.form-group')
					.children('textarea')
					.val();
			}
			break;
		case 'logOnForm':
			obj.menuType = 'Log On/ Log Off';
			obj.log = $('#logon')
				.parent()
				.text();
			obj.description = 'Fleet Vehicle ' + $('#vehicleNum').val();
			obj.mileage = $('#odometer').val();
			if (obj.log == 'Log On') {
				gapi.client.script.scripts
					.run({
						scriptId: scriptId,
						resource: {
							function: 'checkMileage',
							parameters: [
								$('#vehicleNum').val(),
								obj.mileage,
								sessionStorage.getItem('id'),
								sessionStorage.getItem('email')
							]
						}
					})
					.then(function(response) {
						if (response.result.response.result !== '') {
							updateNotification(response.result.response.result);

							$('#notification').removeClass('d-none');
						}
						if (response.status !== 200) {
							console.log('check mileage failed');
						}
					});
			}
			break;
	}

	var output = [
		obj.userId,
		obj.menuType,
		obj.tip,
		obj.confirmationNum,
		obj.fareAmt,
		obj.fareType,
		obj.expAmt,
		obj.expType,
		obj.description,
		obj.log,
		obj.mileage
	];
	gapi.client.script.scripts
		.run({
			scriptId: scriptId,
			resource: {
				function: 'sheetUpdate',
				parameters: [sessionStorage.getItem('id'), output]
			}
		})
		.then(function(response) {
			if (response.status === 200) {
				console.log('Submit to sheet succeeded');
				submitted(formName, obj.log);
			} else {
				console.log('Submit to sheet failed');
			}
		});
}

function submitted(formName, logStatus) {
	console.log('Submitted ' + formName);
	if (formName == 'addFareForm') {
		var parentDiv = $(document.createElement('div')).css({
			display: 'flex',
			'flex-flow': 'column nowrap',
			'align-items': 'center',
			'margin-top': '5%'
		});
		var title = $(document.createElement('h2'))
			.css({
				'text-align': 'center'
			})
			.html('Successfully submitted Fare');
		var button = $(document.createElement('button'))
			.css({ 'margin-top': '2%' })
			.attr({ type: 'button' })
			.addClass('btn-lg btn-secondary')
			.html('Submit another Fare');
		button.click(function() {
			$('#newFare')
				.parent()
				.click();
		});
		parentDiv.append(title, button);
		$('#currentForm').html(parentDiv);
	} else if (formName == 'addExpenseForm') {
		var parentDiv = $(document.createElement('div')).css({
			display: 'flex',
			'flex-flow': 'column nowrap',
			'align-items': 'center',
			'margin-top': '5%'
		});
		var title = $(document.createElement('h2'))
			.css({
				'text-align': 'center'
			})
			.html('Successfully submitted Expense');
		var button = $(document.createElement('button'))
			.css({ 'margin-top': '2%' })
			.attr({ type: 'button' })
			.addClass('btn-lg btn-secondary')
			.html('Submit another Expense');
		button.click(function() {
			$('#newExpense')
				.parent()
				.click();
		});
		parentDiv.append(title, button);
		$('#currentForm').html(parentDiv);
	} else if (formName == 'logOnForm') {
		sessionStorage.setItem('clocked', 'true');
		if (logStatus == 'Log On') {
			createMenu('true');
			$('#newFare')
				.parent()
				.click();
		} else if (logStatus == 'Log Off') {
			sessionStorage.setItem('email', '');
			sessionStorage.setItem('id', '');
			sessionStorage.setItem('clocked', 'false');
			parent.window.location.href = './index.html';
		}
	}
}

function buttonCheck(element) {
	var id = element.id;
	setTimeout(function() {
		var active = $(element).children('.active');
		switch (id) {
			case 'fareType':
				if (active.text() == 'Credit Card' && $('#ccForm').length === 0) {
					var inputForm = $(document.createElement('div'))
						.addClass('form-group')
						.attr({ id: 'ccForm' });
					var label = $(document.createElement('label')).html('Credit Card Tip');
					var input = $(document.createElement('input')).attr({
						name: 'ccTip',
						id: 'ccTip',
						placeholder: '$'
					});
					inputForm.append(label, input);
					var stateButtons = $(document.createElement('div'))
						.addClass('form-group')
						.attr({ id: 'ccState' });
					var stateGroup = $(document.createElement('div'))
						.addClass('btn-group-lg btn-group-toggle')
						.attr({ 'data-toggle': 'buttons', id: 'stateStatus' });
					var inState = $(document.createElement('label'))
						.html('In State')
						.addClass('btn btn-secondary')
						.append(
							$(document.createElement('input'))
								.attr({
									type: 'radio',
									autocomplete: 'off',
									id: 'inState'
								})
								.prop('required', true)
						);
					var outState = $(document.createElement('label'))
						.html('Out of State')
						.addClass('btn btn-secondary')
						.append(
							$(document.createElement('input'))
								.attr({
									type: 'radio',
									autocomplete: 'off',
									id: 'outState'
								})
								.prop('required', true)
						);
					stateGroup.append(inState, outState);
					stateButtons.append(stateGroup);
					var paidButtons = $(document.createElement('div'))
						.addClass('form-group')
						.attr({ id: 'ccPaid' });
					var paidGroup = $(document.createElement('div'))
						.addClass('btn-group-lg btn-group-toggle')
						.attr({ 'data-toggle': 'buttons', id: 'paidStatus' });
					var paidCar = $(document.createElement('label'))
						.html('Paid in Car')
						.addClass('btn btn-secondary')
						.append(
							$(document.createElement('input'))
								.attr({
									type: 'radio',
									autocomplete: 'off',
									id: 'paidCar'
								})
								.prop('required', true)
						);
					var paidOffice = $(document.createElement('label'))
						.html('Paid in Office')
						.addClass('btn btn-secondary')
						.append(
							$(document.createElement('input'))
								.attr({
									type: 'radio',
									autocomplete: 'off',
									id: 'paidOffice'
								})
								.prop('required', true)
						);
					paidGroup.append(paidCar, paidOffice);
					paidButtons.append(paidGroup);
					if (window.innerWidth <= 768) {
						stateGroup.addClass('btn-group-vertical');
						paidGroup.addClass('btn-group-vertical');
					}
					$(element)
						.parent()
						.after(inputForm, stateButtons, paidButtons);
				} else if (active.text() !== 'Credit Card') {
					$('#ccForm').remove();
					$('#ccState').remove();
					$('#ccPaid').remove();
				}
				break;
			case 'fareDiscrepancy':
				if (active.text() == 'Yes' && $('#discrepancyDescription').length === 0) {
					var inputForm = $(document.createElement('div'))
						.addClass('form-group')
						.attr({ id: 'discrepancyDescription' });
					var label = $(document.createElement('label')).html('Describe the Discrepancy');
					var input = $(document.createElement('textarea')).attr({ row: 3, name: 'discrepancyDescription' });
					inputForm.append(label, input);
					$(element)
						.parent()
						.after(inputForm);
				} else if (active.text() !== 'Yes') {
					$('#discrepancyDescription').remove();
				}
				break;
			case 'expenseType':
				if (active.text() == 'Expense' && $('#expenseDescription').length === 0) {
					var inputForm = $(document.createElement('div'))
						.addClass('form-group')
						.attr({ id: 'expenseDescription' });
					var label = $(document.createElement('label')).html('Expense Description');
					var input = $(document.createElement('textarea')).attr({ row: 3, name: 'expenseDescription' });
					inputForm.append(label, input);
					$(element)
						.parent()
						.after(inputForm);
				} else if (active.text() !== 'Expense') {
					$('#expenseDescription').remove();
				}
				break;
		}
	}, 200);
}

function noFare() {
	var h = $(document.createElement('h1')).html(
		'Contact your Supervisor to make changes to your past Fares and Expenses.'
	);
	$('#currentForm').html(h);
}

function editFare(stats) {
	$('#editTable')
		.parent()
		.removeClass('d-none');
	var overflow = document.createElement('div');
	overflow.setAttribute('style', 'overflow-x: auto;');

	var table = document.createElement('table');
	var headers = [
		'Edit/Save',
		'Timestamp',
		'DriverID',
		'EventType',
		'Credit Card Tip',
		'Confirmation#',
		'FareAmt',
		'FareType',
		'Amt of Expense/ Gas',
		'Expense Type',
		'Description (Expense Only)',
		'LogOn/ LogOff',
		'Current Mileage'
	];

	if (document.querySelector('div#editFare table')) {
		document.getElementById('editFare').removeChild(document.getElementById('editFare').childNodes[2]);
	}
	table.setAttribute('id', 'table');
	overflow.appendChild(table);

	var tableHeaderRow = document.createElement('tr');
	headers.forEach(function(col) {
		var tableHeaders = document.createElement('th');
		tableHeaders.innerHTML = col;
		tableHeaderRow.appendChild(tableHeaders);
	});
	table.appendChild(tableHeaderRow);

	stats.forEach(function(row, index) {
		if (row[0] !== '') {
			var tableRow = document.createElement('tr');

			var input = document.createElement('input');
			input.setAttribute('type', 'button');
			input.setAttribute('value', 'Edit');
			input.setAttribute('onclick', 'editSave(this,' + (index + 1) + ')');

			var tableInput = document.createElement('td');
			tableInput.appendChild(input);
			tableRow.appendChild(tableInput);

			row.forEach(function(col) {
				var tableItem = document.createElement('td');
				tableItem.innerHTML = col;
				tableRow.appendChild(tableItem);
			});

			table.appendChild(tableRow);
		}
	});

	if (
		$('#menuButtons')
			.children('.active')
			.text() !== 'Edit Fare'
	) {
		$('#editTable').html('');
	} else {
		$('.loader').remove();
		$('#editTable').html(overflow);
	}
}

function editSave(button, tableRow) {
	var row = document.getElementsByTagName('tr')[tableRow];

	var startNum = 0;
	var endNum = 0;

	if (row.childNodes[3].innerHTML == 'Add Fare') {
		startNum = 4;
		endNum = 7;
	} else if (row.childNodes[3].innerHTML == 'Log On/ Log Off') {
		startNum = 11;
		endNum = 12;
	} else if (row.childNodes[3].innerHTML == 'Add Expense/ Add Gas') {
		startNum = 8;
		endNum = 10;
	}

	if (button.value == 'Edit') {
		button.value = 'Save';

		for (var x = startNum; x <= endNum; x++) {
			var id = row.childNodes[x];
			var content = row.childNodes[x].innerHTML;
			if (x === 7) {
				var oldData = row.childNodes[x].innerHTML;
				row.childNodes[x].innerHTML =
					'<select>' +
					'<option value="Cash">Cash</option>' +
					'<option value="Account">Account</option>' +
					'<option value="Credit Card">Credit Card</option>' +
					'<option value="TARPS (Cash Only)">TARPS (Cash Only)</option>' +
					'<option value="Personal">Personal</option>' +
					'<option value="Out of State Cash">Out of State Cash</option>' +
					'<option value="Out of State Credit Card">Out of State Credit Card</option>' +
					'<option value="Owner Fleet">Owner Fleet</option>' +
					'</select>';
				row.childNodes[x].childNodes[0].childNodes.forEach(function(option) {
					if (option.value == oldData) {
						option.selected = true;
					}
				});
			} else if (x === 9) {
				var oldData = row.childNodes[x].innerHTML;
				row.childNodes[x].innerHTML =
					'<select>' +
					'<option value="Expense">Expense</option>' +
					'<option value="Gas">Gas</option>' +
					'</select>';
				row.childNodes[x].childNodes[0].childNodes.forEach(function(option) {
					if (option.value == oldData) {
						option.selected = true;
					}
				});
			} else if (x === 11) {
				var oldData = row.childNodes[x].innerHTML;
				row.childNodes[x].innerHTML =
					'<select>' +
					'<option value="Log On">Log On</option>' +
					'<option value="Log Off">Log Off</option>' +
					'</select>';
				row.childNodes[x].childNodes[0].childNodes.forEach(function(option) {
					if (option.value == oldData) {
						option.selected = true;
					}
				});
			} else {
				row.childNodes[x].innerHTML = '<input type="text" value="' + content + '">';
			}
		}
	} else if (button.value == 'Save') {
		button.value = 'Edit';

		for (var y = startNum; y <= endNum; y++) {
			var id = row.childNodes[y];
			var content = row.childNodes[y].innerHTML;
			var updated = id.childNodes[0].value;
			row.childNodes[y].innerHTML = updated;
		}
		var output = [];
		row.childNodes.forEach(function(item) {
			output.push(item.innerHTML);
		});
		output.shift();
		gapi.client.script.scripts
			.run({
				scriptId: scriptId,
				resource: {
					function: 'sheetUpdate',
					parameters: [sessionStorage.getItem('id'), output, row.childNodes[1].innerHTML]
				}
			})
			.then(function(response) {
				console.log(response);
			});
	}
}

function toggleMenu(state) {
	if (state === 'true') {
		$('#menuButtons')
			.children()
			.each(function(index) {
				if (index > 0) {
					$(this)
						.addClass('d-none')
						.removeClass('d-flex');
				}
			});
		$('#menuButtons').val('false');
	} else {
		$('#menuButtons')
			.children()
			.each(function(index) {
				if (index > 0) {
					$(this)
						.addClass('d-flex')
						.removeClass('d-none');
				}
			});
		$('#menuButtons').val('true');
	}
}

function updateNotification(update) {
	var noteText = $('.notificationText');
	switch (update) {
		case 'overdue':
			noteText.html('Your vehicle is overdue for an oil change. Report to your manager after your shift.');
			break;
		case 'warning':
			noteText.html(
				'Your vehicle is due for an oil change. Please schedule one before your next service date.'
			);
			break;
		case 'default':
			break;
	}
}

function closeNotification() {
	$('#notification')
		.removeClass('d-flex')
		.addClass('d-none');
}

function screenSize() {
	var width = window.innerWidth;
	if (width <= 768) {
		$('#menuButtons').removeClass('btn-group');
		$('#menuButtons').addClass('btn-group-vertical');
		toggleMenu('true');
	}
}

function verifyAmt(element) {
	console.log(element);
	var id = $(element).attr('id');
	var val = $(element).val();
	if ((id == 'fareAmt' && val > 100) || (id == 'expenseAmount' && val > 50)) {
		if ($('#dialog-confirm').length > 0) {
			$('#dialog-confirm').remove();
		}
		var div = $(document.createElement('div')).attr({ id: 'dialog-confirm' });
		var p = $(document.createElement('p')).html('You entered $' + val + '.\nIs this amount correct?');
		div.append(p);
		$(document.body).append(div);
		var windowSize;
		if (window.innerWidth <= 768) {
			windowSize = window.innerWidth * 0.9;
		} else {
			windowSize = 400;
		}
		if (id == 'fareAmt') {
			div.attr('title', 'Confirm Fare');
			div.dialog({
				dialogClass: 'no-close',
				resizable: false,
				height: 'auto',
				width: windowSize,
				modal: true,
				buttons: {
					Yes: function() {
						$(this).dialog('close');
					},
					No: function() {
						$(element).val(null);
						$(this).dialog('close');
					}
				}
			});
		} else {
			div.attr('title', 'Confirm Expense');
			div.dialog({
				classes: {
					'ui-dialog': 'no-close'
				},
				resizable: false,
				height: 'auto',
				maxWidth: windowSize,
				modal: true,
				buttons: [
					{
						text: 'Yes',
						click: function() {
							$(this).dialog('close');
						}
					},
					{
						text: 'No',
						click: function() {
							$(element).val(null);
							$(this).dialog('close');
						}
					}
				]
			});
		}
		$('.ui-dialog-buttonset')
			.children()
			.css('display', 'none')
			.addClass('btn btn-secondary')
			.css('display', 'inline');
		$('.ui-dialog').addClass('position-fixed');
	}
}
