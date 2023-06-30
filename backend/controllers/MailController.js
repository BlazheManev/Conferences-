var OrganizatorModel = require('../models/OrganizatorModel.js');
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
require('dotenv').config();
/**
 * OrganizatorController.js
 *
 * @description :: Server-side logic for managing Organizators.
 */
module.exports = {

    /**
     * OrganizatorController.povabi()
     */
    povabi: async function (req, res) {
        try {
            let Email = ({
                from: 'mr.verydoggy@gmail.com',
                to: req.body.to,
                subject: req.body.subject,
                text: req.body.text
            });

            //5LMhxUtu5hxn

            var transporter = nodemailer.createTransport({
                host: 'smtp.zoho.eu',
                port: 465,
                secure: true, //ssl
                auth: {
                    user: "konferenca@zohomail.eu",
                    pass: process.env.EMAIL_PASS
                }
              });

            console.log(req.body.to);

            let mailOptions = {
                from: 'konferenca@zohomail.eu',
                to: /*'mr.verydoggy@gmail.com, janlukac2000@gmail.com,' +*/ req.body.to,
                subject: req.body.subject,
                text: req.body.text
            };

            console.log(mailOptions);

            
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        message: 'Error when sending email',
                        error: err
                    });
                } else {
                    console.log('Message sent: ' + info.response);
                    res.status(200).json({ message: 'OK' });
                };
                return res.end();
            });

            return res.status(200).json({ message: 'OK' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Error when sending email 1',
                error: err
            });
        }
    }
};
