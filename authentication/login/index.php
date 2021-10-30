<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../shared/authentication.php');

  print renderAuthenticationHeader('Login');
  print loadAuthenticationScripts();
  ?>
</header>

<body>
  <?php
  include('../../components/navbar.php');
  echo renderNavbar();
  ?>

  <page-wrapper>
    <card>
      <h1>Login</h1>

      <form id="login-form" onsubmit="event.preventDefault();handleSubmit('login')" action="" class="space-y-sm">
        <div>
          <label for="email">Email Address</label>
          <input onblur="handleInput('login',this.name, this.value)" oninput="handleInput('login',this.name, this.value)" type="email" name="email" class="full" placeholder="Email Address">
        </div>

        <div>
          <label for="password">Password</label>
          <input onblur="handleInput('login',this.name, this.value)" oninput="handleInput('login',this.name, this.value)" type="password" name="password" class="full" placeholder="Password">
        </div>

        <div>I already have an account. <a href="/developer-life-simulator/register">register</a></div>

        <button type="submit">Login</button>
      </form>

    </card>
  </page-wrapper>

  <?php include('../../components/footer.php') ?>
</body>

</html>