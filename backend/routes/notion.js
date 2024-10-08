const router = require('express').Router();
const { getFAQs } = require('../controllers/notion');

router.get('/portraits', getFAQs);
// router.post('/articles/:date/:title', getNotionDataFromDB);

module.exports = router;