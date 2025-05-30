import { db } from '../config/firebase.js';
import { makeVoiceCall } from '../services/stringee.service.js';

// Helper: Định dạng số điện thoại về dạng quốc tế (84...)
function formatPhoneNumberToInternational(phoneNumber) {
  if (phoneNumber.startsWith('0')) {
    return '84' + phoneNumber.slice(1);
  }
  return phoneNumber;
}

export const createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const formattedPhone = formatPhoneNumberToInternational(phoneNumber);

  // Tạo mã truy cập ngẫu nhiên 6 chữ số
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Lưu mã vào Firestore
    await db.collection('users').doc(formattedPhone).set({ accessCode }, { merge: true });

    // Gửi mã qua cuộc gọi bằng Stringee
    await makeVoiceCall(formattedPhone, `Mã xác thực của bạn là: ${accessCode.split('').join(' ')}`);

    console.log(`Access code for ${formattedPhone}: ${accessCode}`);

    res.json({ accessCode });
  } catch (error) {
    console.error('Error creating access code:', error.message);
    res.status(500).json({ error: 'Failed to create access code' });
  }
};

export const validateAccessCode = async (req, res) => {
  const { phoneNumber, accessCode } = req.body;
  if (!phoneNumber || !accessCode) {
    return res.status(400).json({ error: 'Phone number and access code are required' });
  }

  const formattedPhone = formatPhoneNumberToInternational(phoneNumber);

  try {
    const userDoc = await db.collection('users').doc(formattedPhone).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedCode = userDoc.data().accessCode;
    if (storedCode === accessCode) {
      // Xóa mã truy cập sau khi xác thực
      await db.collection('users').doc(formattedPhone).set({ accessCode: '' }, { merge: true });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid access code' });
    }
  } catch (error) {
    console.error('Error validating access code:', error.message);
    res.status(500).json({ error: 'Failed to validate access code' });
  }
};
