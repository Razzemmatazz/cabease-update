var scriptId = "1C_BiKPvlMv0IhMxmedlE4GWHz_lLFGWX6MLafwx9KlOwbK87h4koXYQp";

$(document).ready(function() {
  google.script.run
    .withSuccessHandler(function(response) {
      console.log(response);
      if (response.effectiveUser === response.email) {
        window.open(
          "https://script.google.com/macros/s/AKfycbwjHOMUKbTMvKWL6R28hjlfwsKLtXOJkCcCKx8K7jX3A7KoCNq9/exec?page=main",
          "_top"
        );
      }
    })
    .getProperties(["email"]);
});

function validateForm(form) {
  $(form).toggleClass("needs-validation was-validated");
  if (!form.checkValidity()) {
    return false;
  } else {
    if ($("#confirmPassword").length > 0) {
      addNewUser();
    } else {
      validateLogin();
    }
    return false;
  }
}

function validateLogin() {
  var email = $("#email").val();
  var password = $("#password").val();
  google.script.run
    .withSuccessHandler(function(response) {
      if (response.status) {
        google.script.run.setProperties({
          clocked: "false",
          email: response.user.email,
          id: response.user.id
        });
        window.open(
          "https://script.google.com/macros/s/AKfycbwjHOMUKbTMvKWL6R28hjlfwsKLtXOJkCcCKx8K7jX3A7KoCNq9/exec?page=main",
          "_top"
        );
      } else {
        $("#warning").html("Invalid Email or Password");
      }
    })
    .validateLogin(email, password);
}

function verifyEmail(element) {
  var email = $(element).val();
  google.script.run
    .withSuccessHandler(function(response) {
      var status = response.userStatus;
      var warning = $("#warning");
      switch (status) {
        case "invalid":
          warning.html("Not a Cab-Ease email address");
          $("#password").prop("disabled", true);
          if ($("#confirmPassword").length > 0) {
            $("#confirmPassword")
              .parent()
              .remove();
          }
          break;
        case "new":
          warning
            .html(
              "This account does not yet have a password. Please create one now."
            )
            .addClass("text-success");
          $("#password").prop("disabled", false);
          if ($("#confirmPassword").length === 0) {
            createPasswordConfirmation();
          }
          break;
        default:
          warning.html("");
          $("#password").prop("disabled", false);
          if ($("#confirmPassword").length > 0) {
            $("#confirmPassword")
              .parent()
              .remove();
          }
          break;
      }
    })
    .verifyEmail(email);
}

function addNewUser() {
  var email = $("#email").val();
  var password = $("#password").val();
  google.script.run
    .withSuccessHandler(function(response) {
      var responseObj = response.result.response.result;
      if (responseObj.status) {
        google.script.run.setProperties({
          clocked: "false",
          email: email,
          id: responseObj.id
        });
        window.open(
          "https://script.google.com/macros/s/AKfycbwjHOMUKbTMvKWL6R28hjlfwsKLtXOJkCcCKx8K7jX3A7KoCNq9/exec?page=main",
          "_top"
        );
      } else {
        $("#warning").html(responseObj.message);
      }
    })
    .addNewUser(email, password);
}

function createPasswordConfirmation() {
  var newDiv = $(document.createElement("div")).addClass("form-group");
  var label = $(document.createElement("label"))
    .attr({ for: "confirmPassword" })
    .html("Confirm Password");
  var input = $(document.createElement("input"))
    .attr({
      type: "password",
      id: "confirmPassword",
      onfocusout: "verifyPasswordMatch()"
    })
    .addClass("form-control");
  newDiv.append(label, input);
  $("#warning")
    .parent()
    .before(newDiv);
  $("#logPageSubmit").html("Create Account");
}

function verifyPasswordMatch() {
  var pass1 = $("#password").val();
  var pass2 = $("#confirmPassword").val();
  if (pass1 === pass2) {
    $("#logPageSubmit").prop("disabled", false);
    $("#warning").html("");
  } else {
    $("#logPageSubmit").prop("disabled", true);
    $("#warning").html("Passwords do not match");
  }
}
