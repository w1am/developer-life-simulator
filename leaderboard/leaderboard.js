"use strict";

import { customStorage, formatNumber } from "../common/index.js";

let leaderboardItems = document.getElementById('leaderboard-items');
let leaderboard = document.getElementById('leaderboard')

const players = customStorage.getter({}, 'accounts');

// Order players by their networth in descending. high to low
const ordered = Object.keys(players).sort(function (a, b) {
  let netWorthA = players[a].balance + players[a].assets;
  let netWorthB = players[b].balance + players[b].assets;

  if (netWorthA < netWorthB) {
    return 1;
  }

  if (netWorthA > netWorthB) {
    return -1;
  }

  return 0;
});

if (ordered.length === 0) {
  let empty = document.createElement('p')
  empty.innerText = "No players on the board yet"
  empty.style.padding = '50px'
  empty.style.textAlign = 'center'
  empty.style.fontSize = '20px'
  empty.style.color = '#686868'
  leaderboard.append(empty)
} else {
  ordered.forEach((email, index) => {
    let player = players[email]

    let name = player.firstName
    let employeesCount = Object.keys(player.developers).length;
    let netWorth = player.assets + player.balance;
    let level = player.level

    let tr = document.createElement('tr');

    let td1 = document.createElement('td');
    td1.innerText = index + 1 + '.';

    let td2 = document.createElement('td');
    td2.innerText = name;

    let td3 = document.createElement('td');
    td3.innerText = formatNumber(employeesCount);

    let td4 = document.createElement('td');
    td4.innerText = `LEVEL ${level}`

    let td5 = document.createElement('td');
    td5.innerText = "$ " + formatNumber(netWorth);

    tr.append(td1, td2, td3, td4, td5);

    leaderboardItems.appendChild(tr)
  })
}