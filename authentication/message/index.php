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
    <h1>Registration successful</h1>
  </page-wrapper>

  <?php include('../../components/footer.php') ?>
</body>

</html>