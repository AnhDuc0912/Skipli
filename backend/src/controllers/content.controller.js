import { db } from '../config/firebase.js';
import { generateCaptions, generatePostIdeas } from '../services/gemini.service.js';

export const generatePostCaptions = async (req, res) => {
  const { socialNetwork, subject, tone } = req.body;
  if (!socialNetwork || !subject || !tone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const captions = await generateCaptions(socialNetwork, subject, tone);
    res.json({ captions  }); // Trả về trong data.captions
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate captions' });
  }
};

export const getPostIdeas = async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const ideas = await generatePostIdeas(topic);
    res.json({ ideas }); // 👈 Bọc trong data.ideas
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate post ideas' });
  }
};

export const createCaptionsFromIdeas = async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  try {
    const captions = await generateCaptions('generic', idea, 'neutral');
    res.json({ data: { captions } }); // 👈 Bọc trong data.captions
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate captions from idea' });
  }
};

export const saveGeneratedContent = async (req, res) => {
  const { topic, data, phoneNumber } = req.body;
  if (!topic || !data || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const contentRef = await db.collection('contents').add({
      phoneNumber,
      topic,
      data,
      createdAt: new Date(),
    });
    res.json({ success: true, id: contentRef.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
};

export const getUserGeneratedContents = async (req, res) => {
  const { phone_number } = req.query;
  if (!phone_number) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const snapshot = await db.collection('contents').where('phoneNumber', '==', phone_number).get();
    const contents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(contents);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
};

export const unSaveContent = async (req, res) => {
  const { captionId } = req.body;
  if (!captionId) {
    return res.status(400).json({ error: 'Caption ID is required' });
  }

  try {
    await db.collection('contents').doc(captionId).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
};