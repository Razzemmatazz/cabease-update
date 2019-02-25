var scriptId = "1C_BiKPvlMv0IhMxmedlE4GWHz_lLFGWX6MLafwx9KlOwbK87h4koXYQp";

$(document).ready(function() {
  var email = sessionStorage.getItem("email");
  if (email) {
    window.open(
      "https://script.google.com/macros/s/AKfycbwjHOMUKbTMvKWL6R28hjlfwsKLtXOJkCcCKx8K7jX3A7KoCNq9/exec?page=main",
      "_top"
    );
  }
});

function validateLogin() {
  var email = $("#email").val();
  var password = $("#password").val();
  google.script.run
    .withSuccessHandler(function(response) {
      if (response.status) {
        sessionStorage.setItem("clocked", "false");
        sessionStorage.setItem("email", response.user.email);
        sessionStorage.setItem("id", response.user.id);
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
        sessionStorage.setItem("clocked", "false");
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("id", responseObj.id);
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
