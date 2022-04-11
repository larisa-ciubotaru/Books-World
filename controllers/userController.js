const User = require('../models/user');
const Book = require('../models/book');
const Comanda = require('../models/comanda');
const Passport = require('passport');
const mongoose = require("mongoose");

// //Express validator
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

exports.homePageFilters = async (req, res, next) => {
    try {
        const numberOfUsers = await User.count();
        const numberOfBooks = await Book.count();
        const numberOfExchangeBooks = await Book.find( {schimb_vanzare: "schimb"} ).count();
        const numberOfSellBooks = await Book.find( {schimb_vanzare: "vanzare"} ).count();

        if(numberOfBooks > 6)
            toateCartile = await Book.find().sort({ $natural: 1 }).limit(6).skip(numberOfBooks - 6);
        else 
            toateCartile = await Book.find().sort({ $natural: 1 }).limit(numberOfBooks);

        res.render('index', { toateCartile, numberOfUsers, numberOfExchangeBooks, numberOfSellBooks });
    } catch(error) {
        next(error);
    }
}

exports.signUpGet = (req, res) => {
    res.render('creaza-cont', {title: 'Creaza cont'} );
}

exports.signUpPost = [
    // Validate data
    check('first_name').isLength({ min: 1 }).withMessage('Numele de familie trebuie specificat')
    .isAlphanumeric().withMessage('Numele de familie trebuie sa fie alfanumeric'),

    check('surname').isLength({ min: 1 }).withMessage('Prenumele trebuie specificat')
    .isAlphanumeric().withMessage('Prenumele trebuie sa fie alfanumeric'),

    check('email').isEmail().withMessage('Email invalid'),

    check('confirm_email')
    .custom((value, { req }) => value === req.body.email)
    .withMessage('Adresele de email nu corespund'),

    check('password').isLength({ min: 6 })
    .withMessage('Parola invalidă, trebuie să conțină minim 6 caractere'),

    check('confirm_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Parolele nu corespund'),

    sanitize('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
        //There are errors
          res.render('creaza-cont', {title: 'Va rugam sa rezolvati urmatoarele erori:', errors: errors.array() });
          return;
        } else {
            //No errors
            const newUser = new User({
                first_name: req.body.first_name,
                surname: req.body.surname,
                email: req.body.email, 
                password: req.body.password, 
                credit: 0,
                noExchangedBooks: 0,
                noSoldBooks: 0
            });
            User.register(newUser, req.body.password, function(err){
                if(err) {
                    console.log('Eroare in timpul inregistrarii!', err);
                    return next(err);
                }
                next(); //Move onto loginPost after registration
            });
        }
    }
]

exports.loginGet = (req, res) => {
    res.render('conecteaza-te', {title: 'Conecteaza-te'});
}

exports.loginPost = Passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/conecteaza-te'
})

exports.isUser = (req, res, next) => {
    if( req.isAuthenticated() ) {
        next();
        return;
    }
    res.redirect('/');
}

exports.logout = (req, res) => {
    req.logout();
    req.flash('info', 'You are now logged out');
    res.redirect('/');
}

exports.myAccount = async (req, res, next) => {
    try {
        const user = req.user;
        const user_books = await Book.find({user_id: req.user._id }).sort({ _id: -1 });
        const numberOfAllBooks = await Book.find({user_id: req.user._id }).count();
        const nrOfSchimbBooks = await Book.find( { user_id: req.user._id, schimb_vanzare: "schimb" }).count();
        res.render('contul_meu', { title: 'Contul meu', user, user_books, numberOfAllBooks, nrOfSchimbBooks});
    } catch(error) {
        next(error);
    }
}

exports.addBooksGet = (req, res) => {
    res.render('adauga_carti', { title: 'Adauga carti' });
}

exports.addBooksPost = async (req, res, next) => {
    try {
        const user = req.user;
        const bookData = req.body;
        const book = new Book({ 
            user_id: user._id, 
            titlu: bookData.titlu, 
            autor: bookData.autor, 
            editura: bookData.editura, 
            genul: bookData.genul, 
            coperta: bookData.coperta, 
            conditie: bookData.conditie, 
            urme_uzura: bookData.urme_uzura, 
            schimb_vanzare: bookData.schimb_vanzare,
            pret: bookData.pret, 
            image: bookData.image
        });
    
        await book.save();

        const nrOfSchimbBooks = await Book.find( { user_id: req.user._id, schimb_vanzare: "schimb" }).count();
        if(nrOfSchimbBooks === 4 && bookData.schimb_vanzare === 'schimb')
            creditPlus1 = await User.updateOne({_id: user._id}, {credit: user.credit+1 });
        res.redirect(`/carti/${book._id}`);
    } catch(error) {
        next(error);
    }
}

