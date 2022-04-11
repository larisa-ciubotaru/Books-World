const mongoose = require('mongoose');

const comandaSchema = new mongoose.Schema({
    user_id: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
    },
    proprietar_id: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
    },
    book_id: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
    },
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
    blapsc: {
        type: String,
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
        type: String,
        required: 'Numarul de telefon este necesar'
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
});

// Export model
module.exports = mongoose.model('Comanda', comandaSchema);