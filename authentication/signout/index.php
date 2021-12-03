<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../templates/headers.php');
  renderBaseHeader('Signout')
  ?>
  <script type="module">
    window.onload = function() {
      localStorage.removeItem("authed_user");
    };
  </script>
</header>

<body>
  <?php
  include('../../templates/common.php');
  navbar();
  ?>

  <page-wrapper>
    <h1>Bye!</h1>
  </page-wrapper>

  <?php
  footer();
  ?>
</body>

</html>