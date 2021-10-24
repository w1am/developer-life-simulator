class CustomStorage {
  constructor() {
  }

  getter = function (initialState, key) {
    let state = JSON.parse(localStorage.getItem(key)) || initialState

    // Convert to number data type if state looks like it is a number
    if (isNaN(Number(state))) {
      return state
    } else {
      return Number(state)
    }
  }

  setter = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

const customStorage = new CustomStorage()