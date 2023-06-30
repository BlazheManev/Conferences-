module.exports = app => {
var express = require('express');
var router = express.Router();
var GradivoController = require('../controllers/GradivoController.js');
const dbConfig = require("../config/config");

const { mongo, connection } = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require("multer-gridfs-storage");

const upload = require("../middleware/multer.js")


const storage = new GridFsStorage({
    url: dbConfig.url,
    file: (req, file) => {
        return {
            filename: file.originalname
        }
    }
});

//const singleUpload = multer({ storage: storage, limits: {fileSize: 10000000} }).single('file');

/*
 * GET
 */
router.get('/', GradivoController.list);

/*
 * GET
 */

router.get("/showGradiva", GradivoController.showOnlyGradiva);

/*
 * GET
 */
router.get('/:id', GradivoController.show);

router.get('/download/:id', GradivoController.download);

/*
 * POST
 */
router.post('/', upload.single("file"), GradivoController.create);

/*
 * PUT
 */
router.put('/:id', GradivoController.update);

/*
 * DELETE
 */
router.delete('/:id', GradivoController.remove);

app.use("/gradivo", router);

}