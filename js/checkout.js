/* Checkout en dos pasos: 1) Envío  2) Pago simulado. No se guardan datos personales. */
(function () {
  "use strict";
  var fmt = Carrito.fmt, box = document.getElementById("checkout");
  var PAISES = ["Colombia", "México", "Perú", "Chile", "Argentina", "Ecuador", "Estados Unidos", "España"];
  var PAGOS = ["Tarjeta de crédito", "PSE", "Nequi", "PayPal"];
  var c = Carrito.leer();

  if (!Carrito.lineas(c).length) {
    box.innerHTML = '<div class="vacio-c"><p class="sub">No tienes productos en el carrito.</p><a class="btn" href="index.html">Ir al catálogo</a></div>';
    return;
  }
  function base(extra) { return Object.assign({ value: Carrito.totales(c).neto }, c.cupon ? { coupon: c.cupon } : {}, extra, { items: Carrito.itemsGA(c) }); }

  /* begin_checkout al abrir */
  enviarEvento("begin_checkout", base({}));

  var envio = null; // se llena en el paso 1
  box.innerHTML = '<div class="pasos"><span id="p1" class="on">1 · Envío</span><span id="p2">2 · Pago simulado</span></div>' +
    '<div class="layout2"><div class="panel" id="paso">' +
    '<div id="paso1"><div class="aviso">Usa un nombre inventado. No ingreses datos reales: este formulario no los guarda ni los envía.</div>' +
    '<label class="campo" for="nombre">Nombre (ficticio)</label><input type="text" id="nombre" placeholder="Ej. Cliente Prueba" autocomplete="off">' +
    '<label class="campo" for="pais">País de envío</label><select id="pais">' + PAISES.map(function (p) { return "<option>" + p + "</option>"; }).join("") + '</select>' +
    '<label class="campo">Servicio de envío</label><div id="servicios"></div>' +
    '<div id="err1" class="rojo muted"></div><button class="btn grande" id="continuar" type="button">Continuar al pago</button></div>' +
    '<div id="paso2" hidden><h3>Método de pago</h3><p class="muted">Simulación: no se piden ni se guardan datos de tarjeta.</p>' +
    PAGOS.map(function (m, i) { return '<label class="opcion"><input type="radio" name="pago" value="' + m + '"' + (i === 0 ? " checked" : "") + '> ' + m + '</label>'; }).join("") +
    '<button class="btn grande" id="pagar" type="button">Pagar (simulado)</button><p class="muted" style="text-align:center"><a href="#" id="volver">← Volver a envío</a></p></div>' +
    '</div><div class="panel" id="resumen"></div></div>';

  function servicioSel() { var r = box.querySelector('input[name="serv"]:checked'); return r ? r.value : "Estándar"; }
  function calc() { return Carrito.calcularEnvio(document.getElementById("pais").value, servicioSel(), Carrito.totales(c).neto); }

  function pintarServicios() {
    var pais = document.getElementById("pais").value, sel = servicioSel(), t = Carrito.totales(c).neto;
    document.getElementById("servicios").innerHTML = ["Estándar", "Express"].map(function (s) {
      var e = Carrito.calcularEnvio(pais, s, t);
      return '<label class="opcion"><input type="radio" name="serv" value="' + s + '"' + (s === sel ? " checked" : "") + '> ' + e.tipo + ' · ' + s +
        '<span class="p">' + (e.gratis ? "Gratis" : fmt(e.costo)) + '</span></label>';
    }).join("");
    pintarResumen();
  }
  function pintarResumen() {
    var t = Carrito.totales(c), e = calc();
    document.getElementById("resumen").innerHTML = '<h3>Resumen</h3>' +
      Carrito.lineas(c).map(function (l) { return '<div class="fila"><span>' + l.p.nombre + ' × ' + l.qty + '</span><span>' + fmt(Carrito.precioUnit(l.p, !!c.cupon) * l.qty) + '</span></div>'; }).join("") +
      (c.cupon ? '<div class="fila verde"><span>Cupón ' + c.cupon + '</span><span>−' + fmt(t.descuento) + '</span></div>' : '') +
      '<div class="fila"><span>Envío (' + e.tier + ')</span><span>' + (e.gratis ? "Gratis" : fmt(e.costo)) + '</span></div>' +
      '<div class="fila total"><span>Total</span><span>' + fmt(t.neto + e.costo) + '</span></div>' +
      '<p class="muted">Envío estándar nacional gratis desde ' + fmt(Carrito.UMBRAL_ENVIO_GRATIS) + ' en productos.</p>';
  }
  document.getElementById("pais").addEventListener("change", pintarServicios);
  document.getElementById("servicios").addEventListener("change", pintarResumen);
  pintarServicios();

  /* Paso 1 -> add_shipping_info */
  document.getElementById("continuar").addEventListener("click", function () {
    if (!document.getElementById("nombre").value.trim()) {
      document.getElementById("err1").textContent = "Escribe un nombre ficticio para continuar."; return;
    }
    envio = calc();
    envio.pais = document.getElementById("pais").value;
    envio.servicio = servicioSel();
    establecerPropiedadesUsuario({ tipo_cliente: envio.tipo });
    enviarEvento("add_shipping_info", base({ shipping_tier: envio.tier }));
    document.getElementById("paso1").hidden = true;
    document.getElementById("paso2").hidden = false;
    document.getElementById("p1").classList.remove("on");
    document.getElementById("p2").classList.add("on");
  });
  document.getElementById("volver").addEventListener("click", function (ev) {
    ev.preventDefault();
    document.getElementById("paso2").hidden = true;
    document.getElementById("paso1").hidden = false;
    document.getElementById("p2").classList.remove("on");
    document.getElementById("p1").classList.add("on");
  });

  /* Paso 2 -> add_payment_info y navegación a gracias.html */
  document.getElementById("pagar").addEventListener("click", function () {
    this.disabled = true;
    var pago = box.querySelector('input[name="pago"]:checked').value;
    var t = Carrito.totales(c);
    var pedido = {
      transaction_id: "CRV-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
      affiliation: "Cervo Online Store",
      value: t.neto, shipping: envio.costo, coupon: c.cupon || null,
      tipo_cliente: envio.tipo, pais: envio.pais, servicio: envio.servicio, pago: pago,
      items: Carrito.itemsGA(c), enviado: false
    };
    try { sessionStorage.setItem("cervo_pedido", JSON.stringify(pedido)); } catch (e) {}
    enviarEventoYNavegar("add_payment_info", base({ payment_type: pago }), "gracias.html");
  });
})();
