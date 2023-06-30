module.exports = app => {


var express = require('express');
var router = express.Router();
var OrganizatorController = require('../controllers/OrganizatorController.js');

/*
 * GET
 */
router.get('/', OrganizatorController.list);

/*
 * GET
 */
router.get('/escape/:email', OrganizatorController.show);

/*
 * POST
 */
router.post('/register', OrganizatorController.create);

/*
 * POST
 */
router.post('/check', OrganizatorController.check);

/*
 * POST
 */
router.post('/povabi',
    OrganizatorController.povabi
);

/*
 * PUT
 */
router.put('/escape/:email', OrganizatorController.update);

/*
 * DELETE
 */
router.delete('/:id', OrganizatorController.remove);

/*
 * POST
 */
router.post('/token', OrganizatorController.deleteToken);

app.use("/organizator", router);

}
