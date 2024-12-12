const fs = require("node:fs/promises");

// Leer todos los customers
async function getStoredCustomers() {
  const rawFileContent = await fs.readFile("customers.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  return data.customers ?? [];
}

// Escribir un nuevo customer
function storedCustomers(customers) {
  return fs.writeFile(
    "customers.json",
    JSON.stringify({ customers: customers || [] })
  );
}

exports.getStoredCustomers = getStoredCustomers;
exports.storedCustomers = storedCustomers;
