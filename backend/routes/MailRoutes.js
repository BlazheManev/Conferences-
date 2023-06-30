module.exports = app => {

    const bodyParser = require('body-parser');
    var express = require('express');
    var router = express.Router();
    var MailController = require('../controllers/MailController.js');
    
    /*
     * POST
     */
    router.post('/', MailController.povabi);

    // parse application/json
    app.use(bodyParser.json());
    
    app.use("/mail", router);
    
    }
    