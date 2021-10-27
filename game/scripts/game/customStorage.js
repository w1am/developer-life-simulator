class CustomStorage {
  constructor() {
  }

  getter = function (initialState, key) {
    let state = localStorage.getItem(key) || initialState

    // Convert to number data type if state looks like it is a number
    if (isNaN(Number(state))) {
      return JSON.parse(state)
    } else {
      return Number(JSON.parse(state))
    }
  }

  setter = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

const customStorage = new CustomStorage()