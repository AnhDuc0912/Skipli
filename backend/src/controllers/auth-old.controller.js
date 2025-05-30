import { db } from '../config/firebase.js';
import { sendSMS } from '../services/twilio.service.js';

export const createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Tạo mã truy cập ngẫu nhiên 6 chữ số
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Lưu mã vào Firestore
    await db.collection('users').doc(phoneNumber).set({ accessCode }, { merge: true });

    // Gửi mã qua SMS
    await sendSMS(phoneNumber, `Your access code is: ${accessCode}`);

    console.log(accessCode);
    
    res.json({ accessCode });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create access code' });
  }
};

export const validateAccessCode = async (req, res) => {
  const { phoneNumber, accessCode } = req.body;
  if (!phoneNumber || !accessCode) {
    return res.status(400).json({ error: 'Phone number and access code are required' });
  }

  try {
    const userDoc = await db.collection('users').doc(phoneNumber).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedCode = userDoc.data().accessCode;
    if (storedCode === accessCode) {
      // Xóa mã truy cập sau khi xác thực
      await db.collection('users').doc(phoneNumber).set({ accessCode: '' }, { merge: true });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid access code' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to validate access code' });
  }
};