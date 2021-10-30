<!DOCTYPE html>
<html lang="en">
<header>
  <?php
  include_once('../shared/header.php');

  print renderHeader('Play');
  print loadGameScripts();
  print loadFormatters();
  print checkAuthenticationStatus();
  ?>
</header>

<body id="game-page">
  <?php
  include('../components/navbar.php');
  echo renderNavbar();
  ?>

  <div id="game-frame">
    <!-- SIDEBAR -->
    <?php include_once('./sidebar.php') ?>

    <!-- MENUS -->
    <?php include_once('./menus/jobs.php') ?>
    <?php include_once('./menus/shop.php') ?>

    <!-- PANES -->
    <?php include_once('./panes/balance.php') ?>
    <?php include_once('./panes/active_jobs.php') ?>
    <?php include_once('./panes/logs.php') ?>

    <!-- MAP -->
    <div id="game">
      <div id="frame">
        <div id="map" class="map">
          <canvas id="dev" width="640" height="640"> </canvas>
          <canvas id="grid" width="640" height="640"> </canvas>
          <canvas id="objects" width="640" height="640"></canvas>
          <canvas id="labels" width="640" height="640"></canvas>
        </div>
      </div>
    </div>
  </div>

  <script src="./scripts/game/index.js"></script>

</body>

</html>