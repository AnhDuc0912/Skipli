const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCaptions = async (socialNetwork, subject, tone) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Hãy tạo 5 caption mạng xã hội bằng tiếng Việt cho nền tảng ${socialNetwork}, chủ đề: "${subject}", với tông giọng ${tone}.
  Chỉ liệt kê danh sách các ý tưởng, không cần tiêu đề hoặc phần mở đầu.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const captions = text
      .split('\n')
      .map(line => line.replace(/^\d+[\.\)]?\s*/, '').trim())
      .filter(line => line.length > 0);

    return captions.slice(0, 5);
  } catch (error) {
    console.error('Lỗi khi tạo caption:', error);
    throw error;
  }
};

const generatePostIdeas = async (topic) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Hãy liệt kê 12 ý tưởng bài đăng mạng xã hội về chủ đề "${topic}" bằng tiếng Việt. 
  Chỉ liệt kê danh sách các ý tưởng, không cần tiêu đề hoặc phần mở đầu. 
  Mỗi ý tưởng viết thành 1 đoạn văn bản đầy đủ.`;
    
  try {
    const result = await model.generateContent(prompt);
    const ideas = result.response.text().split('\n').filter(line => line.trim());
    return ideas.slice(0, 10); // Đảm bảo trả về đúng 10 ý tưởng
  } catch (error) {
    console.error('Error generating post ideas:', error);
    throw error;
  }
};

module.exports = { generateCaptions, generatePostIdeas };