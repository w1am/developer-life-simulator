<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include('../templates/headers.php');
  renderHeader("Home");
  ?>
</header>

<body>
  <flex-wrapper>
    <?php
    include('../templates/common.php');
    navbar();
    ?>

    <div class="text-center banner">
      <h1 id="welcome-user"></h1>

      <h1>Create your own virtual startup. Hire employees and grow your tech company.</h1>

      <?php button("/developer-life-simulator/game", "success", "Play Game") ?>
    </div>

    <div class="tutorial">
      <div class="tutorial-item">
        <p class="number-label">1</p>
        <h1>Hire developers</h1>
        <p class="description">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
      </div>

      <div class="tutorial-item">
        <p class="number-label">2</p>
        <h1>Accept Jobs</h1>
        <p class="description">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
      </div>

      <div class="tutorial-item">
        <p class="number-label">3</p>
        <h1>Customize</h1>
        <p class="description">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
      </div>
    </div>

    <?php footer() ?>
  </flex-wrapper>
</body>