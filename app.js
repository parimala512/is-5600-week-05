const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')


// Set the port
const port = process.env.PORT || 3000
// Boot the app
const app = express()
// Register the public directory
app.use(express.static(__dirname + '/public'));
// register the routes
app.use(bodyParser.json())
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)
app.post('/products', api.createProduct)
// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`))
// app.js

// ...

app.get('/orders', api.listOrders)
app.get('/orders/', api.createOrder)
const express = require('express');
const bodyParser = require('body-parser');
const orders = require('./orders'); // Import orders module

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Edit an order (PUT request)
app.put('/orders/:id', (req, res) => {
    const updatedOrder = orders.edit(req.params.id, req.body);
    if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
});

// Delete an order (DELETE request)
app.delete('/orders/:id', (req, res) => {
    orders.destroy(req.params.id);
    res.status(204).send(); // No content response
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

