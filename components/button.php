<?php
function renderButton($url, $type, $innerText)
{
  return '<button class="' . $type . '"><a href="' . $url . '">' . $innerText . '</a></button>';
};
