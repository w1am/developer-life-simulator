<?php
function button($url, $type, $innerText)
{
  echo <<<DEV
    <button class="$type"><a href="$url">$innerText</a></button>
  DEV;
};

function footer()
{
  echo <<<DEV
    <div id="footer" class="space-x-md">
      <ul class="space-y-sm">
        <li> <a href="">Github</a> </li>
        <li> <a href="">Facebook</a> </li>
        <li> <a href="">Instagram</a> </li>
      </ul>

      <ul class="space-y-sm">
        <li> <a href="/developer-life-simulator/tutorial">Tutorial</a> </li>
      </ul>
    </div>
  DEV;
}

function navbar()
{
  echo '<div id="navbar">';
  echo '<a href="/developer-life-simulator" id="logo">';
  echo '<img src="/developer-life-simulator/assets/logo.png" alt="">';
  echo '</a>';

  echo '<ul id="links">';
  $urls = array(
    'Tutorial' => '/developer-life-simulator/tutorial',
    'Leaderboard' => '/developer-life-simulator/leaderboard',
    'Register' => '/developer-life-simulator/authentication/register',
    'Login' => '/developer-life-simulator/authentication/login',
    'Signout' => '/developer-life-simulator/authentication/signout'
  );

  function getClassName($url)
  {
    $classNames = '';

    if ($url == 'Login' || $url == 'Register') {
      $classNames = 'auth';
    } else if ($url == 'Signout') {
      $classNames = 'signout';
    }

    if (isset($_GET['source'])) {
      if ($_GET['source'] === $url) {
        $classNames .= ' active';
      }
    }

    return $classNames;
  }

  foreach ($urls as $url => $link) {
    echo '<li class="link-item ' . getClassName($url) . '"><a href="' . $link . '?source=' . $url . '">' . $url . '</a></li>';
  };

  echo '</ul>';
  echo '</div>';
}

function messageBox($type, $message)
{
  echo <<<DEV
  <div class="message-box $type">
    $message
  </div>
  DEV;
}
