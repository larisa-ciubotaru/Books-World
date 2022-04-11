const mongoose = require('mongoose');

const adresaSchema = new mongoose.Schema({
      nume: {
            type: String,
            required: 'Numele este necesar',
            trim: true
      }, 
      prenume: {
            type: String,
            required: 'Prenumele este necesar',
            trim: true
      },
      strada: {
            type: String,
            required: 'Strada este necesara',
            trim: true
      },
      numar: {
            type: String,
            required: 'Numarul este necesar',
            trim: true
      },
      bl_ap_sc: {
            type: String,
            required: 'Blocul, aparatamentul, scara sunt necesare',
            trim: true
      },
      cod_postal: {
            type: String,
            required: 'Codul postal este necesar',
            trim: true
      },
      judet: {
            type: String,
            required: 'Judetul este necesar',
            trim: true
      },
      oras: {
            type: String,
            required: 'Orasul este necesar',
            trim: true
      },
      telefon: {
            type: Number,
            required: 'Numarul de telefon este necesar'
      }
            
});

//Export model
module.exports = mongoose.model('Adresa', adresaSchema);