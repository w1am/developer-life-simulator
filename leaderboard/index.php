<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include('../shared/header.php');
  renderHeader("Leaderboard");
  loadCustomStorage();
  loadFormatters();
  ?>
</header>

<body>
  <flex-wrapper>
    <?php
    include('../components/navbar.php');
    renderNavbar();
    ?>


    <page-wrapper>
      <h1>Leaderboard</h1>
      <br>
      <div id="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employees</th>
              <th>Level</th>
              <th>Net worth</th>
            </tr>
          </thead>
          <tbody id="leaderboard-items">
          </tbody>
        </table>
      </div>
    </page-wrapper>

    <script src="./scripts/leaderboard.js" type="text/javascript"></script>

    <?php
    include('../components/footer.php');
    renderFooter();
    ?>
  </flex-wrapper>
</body>