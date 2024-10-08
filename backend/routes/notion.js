const router = require('express').Router();
const { getFAQs, getPhotos } = require('../controllers/notion');

router.get('/portraits', getPhotos);
router.get('/portraits', getFAQs);

module.exports = router;