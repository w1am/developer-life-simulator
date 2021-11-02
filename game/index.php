<!DOCTYPE html>
<html lang="en">
<header>
  <?php
  include_once('../shared/header.php');

  renderHeader('Play');
  loadGameScripts();
  loadFormatters();
  checkAuthenticationStatus();
  ?>
</header>

<body id="game-page">
  <?php
  include('../components/navbar.php');
  renderNavbar();
  ?>

  <!-- MENUS -->
  <?php
  include_once('./menus.php');
  renderShop();
  renderJobs();
  ?>

  <div id="game-frame">
    <!-- SIDEBAR -->
    <?php include_once('./sidebar.php') ?>

    <!-- PANES -->
    <?php
    include_once('./panes.php');
    echo '<div id="information-pane">';
    renderBalance();
    renderLevel();
    renderActiveJobs();
    echo '</div>';
    renderLogs();
    ?>

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
  <script src="./scripts/game/menus.js" type="text/javascript"></script>
</body>

</html>