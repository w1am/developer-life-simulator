<?php
function renderNavbar()
{
  echo '<div id="navbar">';
  echo '<a href="/developer-life-simulator" id="logo">';
  echo '<img src="/developer-life-simulator/assets/logo.png" alt="">';
  echo '</a>';

  echo '<ul id="links">';
  $urls = array(
    'Tutorial' => '/tutorial',
    'Leaderboard' => '/leaderboard',
    'Register' => '/developer-life-simulator/authentication/register',
    'Login' => '/developer-life-simulator/authentication/login',
    'Signout' => '/developer-life-simulator/authentication/signout'
  );

  function getClassName($url)
  {
    if ($url == 'Login' || $url == 'Register') {
      return 'auth';
    } else if ($url == 'Signout') {
      return 'signout';
    }
  }

  foreach ($urls as $url => $link) {
    echo '<li class="link-item ' . getClassName($url) . '"><a href="' . $link . '">' . $url . '</a></li>';
  };

  echo '</ul>';
  echo '</div>';
}
