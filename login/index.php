<!DOCTYPE html>
<html lang="en">
<?php
include('../shared/header.php');

print renderHeader('Login');
?>

<body>
  <?php include('../components/navbar.php') ?>

  <page-wrapper>
    <card>
      <h1>Login</h1>

      <form action="" class="space-y-sm">
        <div>
          <label for="email">Email Address</label>
          <input type="email" name="email" class="md" placeholder="Email Address">
        </div>

        <div>
          <label for="password">Password</label>
          <input type="password" name="password" class="md" placeholder="Password">
        </div>

        <div>I already have an account. <a href="/developer-life-simulator/register">register</a></div>

        <button type="submit">Login</button>
      </form>

    </card>
  </page-wrapper>

  <?php include('../components/footer.php') ?>
</body>

</html>