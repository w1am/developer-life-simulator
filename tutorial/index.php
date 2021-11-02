<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include('../shared/header.php');
  renderHeader("Tutorial");
  checkAuthenticationStatus()
  ?>
</header>

<body>
  <flex-wrapper>
    <?php
    include('../components/navbar.php');
    renderNavbar();
    ?>


    <page-wrapper>
      <h1>Tutorial</h1>

      <br>
      <p>
        The basic goal of the game is to expand your business from a small start-up to a large corporation by recruiting developers and accepting jobs in exchange for prizes.
      </p>
      <br>


      <?php
      include('../components/button.php');
      renderButton("/developer-life-simulator/game", "success", "Play Game");
      ?>
    </page-wrapper>


    <?php
    include('../components/footer.php');
    renderFooter();
    ?>
  </flex-wrapper>
</body>