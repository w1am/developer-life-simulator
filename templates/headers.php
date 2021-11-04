<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" href="/developer-life-simulator/assets/favicon.ico">

<?php
function renderHeader($title)
{
  echo <<<DEV
    <link rel="stylesheet" href="/developer-life-simulator/style.css">
    <title> Developer Life | $title </title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" type="text/javascript" ></script>
    <script src="https://kit.fontawesome.com/f2f51db1ed.js" crossorigin="anonymous"></script>

    <script src="/developer-life-simulator/game/scripts/items.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/constants.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/authentication.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/customStorage.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/formatNumber.js" type="text/javascript"></script>

    <script src="/developer-life-simulator/game/scripts/models.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/game/scripts/products.js" type="text/javascript"></script>

    <script src="/developer-life-simulator/common/animateValue.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/game/scripts/utils/clearRect.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/game/scripts/utils/detection.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/game/scripts/utils/relativeCoordinates.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/game/scripts/utils/drawImage.js" type="text/javascript"></script>
  DEV;
};

function renderAuthenticationHeader($title)
{
  echo <<<DEV
    <link rel="stylesheet" href="/developer-life-simulator/style.css">
    <title> Developer Life | $title </title>
    <script src="https://kit.fontawesome.com/f2f51db1ed.js" crossorigin="anonymous"></script>
    <script src="/developer-life-simulator/game/scripts/items.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/constants.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/customStorage.js" type="text/javascript"></script>
    <script src="/developer-life-simulator/common/authentication.js" type="text/javascript"></script>
  DEV;
};
?>