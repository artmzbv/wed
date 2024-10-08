const router = require('express').Router();
const { getFAQs, getPhotos } = require('../controllers/notion');

router.get('/photos', getPhotos);
router.get('/faqs', getFAQs);
// router.post('/articles/:date/:title', getNotionDataFromDB);

module.exports = router;