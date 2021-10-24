<!DOCTYPE html>
<html lang="en">
<?php
include('../shared/header.php');

print renderHeader('Play');
print loadGameScripts();
?>

<body id="game-page">
  <?php include('../components/navbar.php') ?>

  <div id="game-frame">
    <?php include('./sidebar.php') ?>

    <div hidden id="job-menu">
      <div id="job-header" class="header">
        <p class="title">Jobs</p>
        <button onclick="handleJobClose()">X</button>
      </div>

      <div id="job" class="content"></div>
    </div>


    <div hidden id="shop-menu" class="shop-menu">
      <div id="shop-header" class="header">
        <p class="title">Shop</p>
        <button onclick="handleShopClose()">X</button>
      </div>

      <div class="parent">
        <div id="sidebar">
          <div active="true" onclick="setTab('servers')" id="item-servers" class="item">
            Servers
          </div>
          <div active="false" onclick="setTab('developers')" id="item-developers" class="item">
            Developers
          </div>
          <div active="false" onclick="setTab('entertainments')" id="item-entertainments" class="item">
            Entertainments
          </div>
          <div active="false" onclick="setTab('services')" id="item-services" class="item">
            Services
          </div>
        </div>
        <div id="shop" class="content"></div>
      </div>
    </div>


    <div id="balance-amount">0</div>

    <div id="job-container">
      <div class="dashboard">Active Jobs</div>
      <div id="dashboard-content" class="dashboard-content"></div>
    </div>




    <div id="game">
      <div id="frame">
        <div id="map" class="map">
          <canvas id="dev" width="640" height="640"> </canvas>
          <canvas id="grid" width="640" height="640"> </canvas>
          <canvas id="objects" width="640" height="640"></canvas>
        </div>
      </div>
    </div>
  </div>

  <script src="./scripts/game/index.js"></script>

</body>

</html>