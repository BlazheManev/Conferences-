var UdelezenecModel = require('../models/UdelezenecModel.js');
const admin = require("../config/firebaseConfig.js");

/**
 * UdelezenecController.js
 *
 * @description :: Server-side logic for managing Udelezenecs.
 */
module.exports = {

    /**
     * UdelezenecController.list()
     */
    list: async function (req, res) {
        try {
            const Udelezenecs = await UdelezenecModel.find();
            return res.json(Udelezenecs);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Udelezenec.',
                error: err
            });
        }
    },
    
    show: async function (req, res) {
        var email = req.params.email;
    
        try {
            const Udelezenec = await UdelezenecModel.findOne({ username: email });
            if (!Udelezenec) {
                return res.status(404).json({
                    message: 'No such Udelezenec'
                });
            }
            return res.json(Udelezenec);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Udelezenec.',
                error: err
            });
        }
    },
    
    /**
     * UdelezenecController.create()
     */
    create: async function (req, res) {
        try {
          const existingUdelezenec = await UdelezenecModel.findOne({
            username: req.body.username.toString(),
          });
          
          if (existingUdelezenec) {
            // Username already exists, do nothing
            return res.status(200).json(existingUdelezenec);
          }
      
          var Udelezenec = new UdelezenecModel({
            username: req.body.username,
            ime: req.body.ime,
            priimek: req.body.priimek,
            gibalnaOvira: req.body.gibalnaOvira,
          });
      
          const savedUdelezenec = await Udelezenec.save();
          console.log(savedUdelezenec);
          return res.status(201).json(savedUdelezenec);
        } catch (err) {
          return res.status(500).json({
            message: 'Error when creating Udelezenec',
            error: err,
          });
        }
      },      

    /**
     * UdelezenecController.update()
     */
    update: async function (req, res) {
        try {
            var id = req.params.id;

            const Udelezenec = await UdelezenecModel.findOne({username: req.params.email});
         console.log(Udelezenec)
            if (!Udelezenec) {
                return res.status(404).json({
                    message: 'No such Udelezenec'
                });
            }

            Udelezenec.username = req.body.username ? req.body.username : Udelezenec.username;
            Udelezenec.password = req.body.password ? req.body.password : Udelezenec.password;
            Udelezenec.ime = req.body.ime ? req.body.ime : Udelezenec.ime;
            Udelezenec.priimek = req.body.priimek ? req.body.priimek : Udelezenec.priimek;
            Udelezenec.gibalnaOvira = req.body.gibalnaOvira ? req.body.gibalnaOvira : Udelezenec.gibalnaOvira;

            const updatedUdelezenec = await Udelezenec.save();
            return res.json(updatedUdelezenec);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating Udelezenec.',
                error: err
            });
        }
    },
   /**
    * UdelezenecController.login()
   */
    login: async function (req, res) {
        try {
          const email = req.body.username;
          const password = req.body.password;
          admin.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {    
            // Signed in
           var user = userCredential.user;
          // ...
          })
          return res.json(authUser);
        } catch (err) {
            console.error(err); // Log the error to the console
            return res.status(500).json({
              message: 'Error when logging in.',
              error: err
            });
          }
      },

    /**
     * UdelezenecController.remove()
     */
    remove: async function (req, res) {
        try {
            var id = req.params.id;

            const removedUdelezenec = await UdelezenecModel.findByIdAndRemove(id);

            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the Udelezenec.',
                error: err
            });
        }
    }
};
