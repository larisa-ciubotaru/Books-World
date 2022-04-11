const { request } = require('express');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },

    titlu: {
        type: String,
        trim: true,
        required: 'Adauga titlul cartii'
    },

    autor: {
        type: String,
        trim: true,
        required: 'Adauga cautorul cartii'
    },

    editura: {
        type: String,
        trim: true,
        required: 'Adauga editura cartii'
    },

    genul: {
        type: String,
        trim: true,
        required: 'Adauga genul cartii'
    },

    coperta: {
        type: String,
        required: 'Alege coperta cartii'
    },

    conditie: {
        type: String,
        required: 'Alege conditia cartii'
    },

    urme_uzura: {
        type: String,
        trim: true,
        required: 'Adauga urmele de uzura ale cartii'
    },

    schimb_vanzare: {
        type: String,
        required: 'Alege schimb/vanzare'
    },

    pret: {
        type: Number
    },

    image: String
});

bookSchema.index({ 
    titlu: 'text',
    autor: 'text'
})

// Export model
module.exports = mongoose.model('Book', bookSchema);