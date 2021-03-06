<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../templates/headers.php');
  renderBaseHeader('Login');
  renderAuthenticationHeader();
  ?>
</header>

<body>
  <?php
  include('../../templates/common.php');
  navbar();
  ?>

  <?php
  $not_authenticated = isset($_GET['source']) && $_GET['source'] === 'failed';
  $registration_success = isset($_GET['registration']) && $_GET['registration'] === 'success';
  if ($not_authenticated) {
    messageBox('error', 'Please login to play the game');
  }
  if ($registration_success) {
    messageBox('success', 'Registration successful. Login to play!');
  }
  ?>

  <page-wrapper>
    <div class="flex center m-y-md">
      <card>
        <h1>Login</h1>

        <form id="login-form" onsubmit="return handleSubmit(event, 'login')" action="" class="space-y-sm">
          <div>
            <label for="email">Email Address</label>
            <input onblur="handleInput('login',this.name, this.value)" oninput="handleInput('login',this.name, this.value)" type="email" name="email" class="full" placeholder="Email Address">
          </div>

          <div>
            <label for="password">Password</label>
            <input onblur="handleInput('login',this.name, this.value)" oninput="handleInput('login',this.name, this.value)" type="password" name="password" class="full" placeholder="Password">
          </div>

          <div>I already have an account. <a href="/developer-life-simulator/authentication/register">register</a></div>

          <button type="submit">Login</button>
        </form>
      </card>
      <img id="login-image" src="/developer-life-simulator/assets/login_image.png" alt="" srcset="">
    </div>
  </page-wrapper>

  <?php footer() ?>

  <script type="module" src="../scripts/main.js"></script>
</body>

</html>