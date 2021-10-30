<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include('../shared/header.php');
  echo renderHeader("Home");
  echo checkAuthenticationStatus()
  ?>
</header>

<body>
  <flex-wrapper>
    <?php
    include('../components/navbar.php');
    echo renderNavbar();
    ?>


    <page-wrapper>
      <?php
      include('../components/button.php');
      print renderButton("/developer-life-simulator/game", "success", "Play Game");
      ?>
    </page-wrapper>

    <?php include('../components/footer.php') ?>
  </flex-wrapper>
</body>