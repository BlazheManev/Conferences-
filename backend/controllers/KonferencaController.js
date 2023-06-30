const KonferencaModel = require("../models/KonferencaModel.js");

/**
 * KonferencaController.js
 *
 * @description :: Server-side logic for managing Konferencas.
 */
module.exports = {
  /**
   * KonferencaController.list()
   */
  list: async function (req, res) {
    try {
      const konferencas = await KonferencaModel.find();
      return res.json(konferencas);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting Konferenca.",
        error: err,
      });
    }
  },

  /**
   * KonferencaController.OnlyOne()
   */
  OnlyOne: async function (req, res) {
    try {
      const konferencas = await KonferencaModel.find().sort({ _id: -1 }).limit(1);
      const lastKonferenca = konferencas[0];
      return res.json(lastKonferenca);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting Konferenca.",
        error: err,
      });
    }
  },

  /**
   * KonferencaController.show()
   */
  show: async function (req, res) {
    try {
      const id = req.params.id;
      const konferenca = await KonferencaModel.findOne({ _id: id });

      if (!konferenca) {
        return res.status(404).json({
          message: "No such Konferenca",
        });
      }

      return res.json(konferenca);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting Konferenca.",
        error: err,
      });
    }
  },

  /**
   * KonferencaController.create()
   */
  create: async function (req, res) {
    try {
      const { naslov, datum, zacetakUra, konecUra, timelines } = req.body;

      const konferenca = new KonferencaModel({
        naslov,
        datum,
        zacetakUra,
        konecUra,
        timelines,
      });

      const savedKonferenca = await konferenca.save();
      return res.status(201).json(savedKonferenca);
    } catch (err) {
      return res.status(500).json({
        message: "Error when creating Konferenca",
        error: err,
      });
    }
  },

  /**
   * KonferencaController.update()
   */
  update: async function (req, res) {
    try {
      let id = req.params.id;
      const Konferenca = await KonferencaModel.findOne({ _id: id });
  
      if (!Konferenca) {
        return res.status(404).json({
          message: "No such Konferenca",
        });
      }
  
      const email = req.body.email;
      console.log(email)
     
      if (email != null){
        const isEmailExists = Konferenca.Udelezenci.some(
          (udelezec) => udelezec.email === email
        );
        if (isEmailExists) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }
      }
      Konferenca.naslov = req.body.naslov || Konferenca.naslov;
      Konferenca.datum = req.body.datum || Konferenca.datum;
      Konferenca.ura = req.body.ura || Konferenca.ura;
      Konferenca.Udelezenci.push({ email });
  
      const updatedKonferenca = await Konferenca.save();
      return res.json(updatedKonferenca);
    } catch (err) {
      return res.status(500).json({
        message: "Error when updating Konferenca.",
        error: err,
      });
    }
  },
  
  

  /**
   * KonferencaController.remove()
   */
  remove: async function (req, res) {
    try {
      let id = req.params.id;

      const removedKonferenca = await KonferencaModel.findByIdAndRemove(id);

      return res.status(204).json();
    } catch (err) {
      return res.status(500).json({
        message: "Error when deleting the Konferenca.",
        error: err,
      });
    }
  },
};
