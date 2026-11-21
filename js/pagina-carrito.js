/* Página del carrito */
(function () {
  "use strict";
  var fmt = Carrito.fmt, box = document.getElementById("carrito"), msgCupon = "";

  function conCupon(extra, c) { return Object.assign({}, extra, c.cupon ? { coupon: c.cupon } : {}); }

  function pintar() {
    var c = Carrito.leer(), L = Carrito.lineas(c), t = Carrito.totales(c);
    if (!L.length) {
      box.innerHTML = '<div class="vacio-c"><p class="sub">Tu carrito está vacío.</p>' +
        (c.cupon ? '<p class="verde">Cupón ' + c.cupon + ' aplicado: se usará cuando agregues productos.</p>' : '') +
        '<a class="btn" href="index.html">Ver catálogo</a></div>';
      return;
    }
    var filas = L.map(function (l) {
      var pu = Carrito.precioUnit(l.p, !!c.cupon);
      return '<div class="linea"><div class="thumb" style="background:linear-gradient(135deg,' + l.p.c1 + ',' + l.p.c2 + ')">' + l.p.sigla + '</div>' +
        '<div><h3>' + l.p.nombre + '</h3><div class="muted">' + l.p.categoria + ' · ' + l.p.id + '</div>' +
        '<div>' + (c.cupon ? '<s class="muted">' + fmt(l.p.precio) + '</s> ' : '') + fmt(pu) + '</div></div>' +
        '<div class="qty"><button type="button" data-a="menos" data-id="' + l.p.id + '" aria-label="Disminuir">−</button><strong>' + l.qty + '</strong><button type="button" data-a="mas" data-id="' + l.p.id + '" aria-label="Aumentar">+</button></div>' +
        '<div><strong>' + fmt(pu * l.qty) + '</strong><br><a href="#" class="muted" data-a="quitar" data-id="' + l.p.id + '">Quitar</a></div></div>';
    }).join("");
    box.innerHTML = '<div class="layout2"><div class="panel">' + filas + '</div><div class="panel"><h3>Resumen</h3>' +
      '<div class="fila"><span>Productos (' + t.unidades + ')</span><span>' + fmt(t.bruto) + '</span></div>' +
      (c.cupon ? '<div class="fila verde"><span>Cupón ' + c.cupon + ' (−10 %)</span><span>−' + fmt(t.descuento) + '</span></div>' : '') +
      '<div class="fila total"><span>Subtotal</span><span>' + fmt(t.neto) + '</span></div>' +
      '<p class="muted">El envío se calcula en el checkout.</p>' +
      '<label class="campo" for="cupon-in">Cupón de descuento</label><div class="cupon"><input type="text" id="cupon-in" placeholder="Ej. BIENVENIDA10"><button class="btn sec" id="cupon-ok" type="button">Aplicar</button></div>' +
      '<div id="cupon-msg" class="muted" style="margin-top:8px">' + (c.cupon ? '<span class="verde">Cupón ' + c.cupon + ' aplicado.</span>' : msgCupon) + '</div>' +
      '<a class="btn grande" href="checkout.html">Ir al checkout</a></div></div>';
  }

  /* view_cart al abrir con productos */
  (function () {
    var c = Carrito.leer();
    if (Carrito.lineas(c).length) enviarEvento("view_cart", conCupon({ value: Carrito.totales(c).neto, items: Carrito.itemsGA(c) }, c));
  })();

  box.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-a],#cupon-ok");
    if (!el) return;
    if (el.id === "cupon-ok") {
      var ok = Carrito.aplicarCupon(document.getElementById("cupon-in").value);
      msgCupon = ok ? "" : '<span class="rojo">Cupón no válido.</span>';
      pintar(); return;
    }
    ev.preventDefault();
    var c = Carrito.leer(), id = el.dataset.id, a = el.dataset.a;
    var l = Carrito.lineas(c).find(function (x) { return x.p.id === id; });
    if (!l) return;
    var idx = Carrito.lineas(c).indexOf(l), cup = !!c.cupon;
    if (a === "mas") {
      Carrito.agregar(id, 1);
      var it = Carrito.itemGA(l.p, 1, idx, cup);
      enviarEvento("add_to_cart", conCupon({ value: it.price, items: [it] }, c));
    } else {
      var n = a === "quitar" ? l.qty : 1;
      var it2 = Carrito.itemGA(l.p, n, idx, cup);
      Carrito.quitar(id, n);
      enviarEvento("remove_from_cart", conCupon({ value: it2.price * n, items: [it2] }, c));
    }
    pintar();
  });
  pintar();
})();
