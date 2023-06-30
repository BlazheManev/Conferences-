module.exports = app => {
var express = require('express');
var router = express.Router();
var UdelezenecController = require('../controllers/UdelezenecController.js');

/*
 * GET
 */
router.get('/', UdelezenecController.list);

/*
 * GET
 */
router.get('/escape/:email', UdelezenecController.show);

/*
 * POST
 */

router.post('/register', UdelezenecController.create);

router.post('/login', UdelezenecController.login);

/*
 * PUT
 */
router.put('/:email', UdelezenecController.update);

/*
 * DELETE
 */
router.delete('/:id', UdelezenecController.remove);

app.use("/udelezenec", router);

}
