<!DOCTYPE html>
<html lang="en">
<header>
  <?php
  include_once('../templates/headers.php');
  renderHeader('Play');
  ?>
</header>

<body id="game-page">
  <!-- Navigation bar -->
  <?php
  include('../templates/common.php');
  navbar();
  ?>

  <!-- MENUS -->
  <?php
  include('../templates/game.php');
  shop();
  jobs();
  ?>

  <div id="game-frame">
    <!-- SIDEBAR  -->
    <?php
    sidebar();
    ?>

    <!-- FLOATING PANES -->
    <div id="information-pane">
      <?php
      balance();
      level();
      activeJobs();
      ?>
    </div>

    <?php
    logs();
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

  <!-- Scripts that needs to be loaded after UI loads -->
  <script src="./scripts/main.js"></script>
  <script src="./scripts/menus.js" type="text/javascript"></script>
</body>

</html>