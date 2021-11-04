<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../templates/headers.php');

  renderAuthenticationHeader('Register');
  ?>
</header>

<body>
  <?php
  include('../../templates/common.php');
  navbar();
  ?>

  <page-wrapper>
    <div class="message">
      <i class="far fa-check-circle check"></i>
      <h1>Registration successful</h1>
      <br>

      <?php button("/developer-life-simulator/authentication/login", "primary", "Login"); ?>
    </div>
  </page-wrapper>

  <?php footer() ?>
</body>

</html>