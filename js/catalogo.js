/* Página de inicio / catálogo */
(function () {
  "use strict";
  var LISTA = { id: "catalogo_principal", nombre: "Catálogo principal" };
  var PROMO = { promotion_id: "BIENVENIDA10", promotion_name: "Bienvenida 10%", creative_name: "banner_inicio_bienvenida", creative_slot: "hero_inicio" };
  var fmt = Carrito.fmt;

  /* Grilla de productos */
  var cont = document.getElementById("catalogo");
  cont.innerHTML = PRODUCTOS.map(function (p) {
    return '<a class="card" href="producto.html?id=' + p.id + '" data-id="' + p.id + '">' +
      '<div class="thumb" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')">' + p.sigla + '</div>' +
      '<div class="info"><div class="cat">' + p.categoria + ' · ' + p.tipo + '</div><h3>' + p.nombre + '</h3><div class="precio">' + fmt(p.precio) + '</div></div></a>';
  }).join("");

  /* view_item_list al cargar */
  enviarEvento("view_item_list", {
    item_list_id: LISTA.id, item_list_name: LISTA.nombre,
    items: PRODUCTOS.map(function (p, i) { return Carrito.itemGA(p, 1, i, false); })
  });

  /* select_item antes de navegar */
  cont.addEventListener("click", function (ev) {
    var a = ev.target.closest("a.card");
    if (!a || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button !== 0) return;
    ev.preventDefault();
    var idx = PRODUCTOS.findIndex(function (p) { return p.id === a.dataset.id; });
    enviarEventoYNavegar("select_item", {
      item_list_id: LISTA.id, item_list_name: LISTA.nombre,
      items: [Carrito.itemGA(PRODUCTOS[idx], 1, idx, false)]
    }, a.getAttribute("href"));
  });

  /* Banner del cupón */
  var box = document.getElementById("banner-box");
  var yaAplicado = Carrito.leer().cupon === Carrito.CUPON;
  if (yaAplicado) {
    box.innerHTML = '<div class="banner ok"><div class="k">Cupón activo</div><div class="t">BIENVENIDA10 aplicado: 10 % de descuento</div><a class="c" href="carrito.html">Ver mi carrito</a></div>';
    return;
  }
  box.innerHTML = '<button type="button" class="banner" id="banner-promo"><div class="k">Oferta de bienvenida</div>' +
    '<div class="t">10 % de descuento en tu primera compra</div><div>Usa el cupón BIENVENIDA10 y ahorra en toda la tienda.</div>' +
    '<span class="c">Aplicar cupón BIENVENIDA10</span></button>';
  function itemsPromo() { return PRODUCTOS.slice(0, 3).map(function (p, i) { return Carrito.itemGA(p, 1, i, true); }); }
  enviarEvento("view_promotion", Object.assign({}, PROMO, { items: itemsPromo() }));
  document.getElementById("banner-promo").addEventListener("click", function () {
    Carrito.aplicarCupon(Carrito.CUPON);
    enviarEventoYNavegar("select_promotion", Object.assign({}, PROMO, { items: itemsPromo() }), "carrito.html");
  });
})();
