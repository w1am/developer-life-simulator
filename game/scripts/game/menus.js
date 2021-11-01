let menus = ["shop", "job"]
let dragged = null

function highlightWindow(menuId) {
  dragged = menuId

  menus.forEach((m, mIndex) => {
    if (menus[mIndex] === dragged) {
      document.getElementById(`content-${m}`).parentElement.classList.add('open');

      document.querySelector(`#menu-${menuId}`).style.zIndex = "9999999999999999999999"
      document.querySelector(`#menu-${menuId}`).querySelector(".header").setAttribute('active', true)
    } else {
      document.getElementById(`content-${m}`).parentElement.classList.remove('open')

      document.querySelector(`#menu-${m}`).style.zIndex = "99999999"
      document.querySelector(`#menu-${m}`).querySelector(".header").setAttribute('active', false)
    }
  })
}

document
  .getElementById("content-shop")
  .parentElement.addEventListener("click", () => {
    document.getElementById("content-shop").parentElement.classList.add('open');
    document.getElementById("content-job").parentElement.classList.remove('open')

    shopActive = true;

    document.getElementById("menu-shop").hidden = false;
    document.getElementById("grid").hidden = true;

    highlightWindow('shop')
    renderProducts(tab);
  });

document
  .getElementById("content-job")
  .parentElement.addEventListener("click", () => {
    document.getElementById("content-job").parentElement.classList.add('open');
    document.getElementById("content-shop").parentElement.classList.remove('open')

    document.getElementById("menu-job").hidden = false;

    highlightWindow('job')
    renderJobs();
  });

const handleJobClose = () => {
  let menu = document.getElementById("menu-job")
  menu.hidden = true;
  dragged = null;
}

const handleShopClose = () => {
  shopActive = false;
  let menu = document.getElementById("menu-shop")
  menu.hidden = true;
  document.getElementById("grid").hidden = false;
  dragged = null;
};


function dragMenu(menuId) {
  // Set header component of menu as draggable element
  let elm = document.querySelector(`#menu-${menuId}`).querySelector(".header")

  // Stop drag on mouse down and mouse move
  elm.lastElementChild.onmousedown = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  elm.lastElementChild.onmousemove = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  let menu = document.querySelector(`#menu-${menuId}`)

  // Highlight on entire window click 
  document.querySelector(`#menu-${menuId}`).addEventListener('mousedown', (e) => {
    e.preventDefault()
    highlightWindow(menuId)
  })

  elm.onmousedown = (e) => {
    highlightWindow(menuId)

    // Prevent drag outside browser window
    document.onmousemove = (i) => {
      if (i.clientY - e.offsetY < 0) {
        menu.style.top = '0px'
      } else {
        menu.style.top = `${i.clientY - e.offsetY}px`
      }

      if (i.clientY + 440 > window.innerHeight) {
        menu.style.top = `${window.innerHeight - 440}px`
      }

      if (i.clientX - e.offsetX < 0) {
        menu.style.left = '0px'
      } else {
        menu.style.left = `${i.clientX - e.offsetX}px`
      }

      if (i.clientX + (600 - e.offsetX) > window.innerWidth) {
        menu.style.left = `${window.innerWidth - 600}px`
      }
    }

    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
      dragged = null
    }
  }
}

dragMenu("shop")
dragMenu("job")