"use strict"

import { customStorage, AUTHENTICATION_STORAGE } from '../../common/index.js'

// Initial form values
const formValue = {
  register: {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  },
  login: {
    email: "",
    password: "",
  },
};

// Redirect to home if user is already authenticated
window.onload = function () {
  let isAuthed = customStorage.getter(
    null,
    AUTHENTICATION_STORAGE.AUTHENTICATED_USER
  );
  if (isAuthed) {
    window.location.pathname = "developer-life-simulator/home";
  }
};

// Simple email and empty field validation
function hasErrors(type, field, value) {
  let error;
  let message = "This field is required";

  if (!formValue[type][field]) {
    error = true;
  }

  if (field === "email" && value) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const invalidEmail =
      field === "email" && !re.test(String(value.toLowerCase()));
    if (invalidEmail) {
      message = "Invalid email address";
      error = true;
    }
  }

  if (field === "confirmPassword" && value !== formValue[type].password) {
    message = "Passwords do not match";
    error = true;
  }

  return {
    error,
    message,
  };
}

let errors = {
  email: false,
  firstName: false,
  lastName: false,
  password: false,
  confirmPassword: false,
};

// Update state using the field and value property
const handleInput = function(type, field, value) {
  formValue[type][field] = value;
  highlightFieldWhenError(type, field, value);
}

window.handleInput = handleInput

// Highlight field if form has errors.
function highlightFieldWhenError(type, field, value) {
  let fields = document.getElementsByName(field);
  fields.forEach((e) => {
    let response = hasErrors(type, field, value);

    if (e.parentNode.childNodes.length > 5)
      e.parentNode.removeChild(e.parentNode.lastElementChild);

    if (response.error) {
      errors[field] = true;

      e.classList.add("error");
      e.parentElement.style.color = "red";
      e.parentElement.style.transition = "all 0.1s";

      const errorMessage = document.createElement("p");
      errorMessage.innerText = response.message;
      errorMessage.style.color = "red";
      errorMessage.style.transition = "all 0.1s";
      errorMessage.style.marginTop = "5px";

      e.parentElement.appendChild(errorMessage);
    } else {
      errors[field] = false;

      e.classList.remove("error");
      e.parentElement.style.color = "black";
      e.parentElement.style.transition = "all 0.1s";
    }
  });
}

// Check all fields when user clicks submit
function validateFields(type) {
  Object.keys(formValue[type]).map((field) => {
    errors[field] = !formValue[type][field];
    highlightFieldWhenError(type, field, formValue[type][field]);
  });
}

const handleSubmit = function (type) {
  validateFields(type);

  // Push to errorsCount array when object key value is true
  let errorsCount = Object.values(errors).filter((status) => status).length;

  if (errorsCount > 0) return;

  let accounts = customStorage.getter({}, AUTHENTICATION_STORAGE.ACCOUNTS);

  if (type === "register") {
    // If account already exists
    if (accounts[formValue.register.email]) {
      let emailField = document
        .querySelector("#registration-form")
        .querySelector("input[name='email']");

      // The paragraph error message.
      if (emailField.parentNode.childNodes.length > 3)
        e.parentNode.removeChild(e.parentNode.lastElementChild);

      emailField.classList.add("error");
      emailField.parentElement.style.color = "red";
      emailField.parentElement.style.transition = "all 0.1s";

      const errorMessage = document.createElement("p");
      errorMessage.innerText = "User already exists";
      errorMessage.style.color = "red";
      errorMessage.style.transition = "all 0.1s";
      errorMessage.style.marginTop = "5px";

      // Append the error message
      emailField.parentElement.appendChild(errorMessage);
      return;
    } else {
      // Registration successful and set default account GAME_PROPERTIES
      const { email, firstName, lastName, password } = formValue.register;
      accounts[email] = {
        firstName,
        lastName,
        password,
        balance: 200000,
        developers: {},
        layout: [],
        objects: {},
        activeJobs: {},
        assets: 0,
        level_progress: 0,
        level: 1,
        type: "startup",
      };
      customStorage.setter(AUTHENTICATION_STORAGE.ACCOUNTS, accounts);

      // Redirect to another page 
      window.location.pathname =
        "developer-life-simulator/authentication/message";
    }
  } else if (type === "login") {
    // The user must exist first to proceed
    if (accounts[formValue.login.email]) {
      // If passwords do not match
      if (
        formValue.login.password !== accounts[formValue.login.email].password
      ) {
        let emailField = document
          .querySelector("#login-form")
          .querySelector("input[name='password']");

        if (emailField.parentNode.childNodes.length > 3)
          e.parentNode.removeChild(e.parentNode.lastElementChild);

        emailField.classList.add("error");
        emailField.parentElement.style.color = "red";
        emailField.parentElement.style.transition = "all 0.1s";

        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Invalid password";
        errorMessage.style.color = "red";
        errorMessage.style.transition = "all 0.1s";
        errorMessage.style.marginTop = "5px";

        emailField.parentElement.appendChild(errorMessage);
      } else {
        // Login successful. User is now authenticated.
        customStorage.setter(
          AUTHENTICATION_STORAGE.AUTHENTICATED_USER,
          formValue.login.email
        );

        document.querySelectorAll(".auth").forEach((element) => {
          element.setAttribute("authenticated", true);
        });

        document.querySelector(".signout").setAttribute("authenticated", true);

        window.location.pathname = "developer-life-simulator/home";
        return;
      }
    } else {
      // Show error if user does not exist
      let emailField = document
        .querySelector("#login-form")
        .querySelector("input[name='email']");

      if (emailField.parentNode.childNodes.length > 3)
        e.parentNode.removeChild(e.parentNode.lastElementChild);

      emailField.classList.add("error");
      emailField.parentElement.style.color = "red";
      emailField.parentElement.style.transition = "all 0.1s";

      const errorMessage = document.createElement("p");
      errorMessage.innerText = "User does not exist";
      errorMessage.style.color = "red";
      errorMessage.style.transition = "all 0.1s";
      errorMessage.style.marginTop = "5px";

      emailField.parentElement.appendChild(errorMessage);
    }
  }
}

window.handleSubmit = handleSubmit;