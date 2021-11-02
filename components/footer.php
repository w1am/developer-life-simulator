<?php
function renderFooter()
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
