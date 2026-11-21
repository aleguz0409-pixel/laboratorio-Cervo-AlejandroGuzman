/* ============================================================
   CONFIGURACIÓN DE LA TIENDA CERVO  (único archivo que debes editar)
   ------------------------------------------------------------
   1) En Google Analytics 4 ve a: Administrar > Flujos de datos >
      tu flujo web > "ID de medición". Tiene la forma G-AB12CD34EF.
   2) Pega ese ID dentro de las comillas de GA_MEASUREMENT_ID,
      reemplazando G-XXXXXXXXXX.
   3) Mientras el ID sea G-XXXXXXXXXX NO se carga Google Analytics:
      los eventos solo se ven en el Monitor de eventos (panel derecho).
   4) DEBUG_MODE: true  -> los eventos aparecen en GA4 > DebugView.
      Pon false cuando termines las pruebas.
   ============================================================ */
window.TIENDA_CONFIG = {
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX", // <- pega aquí tu ID de medición
  DEBUG_MODE: true                   // true = modo depuración (DebugView)
};
