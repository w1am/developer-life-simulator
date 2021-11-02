<?php
function renderActiveJobs()
{
  echo '
    <div id="active-jobs">
      <div class="header">
        <p class="title">Active Jobs</p>
      </div>
      <div id="active-jobs-content"></div>
    </div>
  ';
};

function renderBalance()
{
  echo '
    <div id="balance">
      <p class="pane-header">Balance</p>
      <div id="balance-amount">0</div>
    </div>
  ';
};

function renderLevel()
{
  echo '
    <div id="level">
      <p class="pane-header">Level</p>
      <div id="level-progress">
        <div id="level-progress-bar">
        </div>
      </div>
    </div>
  ';
};

function renderLogs()
{
  echo '
    <div id="logs">
    </div>
  ';
};
