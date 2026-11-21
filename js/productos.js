/* Catálogo ficticio de Cervo. Precios enteros en COP. Sin imágenes externas:
   cada producto usa un bloque de color con sus siglas. */
window.MARCA = "Cervo";
window.PRODUCTOS = [
  { id: "CRV-001", nombre: "Camiseta Aero Run", categoria: "Hombre", tipo: "Camisetas", precio: 89900,
    descripcion: "Camiseta ultraligera de tejido transpirable con costuras planas y secado rápido. Ideal para correr y entrenar.",
    sigla: "AR", c1: "#d6e6ff", c2: "#a9c8ff" },
  { id: "CRV-002", nombre: "Short Pace 7\"", categoria: "Hombre", tipo: "Shorts", precio: 119900,
    descripcion: "Short de 7 pulgadas con malla interior, bolsillo para el teléfono y cintura elástica que no se mueve.",
    sigla: "SP", c1: "#d9f2e3", c2: "#a8dcbd" },
  { id: "CRV-003", nombre: "Hoodie Studio Fleece", categoria: "Hombre", tipo: "Buzos", precio: 249900,
    descripcion: "Buzo con capucha en fleece suave por dentro. Perfecto para el calentamiento y el día a día.",
    sigla: "SF", c1: "#e6e0f5", c2: "#c4b8e8" },
  { id: "CRV-004", nombre: "Legging Flow High-Rise", categoria: "Mujer", tipo: "Leggings", precio: 169900,
    descripcion: "Legging de tiro alto con compresión media, tela opaca y suave, y bolsillo lateral oculto.",
    sigla: "LF", c1: "#ffe1e6", c2: "#ffb8c4" },
  { id: "CRV-005", nombre: "Top Soporte Medio Lift", categoria: "Mujer", tipo: "Tops", precio: 109900,
    descripcion: "Top deportivo de soporte medio con espalda cruzada y copas removibles. Para yoga, pilates y gimnasio.",
    sigla: "TL", c1: "#ffeed1", c2: "#ffd58f" },
  { id: "CRV-006", nombre: "Chaqueta Windshell Trail", categoria: "Mujer", tipo: "Chaquetas", precio: 289900,
    descripcion: "Chaqueta cortavientos plegable, resistente a la llovizna, con capucha ajustable y detalles reflectivos.",
    sigla: "WT", c1: "#d4f1f4", c2: "#9fdbe2" },
  { id: "CRV-007", nombre: "Jogger Tech Knit", categoria: "Hombre", tipo: "Pantalones", precio: 189900,
    descripcion: "Jogger de punto técnico elástico en cuatro direcciones, con puño ajustado y bolsillos con cierre.",
    sigla: "TK", c1: "#e8e8ed", c2: "#c7c7cc" },
  { id: "CRV-008", nombre: "Vestido Court Active", categoria: "Mujer", tipo: "Vestidos", precio: 159000,
    descripcion: "Vestido deportivo con short integrado, corte en A y tela ligera que respira. Para tenis, pádel y paseo.",
    sigla: "CA", c1: "#fde4d3", c2: "#f9bf9b" }
];
window.obtenerProducto = function (id) {
  return window.PRODUCTOS.find(function (p) { return p.id === id; }) || null;
};
