<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<?php
function renderAuthenticationHeader($title)
{
  return '
    <link rel="stylesheet" href="../../style.css">
    <link rel="icon" href="../../assets/favicon.ico">
  ' . '<title> Developer Life | ' . $title . '</title>';
};

function loadAuthenticationScripts()
{
  return '
    <script src="https://kit.fontawesome.com/f2f51db1ed.js" crossorigin="anonymous"></script>
    <script src="../scripts/index.js" type="text/javascript"></script>
    <script src="../scripts/constants.js" type="text/javascript"></script>
    <script src="../../common/scripts/customStorage.js" type="text/javascript"></script>
    <script src="../../common/scripts/authentication.js" type="text/javascript"></script>
  ';
};
?>