exports.detaliiCarte = async (req, res, next) => {
    try{
        const bookId = req.params.carte;
        const userId = req.user.id;
        const bookData = await Book.find( {_id: bookId} );
        const userData = await User.find( { _id: bookData[0]["user_id"]});
        res.render('detalii_carte', { title: 'Books World.', bookData, userData, bookId, userId });
    } catch(error) {
        next(error);
    }
}

exports.cartiCeleMaiNoi = async (req, res, next) => {
    try{
        const toateCartile = await Book.aggregate([
            { 
                $lookup: {
                    from: 'comandas',
                    localField: '_id',
                    foreignField: 'book_id',
                    as: 'comanda_data'
                }
            }
        ]).sort({ _id: -1 });

        res.render('carti', { title: 'Carti', toateCartile });

    } catch(error) {
        next(error);
    }
}

exports.cartiCeleMaiVechi = async (req, res, next) => {
    try{
        const toateCartile = await Book.aggregate([
            { 
                $lookup: {
                    from: 'comandas',
                    localField: '_id',
                    foreignField: 'book_id',
                    as: 'comanda_data'
                }
            }
        ]);
        res.render('carti', { title: 'Carti', toateCartile });
    } catch(error) {
        next(error);
    }
}

exports.cartiAlfabeticCrescator = async (req, res, next) => {
    try{
        const toateCartile = await Book.aggregate([
            { 
                $lookup: {
                    from: 'comandas',
                    localField: '_id',
                    foreignField: 'book_id',
                    as: 'comanda_data'
                }
            }
        ]).sort({"titlu": 1});
        res.render('carti', { title: 'Carti', toateCartile });
    } catch(error) {
        next(error);
    }
}

exports.cartiAlfabeticDescrescator = async (req, res, next) => {
    try{
        const toateCartile = await Book.aggregate([
            { 
                $lookup: {
                    from: 'comandas',
                    localField: '_id',
                    foreignField: 'book_id',
                    as: 'comanda_data'
                }
            }
        ]).sort({"titlu": -1});
        res.render('carti', { title: 'Carti', toateCartile });
    } catch(error) {
        next(error);
    }
}

exports.searchResults = async (req, res, next) => {
    try{
        const searchQuery = req.body;

        const searchData = await Book.aggregate([
            { $match: { $text: { $search: searchQuery.titlu_autor } } } 
        ]);
        res.render('search_results', { title: 'Rezultate cautare', searchQuery, searchData });

    } catch(errors) {
        next(errors);
    }
}

exports.trimiteComandaGet = async (req, res, next) => {
    try{
        const user = req.user;
        const bookId = req.params.carte;
        const bookData = await Book.find( {_id: bookId} );
        const userData = await User.find( { _id: bookData[0]["user_id"]});
        res.render('trimite-comanda', {title: 'Books World.', bookData, userData, bookId, user });
    } catch(error) {
        next(error);
    }
}

exports.trimiteComandaPost = async (req, res, next) => {
    try{
        const user = req.user;
        const bookId = req.params.carte;
        const bookData = await Book.find( {_id: bookId} );
        const userData = await User.find( { _id: bookData[0]["user_id"]});
        const adresa = req.body;
        const dateTime = new Date;
        const comanda = new Comanda({
            user_id: req.user._id,
            proprietar_id: userData[0]._id,
            book_id: bookId,
            nume: adresa.nume,
            prenume: adresa.prenume,
            strada: adresa.strada,
            numar: adresa.numar,
            blapsc: adresa.blapsc,
            cod_postal: adresa.cod,
            judet: adresa.judet,
            oras: adresa.oras,
            telefon: adresa.telefon,
            status: 'comanda-plasata',
            date: dateTime
        });
        await comanda.save();
        if(user.credit > 0)
            creditMinus1 = await User.updateOne({_id: user._id}, {credit: user.credit-1 });
    
        res.redirect(`/comenzile-mele/${comanda._id}`);
        //res.json(comanda);
    } catch(error) {
        next(error);
    }
}

