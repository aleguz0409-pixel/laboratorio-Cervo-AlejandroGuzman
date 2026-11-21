/* GA4 + Monitor de eventos (ayuda didáctica).
   Funciones públicas:
     enviarEvento(nombre, params)
     enviarEventoYNavegar(nombre, params, url)
     establecerPropiedadesUsuario(obj)                                   */
(function () {
  "use strict";
  var CFG = window.TIENDA_CONFIG || {};
  var ID = String(CFG.GA_MEASUREMENT_ID || "").trim();
  var VALIDO = /^G-[A-Z0-9]{4,}$/i.test(ID) && ID !== "G-XXXXXXXXXX";
  var DEBUG = CFG.DEBUG_MODE === true;

  /* ---------- Carga de gtag.js (solo con ID válido) ---------- */
  window.dataLayer = window.dataLayer || [];
  if (VALIDO) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    if (DEBUG) window.gtag("config", ID, { debug_mode: true });
    else window.gtag("config", ID);
  } else {
    window.gtag = function () {}; // sin ID: no se envía nada
  }

  /* ---------- Registro para el monitor ---------- */
  var LK = "cervo_log";
  function leerLog() { try { return JSON.parse(sessionStorage.getItem(LK)) || []; } catch (e) { return []; } }
  function money(n) { return "$" + Number(n).toLocaleString("es-CO"); }
  function resumen(n, p) {
    if (n === "page_view") return p.page_title || p.page_location || "";
    var partes = [];
    if (p.promotion_id) partes.push(p.promotion_id);
    if (p.item_list_id) partes.push(p.item_list_id);
    if (p.items && p.items.length) {
      var nom = p.items.slice(0, 2).map(function (i) { return i.item_name + " ×" + i.quantity; }).join(", ");
      if (p.items.length > 2) nom += " +" + (p.items.length - 2) + " más";
      partes.push(nom);
    }
    if (p.shipping_tier) partes.push(p.shipping_tier);
    if (p.payment_type) partes.push(p.payment_type);
    if (p.transaction_id) partes.push(p.transaction_id);
    if (p.value != null) partes.push("value " + money(p.value));
    if (p.shipping != null) partes.push("envío " + money(p.shipping));
    if (p.coupon) partes.push("cupón " + p.coupon);
    if (p.tipo_cliente) partes.push(p.tipo_cliente);
    return partes.join(" · ");
  }
  function registrar(n, p, enviado) {
    var l = leerLog();
    l.push({ h: new Date().toLocaleTimeString("es-CO", { hour12: false }), n: n, r: resumen(n, p), e: enviado, d: p });
    if (l.length > 40) l = l.slice(-40);
    try { sessionStorage.setItem(LK, JSON.stringify(l)); } catch (e) {}
    pintar();
  }

  /* ---------- API pública ---------- */
  function limpiar(params) {
    var p = Object.assign({}, params || {});
    delete p.event_callback; delete p.event_timeout;
    if (!p.currency) p.currency = "COP";
    return p;
  }
  function enviarEvento(nombre, params) {
    var p = limpiar(params);
    if (VALIDO) window.gtag("event", nombre, p);
    registrar(nombre, p, VALIDO);
  }
  function enviarEventoYNavegar(nombre, params, url) {
    var p = limpiar(params), ido = false;
    function ir() { if (ido) return; ido = true; window.location.href = url; }
    registrar(nombre, p, VALIDO);
    if (!VALIDO) { ir(); return; }
    var conCb = Object.assign({}, p, { event_callback: ir, event_timeout: 1000 });
    window.gtag("event", nombre, conCb);
    setTimeout(ir, 1200); // respaldo
  }
  function establecerPropiedadesUsuario(obj) {
    if (VALIDO) window.gtag("set", "user_properties", obj);
  }
  window.enviarEvento = enviarEvento;
  window.enviarEventoYNavegar = enviarEventoYNavegar;
  window.establecerPropiedadesUsuario = establecerPropiedadesUsuario;
  window.ANALYTICS_ACTIVO = VALIDO;

  /* ---------- Origen de la visita (primera página de la sesión) ---------- */
  function origen() {
    var k = "cervo_origen", v = null;
    try { v = sessionStorage.getItem(k); } catch (e) {}
    if (v) return v;
    var q = new URLSearchParams(location.search);
    var src = q.get("utm_source"), med = q.get("utm_medium"), cam = q.get("utm_campaign");
    v = (src || med || cam) ? (src || "(none)") + " / " + (med || "(none)") + " · " + (cam || "(none)") : "directo (sin UTM)";
    try { sessionStorage.setItem(k, v); } catch (e) {}
    return v;
  }

  /* ---------- Panel monitor ---------- */
  var OK = "cervo_monitor_oculto";
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pintar() {
    var ul = document.getElementById("mon-lista");
    if (!ul) return;
    var l = leerLog().slice(-12).reverse();
    ul.innerHTML = l.length ? l.map(function (e) {
      return '<li class="' + (e.e ? "" : "local") + '"><details><summary><span class="h">' + e.h + '</span> <b>' + esc(e.n) + '</b>' +
        (e.e ? "" : ' <i>solo local</i>') + '<div class="r">' + esc(e.r) + '</div></summary><pre>' + esc(JSON.stringify(e.d, null, 1)) + '</pre></details></li>';
    }).join("") : '<li class="vacio">Aún no hay eventos.</li>';
  }
  function borrarCookiesGA() {
    var host = location.hostname, partes = host.split("."), doms = [undefined, host, "." + host];
    for (var i = 1; i < partes.length; i++) { var d = partes.slice(i).join("."); doms.push(d, "." + d); }
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (/^_ga/.test(n)) doms.forEach(function (d) {
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "") + "; SameSite=Lax";
      });
    });
  }
  function aplicarEstadoPanel(oculto) {
    var m = document.getElementById("cervo-monitor");
    m.classList.toggle("oculto", oculto);
    document.body.classList.toggle("mon-oculto", oculto);
    document.getElementById("mon-toggle").textContent = oculto ? "Mostrar" : "Ocultar";
  }
  function crearMonitor() {
    if (document.getElementById("cervo-monitor")) return;
    var estado = VALIDO
      ? '<div class="mon-estado ok">Conectado a ' + esc(ID) + (DEBUG ? " · modo depuración" : "") + "</div>"
      : '<div class="mon-estado error">Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js.</div>';
    var a = document.createElement("aside");
    a.id = "cervo-monitor";
    a.innerHTML = '<div class="mon-head"><strong>Monitor de eventos</strong><button id="mon-toggle" type="button">Ocultar</button></div>' +
      '<div class="mon-body">' + estado +
      '<div class="mon-et">Origen de la visita</div><div class="mon-origen" id="mon-origen"></div>' +
      '<div class="mon-et">Últimos 12 eventos</div><ol id="mon-lista"></ol>' +
      '<button id="mon-reset" type="button">Simular nuevo visitante</button></div>';
    document.body.appendChild(a);
    document.body.classList.add("con-monitor");
    document.getElementById("mon-origen").textContent = origen();
    var oculto = false; try { oculto = localStorage.getItem(OK) === "1"; } catch (e) {}
    aplicarEstadoPanel(oculto);
    document.getElementById("mon-toggle").addEventListener("click", function () {
      var o = !a.classList.contains("oculto");
      try { localStorage.setItem(OK, o ? "1" : "0"); } catch (e) {}
      aplicarEstadoPanel(o);
    });
    document.getElementById("mon-reset").addEventListener("click", function () {
      borrarCookiesGA();
      try { localStorage.removeItem("cervo_carrito"); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
      window.location.href = "index.html";
    });
    pintar();
    registrar("page_view", { page_title: document.title, page_location: location.href }, VALIDO);
  }
  if (document.body) crearMonitor(); else document.addEventListener("DOMContentLoaded", crearMonitor);
})();
