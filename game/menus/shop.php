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