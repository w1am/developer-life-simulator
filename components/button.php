<?php
function renderButton($url, $type, $innerText)
{
  echo '<button class="' . $type . '"><a href="' . $url . '">' . $innerText . '</a></button>';
};
