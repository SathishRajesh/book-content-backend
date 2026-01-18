const router = require('express').Router();
const { createBook, getBooks } = require('../controllers/bookController');

router.post('/', createBook);
router.get('/', getBooks);

module.exports = router;
