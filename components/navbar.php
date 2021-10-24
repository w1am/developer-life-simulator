<div id="navbar">
  <a href="/developer-life-simulator" id="logo">
    <img src="/developer-life-simulator/assets/logo.png" alt="">
  </a>

  <ul id="links">
    <?php
    $urls = array(
      'Tutorial' => '/tutorial',
      'Leaderboard' => '/leaderboard',
      'Register' => '/developer-life-simulator/register',
      'Login' => '/developer-life-simulator/login'
    );

    foreach ($urls as $url => $link) {
      echo '<li class="link-item"><a href="' . $link . '">' . $url . '</a></li>';
    }
    ?>
  </ul>
</div>