var express = require('express');
var router = express.Router();

//require controllers:
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', userController.homePageFilters);

//USER ROUTES
router.get('/creaza-cont', userController.signUpGet);
router.post('/creaza-cont', userController.signUpPost, userController.loginPost);
router.get('/conecteaza-te', userController.loginGet);
router.get('/*', userController.isUser);
router.post('/conecteaza-te', userController.loginPost);
router.get('/logout', userController.logout);
router.get('/contul-meu', userController.myAccount);
router.get('/adauga-carti', userController.addBooksGet);
router.post('/adauga-carti', userController.addBooksPost);
router.get('/carti/:carte', userController.detaliiCarte);
router.get('/carti-cele-mai-noi', userController.cartiCeleMaiNoi);
router.get('/carti-cele-mai-vechi', userController.cartiCeleMaiVechi);
router.get('/carti-a-crescator', userController.cartiAlfabeticCrescator);
router.get('/carti-a-descrescator', userController.cartiAlfabeticDescrescator);
router.post('/results', userController.searchResults);
router.get('/proces/:carte', userController.trimiteComandaGet);
router.post('/proces/:carte', userController.trimiteComandaPost);
router.get('/comenzile-mele', userController.comenzileMele);
router.get('/comenzile-mele/:comanda', userController.detaliiComanda);
router.post('/comenzile-mele/:comanda', userController.acceptaCerere);
router.get('/comenzile-mele/:comanda/ccm', userController.detaliiComanda);
router.post('/comenzile-mele/:comanda/ccm', userController.confirmaPrimirea);
router.post('/comenzile-mele/delete/:comanda', userController.deleteCererePost);

module.exports = router;
