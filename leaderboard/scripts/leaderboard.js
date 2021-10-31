let leaderboardItems = document.getElementById('leaderboard-items');

const players = customStorage.getter({}, 'accounts');

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

ordered.forEach((email) => {
  let player = players[email]

  let name = player.firstName
  let employeesCount = Object.keys(player.developers).length;
  let netWorth = player.assets + player.balance;
  let level = player.level

  let tr = document.createElement('tr');

  let td1 = document.createElement('td');
  td1.innerText = name;

  let td2 = document.createElement('td');
  td2.innerText = formatNumber(employeesCount);

  let td3 = document.createElement('td');
  td3.innerText = `LEVEL ${level}`

  let td4 = document.createElement('td');
  td4.innerText = "$ " + formatNumber(netWorth);

  tr.append(td1, td2, td3, td4);

  leaderboardItems.appendChild(tr)
})