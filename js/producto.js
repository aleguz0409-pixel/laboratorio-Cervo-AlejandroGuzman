/* Detalle de producto: producto.html?id=CRV-001 */
(function () {
  "use strict";
  var fmt = Carrito.fmt;
  var id = new URLSearchParams(location.search).get("id");
  var p = obtenerProducto(id);
  var box = document.getElementById("detalle");
  if (!p) {
    box.innerHTML = '<div class="vacio-c"><h1>Producto no encontrado</h1><p class="sub">Revisa el enlace o vuelve al catálogo.</p><a class="btn" href="index.html">Ir al catálogo</a></div>';
    return;
  }
  document.title = "Cervo · " + p.nombre;
  box.innerHTML = '<div class="detalle"><div class="thumb" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')">' + p.sigla + '</div>' +
    '<div><div class="cat">' + p.categoria + ' · ' + p.tipo + ' · ' + p.id + '</div><h1>' + p.nombre + '</h1>' +
    '<div class="precio" style="font-size:26px">' + fmt(p.precio) + '</div><p class="sub" style="font-size:17px;margin-top:16px">' + p.descripcion + '</p>' +
    '<div class="qty"><button type="button" id="menos" aria-label="Menos">−</button><strong id="cant">1</strong><button type="button" id="mas" aria-label="Más">+</button></div>' +
    '<div style="margin-top:20px"><button class="btn" id="agregar" type="button">Agregar al carrito</button></div>' +
    '<div id="msg"></div><p class="muted" style="margin-top:20px"><a href="index.html">← Volver al catálogo</a></p></div></div>';

  enviarEvento("view_item", { value: p.precio, items: [Carrito.itemGA(p, 1, 0, false)] });

  var n = 1, cant = document.getElementById("cant");
  document.getElementById("menos").onclick = function () { n = Math.max(1, n - 1); cant.textContent = n; };
  document.getElementById("mas").onclick = function () { n = Math.min(10, n + 1); cant.textContent = n; };
  document.getElementById("agregar").onclick = function () {
    var cupon = !!Carrito.leer().cupon;
    var it = Carrito.itemGA(p, n, 0, cupon);
    Carrito.agregar(p.id, n);
    enviarEvento("add_to_cart", Object.assign({ value: it.price * n, items: [it] }, cupon ? { coupon: Carrito.CUPON } : {}));
    document.getElementById("msg").innerHTML = '<div class="toast">Agregaste ' + n + ' × ' + p.nombre + '. <a href="carrito.html">Ir al carrito</a></div>';
  };
})();
