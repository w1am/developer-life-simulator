<?php
function sidebar()
{
  echo <<<DEV
  <div id="info-container">

    <div class="button">
      <div id="content-shop"></div>
      <p>Shop</p>
    </div>

    <div class="button">
      <div id="content-job"></div>
      <p>Jobs</p>
    </div>

  </div>
  DEV;
}

function activeJobs()
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

function balance()
{
  echo '
    <div id="balance">
      <p class="pane-header">Balance</p>
      <div id="balance-amount">0</div>
    </div>
  ';
};

function level()
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

function logs()
{
  echo '
    <div id="logs">
    </div>
  ';
};

function jobs()
{
  echo '
    <div hidden id="menu-job" class="menu">
      <div class="header">
        <p class="title">Jobs</p>
        <button onclick="handleJobClose()">X</button>
      </div>

      <div id="job" class="content"></div>
    </div>
  ';
};

function status()
{
  echo '
    <div id="status">
      <button onclick="resolveSecurityRisk()" id="security-risk-btn" disabled>Fix security risk</button>
    </div>
  ';
};

function shop()
{
  echo <<<DEV
    <div hidden id="menu-shop" class="menu">
      <div class="header">
        <p class="title">Shop</p>
        <button onclick="handleShopClose()">X</button>
      </div>

      <div class="parent">
        <div id="sidebar">
          <div active="true" onclick="setTab('servers')" id="item-servers" class="item">
            Servers
          </div>
          <div active="false" onclick="setTab('developers')" id="item-developers" class="item">
            Developers
          </div>
          <div active="false" onclick="setTab('entertainments')" id="item-entertainments" class="item">
            Entertainments
          </div>
          <div active="false" onclick="setTab('services')" id="item-services" class="item">
            Services
          </div>
        </div>
        <div id="shop" class="content"></div>
      </div>
    </div>
  DEV;
}
