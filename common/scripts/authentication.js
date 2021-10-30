window.onload = function () {
  let isAuthed = localStorage.getItem('authed_user') || null

  if (isAuthed) {
    document.querySelectorAll('.auth').forEach((element) => {
      element.setAttribute('authenticated', true)
    })

    document.querySelector('.signout').setAttribute('authenticated', true)
  }
}