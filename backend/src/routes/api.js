import express from 'express';
import { createNewAccessCode, validateAccessCode } from '../controllers/auth.controller.js';
import { generatePostCaptions, getPostIdeas, createCaptionsFromIdeas, saveGeneratedContent, getUserGeneratedContents, unSaveContent } from '../controllers/content.controller.js';

const router = express.Router();

router.post('/CreateNewAccessCode', createNewAccessCode);
router.post('/ValidateAccessCode', validateAccessCode);
router.post('/GeneratePostCaptions', generatePostCaptions);
router.post('/GetPostIdeas', getPostIdeas);
router.post('/CreateCaptionsFromIdeas', createCaptionsFromIdeas);
router.post('/SaveGeneratedContent', saveGeneratedContent);
router.get('/GetUserGeneratedContents', getUserGeneratedContents);
router.post('/UnSaveContent', unSaveContent);

export default router;