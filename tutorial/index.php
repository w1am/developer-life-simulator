<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include('../templates/headers.php');
  renderHeader("Tutorial");
  ?>
</header>

<body>
  <flex-wrapper>
    <?php
    include('../templates/common.php');
    navbar();
    ?>

    <page-wrapper>
      <h1>Tutorial</h1>

      <br>
      <p>
        The basic goal of the game is to expand your business from a small start-up to a large corporation by recruiting developers and accepting jobs in exchange for prizes.
      </p>
      <br>

      <?php button("/developer-life-simulator/game", "success", "Play Game") ?>
    </page-wrapper>

    <?php footer() ?>
  </flex-wrapper>
</body>