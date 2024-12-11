const fs = require('node:fs/promises');

// Leer todos los products
async function getStoredProducts() {
  const rawFileContent = await fs.readFile('products.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  return data.products ?? [];
}

// Escribir un nuevo product
function storedProducts(products) {
  return fs.writeFile('products.json', JSON.stringify({ products: products || [] }));
}

exports.getStoredProducts = getStoredProducts;
exports.storedProducts = storedProducts;