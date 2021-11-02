<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../shared/authentication.php');

  renderAuthenticationHeader('Register');
  loadAuthenticationScripts();
  ?>
</header>

<body>
  <?php
  include('../../components/navbar.php');
  renderNavbar();
  ?>

  <page-wrapper>
    <div class="message">
      <i class="far fa-check-circle check"></i>
      <h1>Registration successful</h1>
      <br>

      <?php
      include('../../components/button.php');
      renderButton("/developer-life-simulator/authentication/login", "primary", "Login");
      ?>
    </div>
  </page-wrapper>

  <?php include('../../components/footer.php');
  renderFooter() ?>
</body>

</html>