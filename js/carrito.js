/* Biblioteca del carrito (localStorage), cupón, envío y construcción de ítems GA4. */
(function () {
  "use strict";
  var KEY = "cervo_carrito";
  var CUPON = "BIENVENIDA10";
  var DESCUENTO = 0.10;
  var UMBRAL_ENVIO_GRATIS = 150000;
  var TARIFAS = {
    "Nacional|Estándar": 12000, "Nacional|Express": 25000,
    "Internacional|Estándar": 95000, "Internacional|Express": 160000
  };

  function fmt(n) { return "$" + Number(n).toLocaleString("es-CO") + " COP"; }

  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && Array.isArray(d.items)) return d;
    } catch (e) {}
    return { items: [], cupon: null };
  }
  function guardar(c) {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    actualizarBadge();
  }
  function agregar(id, n) {
    var c = leer(), it = c.items.find(function (i) { return i.id === id; });
    if (it) it.qty += n; else c.items.push({ id: id, qty: n });
    guardar(c);
  }
  function quitar(id, n) { // devuelve las unidades realmente quitadas
    var c = leer(), it = c.items.find(function (i) { return i.id === id; });
    if (!it) return 0;
    var q = Math.min(n, it.qty);
    it.qty -= q;
    if (it.qty <= 0) c.items = c.items.filter(function (i) { return i.id !== id; });
    guardar(c);
    return q;
  }
  function aplicarCupon(codigo) {
    if (String(codigo || "").trim().toUpperCase() === CUPON) {
      var c = leer(); c.cupon = CUPON; guardar(c); return true;
    }
    return false;
  }
  function quitarCupon() { var c = leer(); c.cupon = null; guardar(c); }
  function vaciar() { guardar({ items: [], cupon: null }); }

  function precioUnit(p, conCupon) { return conCupon ? Math.round(p.precio * (1 - DESCUENTO)) : p.precio; }

  /* Ítem con el formato exacto del contrato de medición. */
  function itemGA(p, qty, index, conCupon) {
    var it = {
      item_id: p.id, item_name: p.nombre, item_brand: window.MARCA,
      item_category: p.categoria, price: precioUnit(p, conCupon),
      quantity: qty, index: index
    };
    if (conCupon) { it.discount = p.precio - it.price; it.coupon = CUPON; }
    return it;
  }

  function lineas(c) {
    c = c || leer();
    return c.items.map(function (i) { return { p: window.obtenerProducto(i.id), qty: i.qty }; })
      .filter(function (l) { return l.p; });
  }
  function itemsGA(c) {
    c = c || leer();
    return lineas(c).map(function (l, idx) { return itemGA(l.p, l.qty, idx, !!c.cupon); });
  }
  function totales(c) {
    c = c || leer();
    var bruto = 0, neto = 0, unidades = 0;
    lineas(c).forEach(function (l) {
      bruto += l.p.precio * l.qty;
      neto += precioUnit(l.p, !!c.cupon) * l.qty;
      unidades += l.qty;
    });
    return { bruto: bruto, neto: neto, descuento: bruto - neto, unidades: unidades };
  }

  function calcularEnvio(pais, servicio, neto) {
    var tipo = pais === "Colombia" ? "Nacional" : "Internacional";
    var costo = TARIFAS[tipo + "|" + servicio];
    var gratis = tipo === "Nacional" && servicio === "Estándar" && neto >= UMBRAL_ENVIO_GRATIS;
    return { tipo: tipo, tier: tipo + " - " + servicio, costo: gratis ? 0 : costo, gratis: gratis };
  }

  function actualizarBadge() {
    var el = document.getElementById("cart-count");
    if (el) el.textContent = totales().unidades;
  }
  document.addEventListener("DOMContentLoaded", actualizarBadge);
  actualizarBadge();

  window.Carrito = {
    CUPON: CUPON, DESCUENTO: DESCUENTO, UMBRAL_ENVIO_GRATIS: UMBRAL_ENVIO_GRATIS,
    fmt: fmt, leer: leer, guardar: guardar, agregar: agregar, quitar: quitar,
    aplicarCupon: aplicarCupon, quitarCupon: quitarCupon, vaciar: vaciar,
    precioUnit: precioUnit, itemGA: itemGA, lineas: lineas, itemsGA: itemsGA,
    totales: totales, calcularEnvio: calcularEnvio, actualizarBadge: actualizarBadge
  };
})();
