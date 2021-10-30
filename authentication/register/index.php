<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../shared/authentication.php');

  print renderAuthenticationHeader('Register');
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
      <h1>Register</h1>

      <form id="registration-form" onsubmit="event.preventDefault();handleSubmit('register')" action="" class="space-y-sm">
        <div>
          <label for="email">Email Address</label>
          <input onblur="handleInput('register',this.name, this.value)" oninput="handleInput('register',this.name, this.value)" type="email" name="email" class="full" placeholder="Email Address">
        </div>

        <div class="flex space-x-xs">
          <div>
            <label for="firstName">First Name</label>
            <input onblur="handleInput('register',this.name, this.value)" oninput="handleInput('register',this.name, this.value)" type="text" name="firstName" class="full" placeholder="First Name">
          </div>

          <div>
            <label for="lastName">Last Name</label>
            <input onblur="handleInput('register',this.name, this.value)" oninput="handleInput('register',this.name, this.value)" type="text" name="lastName" class="full" placeholder="Last Name">
          </div>
        </div>

        <div>
          <label for="password">Password</label>
          <input onblur="handleInput('register',this.name, this.value)" oninput="handleInput('register',this.name, this.value)" type="password" name="password" class="full" placeholder="Password">
        </div>

        <div>
          <label for="confirmPassword">Confirm Password</label>
          <input onblur="handleInput('register',this.name, this.value)" oninput="handleInput('register',this.name, this.value)" type="password" name="confirmPassword" class="full" placeholder="Confirm Password">
        </div>

        <div>I already have an account. <a href="/developer-life-simulator/login">sign in</a></div>

        <button type="submit">Register</button>
      </form>

    </card>
  </page-wrapper>

  <?php include('../../components/footer.php') ?>
</body>

</html>