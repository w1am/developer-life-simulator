<!DOCTYPE html>
<html lang="en">

<header>
  <?php
  include('../templates/headers.php');
  renderBaseHeader("Leaderboard");
  ?>
</header>

<body>
  <flex-wrapper>
    <?php
    include('../templates/common.php');
    navbar();
    ?>

    <page-wrapper>
      <h1>Leaderboard</h1>
      <br>
      <h3 style="color: #357797"><i class="fas fa-info-circle"></i> Networth = Total assets - liabilities</h3>
      <br>
      <br>
      <br>
      <div id="leaderboard">
        <table>
          <thead>
            <tr>
              <th></th>
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

    <script type="module" src="./leaderboard.js" type="text/javascript"></script>

    <?php footer() ?>
  </flex-wrapper>
</body>