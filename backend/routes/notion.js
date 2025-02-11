const router = require('express').Router();
const { getFAQs, getPhotos, getComments } = require('../controllers/notion');

router.get('/photos', getPhotos);
router.get('/faqs', getFAQs);
router.get('/comments', getComments);

module.exports = router;