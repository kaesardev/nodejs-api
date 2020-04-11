const express = require('express');
const routes = express.Router();

const upload = require('../middlewares/multer');

const StorageController = require('../controllers/StorageController');

routes.get('/', StorageController.index);
routes.get('/:id', StorageController.show);
routes.post('/', upload.single('file'), StorageController.store);
routes.put('/:id', upload.single('file'), StorageController.update);
routes.delete('/:id', StorageController.destroy);

module.exports = routes;
