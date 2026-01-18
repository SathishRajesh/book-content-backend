const router = require('express').Router();
const { createChapter } = require('../controllers/chapterController');

router.post('/:bookId', createChapter);

module.exports = router;
