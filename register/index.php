<!DOCTYPE html>
<html lang="en">
<?php
include('../shared/header.php');

print renderHeader('Register');
?>

<body>
  <?php include('../components/navbar.php') ?>

  <page-wrapper>
    <card>
      <h1>Register</h1>

      <form action="" class="space-y-sm">
        <div>
          <label for="email">Email Address</label>
          <input type="email" name="email" class="full" placeholder="Email Address">
        </div>

        <div class="flex space-x-xs">
          <div>
            <label for="first_name">First Name</label>
            <input type="text" name="first_name" class="full" placeholder="First Name">
          </div>

          <div>
            <label for="last_name">Last Name</label>
            <input type="text" name="last_name" class="full" placeholder="Last Name">
          </div>
        </div>

        <div>
          <label for="password">Password</label>
          <input type="password" name="password" class="full" placeholder="Password">
        </div>

        <div>
          <label for="confirm_password">Confirm Password</label>
          <input type="password" name="confirm_password" class="full" placeholder="Confirm Password">
        </div>

        <div>I already have an account. <a href="/developer-life-simulator/login">sign in</a></div>

        <button type="submit">Register</button>
      </form>

    </card>
  </page-wrapper>

  <?php include('../components/footer.php') ?>
</body>

</html>