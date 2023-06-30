module.exports = app => {


var express = require('express');
var router = express.Router();
var KonferencaController = require('../controllers/KonferencaController.js');

/*
 * GET
 */
router.get('/', KonferencaController.list);


router.get('/OnlyOne', KonferencaController.OnlyOne);

/*
 * GET
 */
router.get('/:id', KonferencaController.show);

/*
 * POST
 */
router.post('/', KonferencaController.create);

/*
 * PUT
 */
router.put('/:id', KonferencaController.update);

/*
 * DELETE
 */
router.delete('/:id', KonferencaController.remove);

app.use("/konference", router);

}
