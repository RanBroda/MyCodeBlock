const express = require('express');
const router = express.Router();
const codeBlockController = require('../controllers/codeBlockController');

router.get('/code-block', codeBlockController.getAllCodeBlocks);
router.get('/code-block/:id', codeBlockController.getCodeBlockById);
//router.get('/', codeBlockController.getDefault);

module.exports = router;