exports.comenzileMele = async (req, res, next) => {
    try{
        const comenziDate = await Comanda.aggregate([
            { $match: {user_id: new mongoose.Types.ObjectId(req.user.id)}},
            {
                $lookup: {
                from: 'users',
                localField: 'proprietar_id',
                foreignField: '_id',
                as: 'proprietar_data'
                }
            },
            {
                $unwind: {
                  path: "$book_data",
                  preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book_data'
                }
            }
        ]);

        const comenziPrimite = await Comanda.aggregate([
            { $match: {proprietar_id: new mongoose.Types.ObjectId(req.user.id)}},
            { 
                $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_data'
                }
            },
            {
                $unwind: {
                  path: "$book_data",
                  preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book_data'
                }
            }
        ]);
        
        //res.json(comenziDate);
        res.render('comenzile-mele', { title: 'Comenzile mele', comenziDate, comenziPrimite });
    } catch(error) {
        next(error);
    }
}

exports.detaliiComanda = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const comandaId = req.params.comanda;
        const comanda = await Comanda.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(comandaId)}},
            { 
                $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_data'
                }
            },
            {
                $unwind: {
                  path: "$proprietar_data",
                  preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                from: 'users',
                localField: 'proprietar_id',
                foreignField: '_id',
                as: 'proprietar_data'
                }
            },
            {
                $unwind: {
                  path: "$book_data",
                  preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book_data'
                }
            }
        ]);
        
        res.render('detalii-comanda', { title: 'Detalii comanda', comanda, userId, comandaId });
    } catch(error) {
        next(error);
    }
}

exports.acceptaCerere = async (req, res, next) => {
    try{
        const comandaId = req.params.comanda;
        const accepta = await Comanda.updateOne({_id: comandaId}, {status: 'comanda-acceptata'});
        res.redirect(`/comenzile-mele/${comandaId}`);
    } catch(error) {
        next(error);
    }
}

exports.confirmaPrimirea = async (req, res, next) => {
    try{
        const comandaId = req.params.comanda;
        const confirmaPrimirea = await Comanda.updateOne({_id: comandaId}, {status: 'comanda-primita'});
        const comandaPrimita = await Comanda.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(comandaId)}},
            { 
                $lookup: {
                from: 'users',
                localField: 'proprietar_id',
                foreignField: '_id',
                as: 'proprietar_data'
                }
            },
            {
                $unwind: {
                  path: "$book_data",
                  preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                    from: 'books',
                    localField: 'book_id',
                    foreignField: '_id',
                    as: 'book_data'
                }
            }
        ]);
        const proprietarId = comandaPrimita[0].proprietar_data[0]._id;
        const creditVechi = comandaPrimita[0].proprietar_data[0].credit;
        const noExchangedBooksVechi = comandaPrimita[0].proprietar_data[0].noExchangedBooks;
        const noSoldBooksVechi = comandaPrimita[0].proprietar_data[0].noSoldBooks;

        if(comandaPrimita[0].book_data[0].schimb_vanzare == "schimb") {
            var creditPlus1 = await User.updateOne({_id: proprietarId}, { credit: creditVechi+1 });
            var noExchangedBooksPlus1 = await User.updateOne({_id: proprietarId}, {noExchangedBooks: noExchangedBooksVechi+1 });
        }
        else
            var noSoldBooksPlus1 = await User.updateOne({_id: proprietarId}, {noExchangedBooks: noSoldBooksVechi+1 });
        res.redirect(`/comenzile-mele/${comandaId}/ccm`);
    } catch(error) {
        next(error);
    }
}

exports.deleteCererePost = async (req, res, next) => {
    try{
        const comandaId = req.params.comanda;
        const comandaData = await Comanda.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(comandaId)}},
            { 
                $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_data'
                }
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                from: 'books',
                localField: 'book_id',
                foreignField: '_id',
                as: 'book_data'
                }
            }
            
        ]);

        if(comandaData[0].book_data[0].schimb_vanzare == "schimb"){
            creditPlus1 = await User.updateOne({_id: comandaData[0].user_id}, {credit: comandaData[0].user_data.credit+1});
            comanda = await Comanda.deleteOne({_id: comandaId});
        } else{
            comanda = await Comanda.deleteOne({_id: comandaId});
        }
        
        res.redirect('/comenzile-mele');
    } catch(errors) {
        next(errors);
    }
}