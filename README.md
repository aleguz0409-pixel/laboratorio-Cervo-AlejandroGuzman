# Cervo · Tienda ficticia para el laboratorio de GA4

Tienda en línea **ficticia** de ropa deportiva (hombre y mujer) para el laboratorio de Google Analytics 4 del Diplomado en E-commerce y Negocios Internacionales Digitales.
Solo HTML, CSS y JavaScript puros: sin servidor, sin base de datos, sin npm y **sin pagos reales**.

## 1. Configura tu ID de medición
Abre `js/config.js` (es el único archivo que debes editar) y reemplaza `G-XXXXXXXXXX` por tu ID de medición de GA4
(GA4 → Administrar → Flujos de datos → tu flujo web → *ID de medición*).

```js
window.TIENDA_CONFIG = { GA_MEASUREMENT_ID: "G-AB12CD34EF", DEBUG_MODE: true };
```
- Con el ID marcador `G-XXXXXXXXXX` **no se carga gtag.js** y el monitor muestra un aviso rojo.
- `DEBUG_MODE: true` envía `debug_mode` y los eventos aparecen en **Administrar → DebugView**. Cuando termines, pon `false`.

## 2. Estructura
```
index.html  producto.html?id=CRV-001  carrito.html  checkout.html  gracias.html
css/estilos.css
js/config.js  productos.js  carrito.js  analytics.js
js/catalogo.js  producto.js  pagina-carrito.js  checkout.js  gracias.js
```

## 3. Flujo de la tienda
1. **Inicio:** catálogo de 8 productos y banner con el cupón `BIENVENIDA10` (10 %).
2. **Detalle:** agregar al carrito (1 a 10 unidades).
3. **Carrito:** aumentar, disminuir o quitar productos; aplicar el cupón escribiéndolo o desde el banner.
4. **Checkout paso 1 (Envío):** nombre ficticio, país y servicio Estándar/Express.
   Tarifas COP: Nacional Estándar 12.000 · Nacional Express 25.000 · Internacional Estándar 95.000 · Internacional Express 160.000.
   Nacional Estándar es gratis desde $150.000 en productos (se evalúa sobre el subtotal ya con descuento).
5. **Checkout paso 2 (Pago simulado):** Tarjeta de crédito, PSE, Nequi o PayPal. No se piden datos de tarjeta, correo, teléfono ni documento.
6. **Gracias:** envía `purchase` una sola vez por pedido.

## 4. Eventos de GA4 (contrato de medición)
Todos llevan `currency: "COP"` y los ítems incluyen `item_id, item_name, item_brand, item_category, price, quantity, index`.
Con cupón: `price` = precio unitario con descuento, más `discount` (por unidad) y `coupon`.

| Evento | Cuándo se envía |
|---|---|
| `view_item_list` | Al cargar el catálogo (`catalogo_principal`) |
| `view_promotion` | Al mostrarse el banner del cupón |
| `select_promotion` | Clic en el banner (aplica el cupón y va al carrito) |
| `select_item` | Clic en un producto del catálogo, antes de navegar |
| `view_item` | Al abrir el detalle |
| `add_to_cart` | Al agregar o aumentar unidades |
| `remove_from_cart` | Al quitar o disminuir unidades |
| `view_cart` | Al abrir el carrito con productos |
| `begin_checkout` | Al abrir `checkout.html` |
| `add_shipping_info` | Clic en "Continuar al pago" (`shipping_tier`) |
| `add_payment_info` | Clic en "Pagar (simulado)" (`payment_type`) |
| `purchase` | Al cargar `gracias.html` (una sola vez por pedido) |

Notas:
- `view_item_list`, `select_item` y `view_item` usan el precio de lista; el cupón se refleja desde `add_to_cart`.
- `value` de `purchase` = suma de `price × quantity` de los ítems (sin envío); el envío va en `shipping`.
- `tipo_cliente` ("Nacional" o "Internacional") se envía como propiedad de usuario (`gtag('set','user_properties')`) y como parámetro de `purchase`.
  Para verlo en informes, regístralo en **Administrar → Definiciones personalizadas** (como dimensión de usuario y/o de evento).
- El pedido se guarda en `sessionStorage` antes de ir a `gracias.html` y se marca como enviado tras `purchase`: recargar no lo repite.

## 5. Monitor de eventos (ayuda didáctica)
Panel fijo a la derecha (abajo en pantallas < 820 px) con: estado de la conexión, origen de la visita (UTM de la primera página de la sesión),
los últimos 12 eventos (clic en uno para ver sus parámetros) y el botón **Simular nuevo visitante**, que borra cookies `_ga*`, carrito y `sessionStorage`.
Prueba UTM: `index.html?utm_source=newsletter&utm_medium=email&utm_campaign=lab_ga4`

## 6. Publicar en GitHub + Vercel (sin consola)
1. En github.com: **New repository** → nombre `cervo` → Public → Create.
2. **Add file → Upload files**: arrastra el **contenido** de la carpeta `Cervo` (que `index.html` quede en la raíz del repositorio) → Commit changes.
3. En vercel.com: **Add New → Project** → importa el repositorio `cervo`.
4. **Framework Preset: Other**. Deja vacíos Build Command y Output Directory → **Deploy**.
5. Edita `js/config.js` desde GitHub (lápiz) para pegar tu ID; Vercel republica solo.

## Aviso
Sitio académico de simulación: no procesa pagos reales ni guarda datos personales. Usa Google Analytics 4.
