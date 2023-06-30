module.exports = app => {
var express = require('express');
var router = express.Router();
var ProstorController = require('../controllers/ProstorController.js');

/*
 * GET
 */
router.get('/', ProstorController.list);

/*
 * GET
 */
router.get('/:id', ProstorController.show);

/*
 * POST
 */
router.post('/', ProstorController.create);

/*
 * PUT
 */
router.put('/:id', ProstorController.update);

/*
 * DELETE
 */
router.delete('/:id', ProstorController.remove);

app.use("/prostor", router);

}
