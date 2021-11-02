<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../shared/authentication.php');

  renderAuthenticationHeader('Signout');
  ?>
  <script>
    window.onload = function() {
      localStorage.removeItem("authed_user");
    };
  </script>
</header>

<body>
  <?php
  include('../../components/navbar.php');
  renderNavbar();
  ?>

  <page-wrapper>
    <h1>Bye!</h1>
  </page-wrapper>

  <?php include('../../components/footer.php');
  renderFooter() ?>
</body>

</html>