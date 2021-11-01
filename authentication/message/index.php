<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../shared/authentication.php');

  print renderAuthenticationHeader('Register');
  echo loadAuthenticationScripts();
  ?>
</header>

<body>
  <?php
  include('../../components/navbar.php');
  echo renderNavbar();
  ?>

  <page-wrapper>
    <div class="message">
      <i class="far fa-check-circle check"></i>
      <h1>Registration successful</h1>
      <br>

      <?php
      include('../../components/button.php');
      print renderButton("/developer-life-simulator/game", "success", "Play Game");
      ?>
    </div>
  </page-wrapper>

  <?php include('../../components/footer.php') ?>
</body>

</html>