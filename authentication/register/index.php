<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include_once('../../templates/headers.php');
  renderBaseHeader('Register');
  renderAuthenticationHeader();
  ?>
</header>

<body>
  <?php
  include('../../templates/common.php');
  navbar();
  ?>

  <page-wrapper>
    <div class="flex center m-y-md">
      <card>
        <h1>Register</h1>

        <form id="registration-form" onsubmit="return handleSubmit(event, 'register')" action="" class="space-y-sm">
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

          <div>I already have an account. <a href="/developer-life-simulator/authentication/login">sign in</a></div>

          <button type="submit">Register</button>
        </form>

      </card>

      <img id="register-image" src="/developer-life-simulator/assets/register_image.png" alt="" srcset="">
    </div>
  </page-wrapper>

  <?php footer() ?>

  <script type="module" src="../scripts/main.js"></script>
</body>

</html>