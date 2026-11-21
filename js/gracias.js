/* Confirmación: envía purchase una sola vez por pedido. */
(function () {
  "use strict";
  var fmt = Carrito.fmt, box = document.getElementById("gracias"), ped = null;
  try { ped = JSON.parse(sessionStorage.getItem("cervo_pedido")); } catch (e) {}

  if (!ped) {
    box.innerHTML = '<div class="vacio-c"><h1>No hay un pedido reciente</h1><p class="sub">Completa una compra simulada para ver esta página.</p><a class="btn" href="index.html">Ir al catálogo</a></div>';
    return;
  }
  var nota;
  if (ped.enviado) {
    nota = '<div class="aviso">Este pedido ya fue registrado en Analytics. Al recargar la página no se envía un segundo <b>purchase</b>.</div>';
  } else {
    establecerPropiedadesUsuario({ tipo_cliente: ped.tipo_cliente });
    var p = { transaction_id: ped.transaction_id, affiliation: ped.affiliation, value: ped.value, shipping: ped.shipping, tipo_cliente: ped.tipo_cliente, items: ped.items };
    if (ped.coupon) p.coupon = ped.coupon;
    enviarEvento("purchase", p);
    ped.enviado = true;
    try { sessionStorage.setItem("cervo_pedido", JSON.stringify(ped)); } catch (e) {}
    Carrito.vaciar();
    nota = '<div class="toast">Evento <b>purchase</b> registrado.</div>';
  }
  box.innerHTML = '<div class="hero"><h1>¡Gracias por tu compra!</h1><p class="sub">Pedido ' + ped.transaction_id + ' · Simulación académica</p></div>' +
    '<div class="panel" style="max-width:560px;margin:0 auto"><h3>Resumen del pedido</h3>' +
    ped.items.map(function (i) { return '<div class="fila"><span>' + i.item_name + ' × ' + i.quantity + '</span><span>' + fmt(i.price * i.quantity) + '</span></div>'; }).join("") +
    (ped.coupon ? '<div class="fila verde"><span>Cupón ' + ped.coupon + '</span><span>aplicado</span></div>' : '') +
    '<div class="fila"><span>Envío ' + ped.tipo_cliente + ' · ' + ped.servicio + ' (' + ped.pais + ')</span><span>' + (ped.shipping ? fmt(ped.shipping) : "Gratis") + '</span></div>' +
    '<div class="fila"><span>Pago</span><span>' + ped.pago + ' (simulado)</span></div>' +
    '<div class="fila total"><span>Total</span><span>' + fmt(ped.value + ped.shipping) + '</span></div>' + nota +
    '<a class="btn grande" href="index.html">Seguir comprando</a></div>';
})();
