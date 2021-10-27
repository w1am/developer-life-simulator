<!DOCTYPE html>
<html lang="en">
<?php
include_once('../shared/header.php');

print renderHeader('Play');
print loadGameScripts();
?>

<body id="game-page">
  <?php include_once('../components/navbar.php') ?>

  <div id="game-frame">
    <!-- SIDEBAR -->
    <?php include('./sidebar.php') ?>

    <!-- MENUS -->
    <?php include('./menus/jobs.php') ?>
    <?php include('./menus/shop.php') ?>

    <!-- PANES -->
    <?php include('./panes/balance.php') ?>
    <?php include('./panes/active_jobs.php') ?>
    <?php include('./panes/logs.php') ?>

    <!-- MAP -->
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