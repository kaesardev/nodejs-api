const express = require('express');
const routes = express.Router();

const ProductController = require('../controllers/ProductController')

routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);

const DevsController = require('../controllers/DevsController')

routes.get('/devs', DevsController.index);
routes.get('/devs/:id', DevsController.show);
routes.post('/devs', DevsController.store);
routes.put('/devs/:id', DevsController.update);
routes.delete('/devs/:id', DevsController.destroy);

module.exports = routes;
