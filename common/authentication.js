"use strict"

/**
 * On load function to check if user is currently authenticated.
 * 1. Check if local storage key "authed_user" has a user email binded to it
 * eg. authed_user = "joe@joe.com"
 * 
 * 2. Apply 'authenticated' header to the navbar link
 * */ 
window.onload = function () {
  let isAuthed = JSON.parse(localStorage.getItem('authed_user')) || null
  let accounts = JSON.parse(localStorage.getItem('accounts'));

  if (isAuthed) {
    document.querySelectorAll('.auth').forEach((element) => {
      element.setAttribute('authenticated', true)
    })

    let welcomeUserElement = document.getElementById('welcome-user')
    if (welcomeUserElement) {
      welcomeUserElement.innerText = `Welcome back, ${accounts[isAuthed].firstName}!`
    }

    document.querySelector('.signout').setAttribute('authenticated', true)
  }
}