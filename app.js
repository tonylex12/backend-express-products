const express = require("express");
const bodyParser = require("body-parser");
const md5 = require("blueimp-md5");

const { getStoredProducts, storedProducts } = require("./data/products");

const { getStoredCustomers, storedCustomers } = require("./data/customers");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Products

app.get("/products", async (req, res) => {
  const storedProducts = await getStoredProducts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ products: storedProducts });
  res.status(200);
});

app.get("/products/:id", async (req, res) => {
  const storedProducts = await getStoredProducts();
  console.log(storedProducts);
  console.log(req.params.id);
  const product = storedProducts.find((product) => product.id == req.params.id);
  console.log(product);
  res.json({ product });
});

app.post("/products", async (req, res) => {
  const existingProducts = await getStoredProducts();
  const productData = req.body;
  const newProduct = {
    id: md5(req.body.description + Date.now),
    ...productData,
  };
  const updatedProducts = [newProduct, ...existingProducts];
  await storedProducts(updatedProducts);
  res.status(201).json({ message: "Stored new product.", post: newProduct });
});

app.put("/products/:id", async (req, res) => {
  const existingProducts = await getStoredProducts();
  const productId = req.params.id;
  const productIndex = existingProducts.findIndex(
    (product) => product.id == productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  const updatedProduct = {
    ...existingProducts[productIndex],
    ...req.body,
  };

  existingProducts[productIndex] = updatedProduct;
  await storedProducts(existingProducts);
  res.status(200).json({
    message: "Product updated successfully.",
    product: updatedProduct,
  });
});

app.delete("/products/:id", async (req, res) => {
  const existingProducts = await getStoredProducts();
  const productId = req.params.id.trim();
  const productIndex = existingProducts.findIndex(
    (product) => product.id.trim() === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  existingProducts.splice(productIndex, 1);
  await storedProducts(existingProducts);
  res.status(200).json({ message: "Product deleted successfully." });
});

// Customers

app.get("/customers", async (req, res) => {
  const storedCustomers = await getStoredCustomers();
  res.json({ customers: storedCustomers });
  res.status(200);
});

app.get("/customers/:id", async (req, res) => {
  const storedCustomers = await getStoredCustomers();
  const customer = storedCustomers.find(
    (customer) => customer.id == req.params.id
  );
  res.json({ customer });
});

app.post("/customers", async (req, res) => {
  const existingCustomers = await getStoredCustomers();
  const customerData = req.body;
  const newCustomer = {
    id: md5(req.body.email + Date.now),
    ...customerData,
  };
  const updatedCustomers = [newCustomer, ...existingCustomers];
  await storedCustomers(updatedCustomers);
  res.status(201).json({ message: "Stored new customer.", post: newCustomer });
});

app.put("/customers/:id", async (req, res) => {
  const existingCustomers = await getStoredCustomers();
  const customerId = req.params.id;
  const customerIndex = existingCustomers.findIndex(
    (customer) => customer.id == customerId
  );

  if (customerIndex === -1) {
    return res.status(404).json({ message: "Customer not found." });
  }

  const updatedCustomer = {
    ...existingCustomers[customerIndex],
    ...req.body,
  };

  existingCustomers[customerIndex] = updatedCustomer;
  await storedCustomers(existingCustomers);
  res.status(200).json({
    message: "Customer updated successfully.",
    customer: updatedCustomer,
  });
});

app.delete("/customers/:id", async (req, res) => {
  const existingCustomers = await getStoredCustomers();
  const customerId = req.params.id.trim();
  const customerIndex = existingCustomers.findIndex(
    (customer) => customer.id.trim() === customerId
  );

  if (customerIndex === -1) {
    return res.status(404).json({ message: "Customer not found." });
  }

  existingCustomers.splice(customerIndex, 1);
  await storedCustomers(existingCustomers);
  res.status(200).json({ message: "Customer deleted successfully." });
});

console.log(`Listening on http://localhost:8080`);
app.listen(8080);
