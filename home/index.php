<!DOCTYPE html>
<html lang="en">

<?php
include('../shared/header.php');
print renderHeader("Home");
?>

<body>
  <flex-wrapper>
    <?php include('../components/navbar.php') ?>


    <page-wrapper>
      <?php
      include('../components/button.php');
      print renderButton("/developer-life-simulator/game", "success", "Play Game");
      ?>
    </page-wrapper>

    <?php include('../components/footer.php') ?>
  </flex-wrapper>
</body>