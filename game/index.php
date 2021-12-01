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

    <?php
    status();
    ?>

    <!-- MAP -->
    <div id="game">
      <div id="frame">
        <div id="map" class="map">
          <!-- Grid / tiling system for the game -->
          <canvas id="grid" width="640" height="640"> </canvas>
          <!-- Canvas for objects -->
          <canvas id="objects" width="640" height="640"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- Sound effects -->
  <audio id="audio-claim" src="/developer-life-simulator/assets/claim.wav"></audio>
  <audio id="audio-start" src="/developer-life-simulator/assets/start.wav"></audio>
  <audio id="audio-level-up" src="/developer-life-simulator/assets/level-up.wav"></audio>

  <!-- Scripts that needs to be loaded after UI loads -->
  <script src="./scripts/main.js"></script>
  <script src="./scripts/menus.js" type="text/javascript"></script>
</body>

</html>