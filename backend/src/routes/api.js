const express = require('express');
const { createNewAccessCode, validateAccessCode } = require('../controllers/auth.controller.js');
const { generatePostCaptions, getPostIdeas, createCaptionsFromIdeas, saveGeneratedContent, getUserGeneratedContents, unSaveContent } = require('../controllers/content.controller.js');

const router = express.Router();

router.post('/CreateNewAccessCode', createNewAccessCode);
router.post('/ValidateAccessCode', validateAccessCode);
router.post('/GeneratePostCaptions', generatePostCaptions);
router.post('/GetPostIdeas', getPostIdeas);
router.post('/CreateCaptionsFromIdeas', createCaptionsFromIdeas);
router.post('/SaveGeneratedContent', saveGeneratedContent);
router.get('/GetUserGeneratedContents', getUserGeneratedContents);
router.post('/UnSaveContent', unSaveContent);

module.exports = router;