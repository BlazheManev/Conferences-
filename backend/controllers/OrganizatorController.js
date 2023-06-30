var OrganizatorModel = require('../models/OrganizatorModel.js');
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * OrganizatorController.js
 *
 * @description :: Server-side logic for managing Organizators.
 */
module.exports = {

  /**
   * OrganizatorController.list()
    */
  list: async function (req, res) {
    try {
      const organizators = await OrganizatorModel.find();
      return res.json(organizators);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when getting Organizator.',
        error: err
      });
    }
  },

  /**
   * OrganizatorController.show()
   */
  show: async function (req, res) {
    try {
      const id = req.params.id;
      console.log(req.params.email)
      const organizator = await OrganizatorModel.findOne({ username: req.params.email });

      if (!organizator) {
        return res.status(404).json({
          message: 'No such Organizator'
        });
      }

      return res.json(organizator);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when getting Organizator.',
        error: err
      });
    }
  },


  /**
   * OrganizatorController.create()
   */
  create: async function (req, res) {
    try {
      var Organizator = new OrganizatorModel({
        username: req.body.username,
        password: req.body.password,
        ime: req.body.ime,
        priimek: req.body.priimek,
        token:req.body.token
      });

      const savedOrganizator = await Organizator.save();
      return res.status(201).json(savedOrganizator);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when creating Organizator',
        error: err
      });
    }
  },

  /**
   * OrganizatorController.povabi()
   */
  povabi: async function (req, res) {
    try {
      //tu sem hotel da bi bil mailer, pa sem se prestavil v novo datoteko raje.... MailController.js

      return res.status(200);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when sending email',
        error: err
      });
    }
  },

  /**
   * OrganizatorController.update()
   */
  update: async function (req, res) {
    try {
      var id = req.params.id;

      const Organizator = await OrganizatorModel.findOne({ username: req.params.email });
        console.log(req.body.token)
      if (!Organizator) {
        return res.status(404).json({
          message: 'No such Organizator'
        });
      }

      Organizator.username = req.body.username ? req.body.username : Organizator.username;
      Organizator.password = req.body.password ? req.body.password : Organizator.password;
      Organizator.ime = req.body.ime ? req.body.ime : Organizator.ime;
      Organizator.priimek = req.body.priimek ? req.body.priimek : Organizator.priimek;
      Organizator.token = req.body.token ? req.body.token : Organizator.token;

      const updatedOrganizator = await Organizator.save();
      return res.json(updatedOrganizator);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when updating Organizator.',
        error: err
      });
    }
  },

  /**
   * OrganizatorController.remove()
   */
  remove: async function (req, res) {
    try {
      var id = req.params.id;

      const removedOrganizator = await OrganizatorModel.findByIdAndRemove(id);

      return res.status(204).json();
    } catch (err) {
      return res.status(500).json({
        message: 'Error when deleting the Organizator.',
        error: err
      });
    }
  },
   /**
   * OrganizatorController.check()
   */
   check: async function (req, res) {
    try {

      const organizator = await OrganizatorModel.findOne({ username: req.body.email.toString() });
      if (!organizator) {
        return res.status(404).json({
          message: 'Organizator not found',
        });
      }
       token = organizator.token;
      return res.status(200).json({
        token,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Error when checking organizator',
        error: err,
      });
    }
  },
/**
 * OrganizatorController.deleteToken()
 */
 deleteToken : async (req, res) => {
  try {
    // Find the organizator with the provided username
    const organizator = await OrganizatorModel.findOne({ username: req.body.email.toString() });

    if (!organizator) {
      return res.status(404).json({
        message: 'Organizator not found',
      });
    }
    // Remove the token from the organizator document
    organizator.token = undefined;
    console.log(organizator)

    await organizator.save();

    return res.status(200).json({
      message: 'Token deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error when deleting the token',
      error: err,
    });
  }
},



};
