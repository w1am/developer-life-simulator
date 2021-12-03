<?php
function renderBaseHeader($title)
{
  echo <<<DEV
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/developer-life-simulator/assets/favicon.ico">
    <link rel="stylesheet" href="/developer-life-simulator/style.css">
    <title> Developer Life | $title </title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" type="text/javascript" ></script>
    <script src="https://kit.fontawesome.com/f2f51db1ed.js" crossorigin="anonymous"></script>
    <script type="module" src="/developer-life-simulator/common/index.js"></script>
  DEV;
};

function renderHeader()
{
  echo <<<DEV
    <script type="module" src="/developer-life-simulator/game/scripts/items.js"></script>
    <script type="module" src="/developer-life-simulator/game/scripts/account.js"></script>
    <script type="module" src="/developer-life-simulator/game/scripts/onLoad.js"></script>
    <script type="module" src="/developer-life-simulator/game/scripts/models.js"></script>
    <script type="module" src="/developer-life-simulator/game/scripts/products.js"></script>
    <script type="module" src="/developer-life-simulator/game/scripts/utils/index.js"></script>
  DEV;
};

function renderAuthenticationHeader()
{
  echo <<<DEV
    <script type="module" src="/developer-life-simulator/game/scripts/items.js"></script>
  DEV;
};
?>