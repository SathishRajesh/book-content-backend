const router = require('express').Router();
const { createPage, updatePage,restorePage } = require('../controllers/pageController');

router.post('/:chapterId', createPage);
router.put('/:pageId', updatePage);
router.post(
  '/:chapterId/restore/:pageIndex',
  restorePage
);
module.exports = router;
