const express = require('express');
const router = express.Router();
const MainController = require('../controllers/main.controller.js');
const ApiController = require('../controllers/api.controller.js');

const mainController = new MainController();
const apiController = new ApiController();
router.get('/',(req, res) => {
    res.redirect('/dash');
});
router.get('/dash', mainController.index.bind(mainController));
router.get('/dash/device/:device', mainController.device.bind(mainController));
router.get('/dash/api', mainController.apidocs.bind(mainController));
router.get('/dash/delete/:device', mainController.delete.bind(mainController));
router.post('/dash/settings/:device', mainController.settings_velixs.bind(mainController));

router.all('/dash/login', mainController.login.bind(mainController));
router.get('/dash/logout', mainController.logout.bind(mainController));

router.all('/api/send-message', apiController.sendMessage.bind(apiController));
router.all('/api/fetch-group', apiController.fetchGroup.bind(apiController));
router.all('/api/fetch-member', apiController.fetchMember.bind(apiController));

module.exports = router;