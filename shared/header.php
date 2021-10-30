<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="../style.css">
<link rel="icon" href="../assets/favicon.ico">

<?php
function renderHeader($title)
{
  return '
    <link rel="stylesheet" href="../style.css">
    <link rel="icon" href="../assets/favicon.ico">
  ' . '<title> Developer Life | ' . $title . '</title>';
};

function checkAuthenticationStatus()
{
  return '<script src="../common/scripts/authentication.js" type="text/javascript"></script>';
};

function loadGameScripts()
{
  return '
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"
      type="text/javascript"
    ></script>
    <script src="./scripts/game/items.js" type="text/javascript"></script>
    <script src="./scripts/game/constants.js" type="text/javascript"></script>
    <script src="./scripts/game/objects.js" type="text/javascript"></script>
    <script src="./scripts/game/customStorage.js" type="text/javascript"></script>
    <script src="./scripts/game/products.js" type="text/javascript"></script>
    <script src="../authentication/scripts/constants.js" type="text/javascript"></script>

    <!-- utils -->
    <script src="./scripts/utils/animateValue.js" type="text/javascript"></script>
    <script src="./scripts/utils/clearRect.js" type="text/javascript"></script>
    <script src="./scripts/utils/detection.js" type="text/javascript"></script>
    <script
      src="./scripts/utils/relativeCoordinates.js"
      type="text/javascript"
    ></script>
    <script src="./scripts/utils/drawImage.js" type="text/javascript"></script>
  ';
};
?>