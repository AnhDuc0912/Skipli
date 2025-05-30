import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Share, Save } from "@mui/icons-material";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

function GenerateIdeasTab({ phoneNumber, setError, setSuccess }) {
  const [socialMedia, setSocialMedia] = useState("Facebook");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Vui vẻ");
  const [postIdeas, setPostIdeas] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const handleGeneratePostIdeas = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Vui lòng nhập chủ đề.");
      return;
    }
    if (!phoneNumber) {
      setError("Không tìm thấy số điện thoại. Vui lòng đăng nhập lại.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setPostIdeas([]);
    setSelectedIdeas([]);
    setCaptions([]);

    try {
      const response = await fetch(`${API_BASE_URL}/GeneratePostIdeas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: topic, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok && data.ideas) {
        setPostIdeas(data.ideas);
        setSuccess("Đã tạo 10 ý tưởng bài đăng thành công!");
      } else {
        setError(data.error || "Không thể tạo ý tưởng. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Lỗi kết nối server hoặc API. Vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = (idea) => {
    setSelectedIdeas((prev) =>
      prev.includes(idea) ? prev.filter((i) => i !== idea) : [...prev, idea]
    );
  };

  const handleGenerateCaptionsForIdeas = async () => {
    if (selectedIdeas.length === 0) {
      setError("Vui lòng chọn ít nhất một ý tưởng.");
      return;
    }
    if (!phoneNumber) {
      setError("Không tìm thấy số điện thoại. Vui lòng đăng nhập lại.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setCaptions([]);

    try {
      const captionsPromises = selectedIdeas.map(async (idea) => {
        const response = await fetch(`${API_BASE_URL}/GeneratePostCaptions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            socialNetwork: socialMedia,
            subject: idea,
            tone,
            phoneNumber,
          }),
        });

        const data = await response.json();
        if (response.ok && data.captions) {
          return data.captions.map((caption) => ({ idea, caption }));
        }
        throw new Error(data.error || "Không thể tạo chú thích.");
      });

      const captionsResults = (await Promise.all(captionsPromises)).flat();
      setCaptions(captionsResults);
      setSuccess("Đã tạo chú thích cho ý tưởng thành công!");
    } catch (error) {
      setError("Lỗi khi tạo chú thích. Vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCaption = async (captionObj) => {
    if (!phoneNumber) {
      setError("Không tìm thấy số điện thoại. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await addDoc(collection(db, "users", phoneNumber, "captions"), {
        phoneNumber,
        socialMedia,
        topic: captionObj.idea,
        tone,
        caption: captionObj.caption,
        createdAt: new Date().toISOString(),
      });
      setSuccess("Đã lưu chú thích thành công!");
    } catch (error) {
      setError("Không thể lưu chú thích.");
      console.error("Lỗi lưu chú thích:", error);
    }
  };

  const handleShareCaption = (captionObj) => {
    const shareText = encodeURIComponent(captionObj.caption);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareText}`;
    const emailUrl = `mailto:?subject=Chia sẻ chú thích&body=${shareText}`;

    const shareWindow = window.open("", "_blank", "width=600,height=400");
    shareWindow.document.write(`
      <html>
        <body style="padding: 20px; text-align: center;">
          <h3>Chia sẻ chú thích</h3>
          <p>${captionObj.caption}</p>
          <button onclick="window.open('${facebookUrl}', '_blank')" style="margin: 10px; padding: 10px;">
            Chia sẻ trên Facebook
          </button>
          <button onclick="window.location.href='${emailUrl}'" style="margin: 10px; padding: 10px;">
            Gửi qua Email
          </button>
        </body>
      </html>
    `);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tạo ý tưởng bài đăng và chú thích
      </Typography>
      <Box component="form" onSubmit={handleGeneratePostIdeas} sx={{ mb: 3 }}>
        <TextField
          label="Chủ đề"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="VD: Du lịch, Ẩm thực"
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{ mt: 2 }}
        >
          Tạo ý tưởng
        </Button>
      </Box>
      {postIdeas.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ý tưởng bài đăng
          </Typography>
          <List>
            {postIdeas.map((idea, index) => (
              <ListItem key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedIdeas.includes(idea)}
                      onChange={() => handleSelectIdea(idea)}
                    />
                  }
                  label={idea}
                />
              </ListItem>
            ))}
          </List>
          <FormControl fullWidth margin="normal">
            <InputLabel>Mạng xã hội</InputLabel>
            <Select
              value={socialMedia}
              onChange={(e) => setSocialMedia(e.target.value)}
              label="Mạng xã hội"
            >
              <MenuItem value="Facebook">Facebook</MenuItem>
              <MenuItem value="Instagram">Instagram</MenuItem>
              <MenuItem value="Twitter">Twitter</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tông giọng</InputLabel>
            <Select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              label="Tông giọng"
            >
              <MenuItem value="Vui vẻ">Vui vẻ</MenuItem>
              <MenuItem value="Chuyên nghiệp">Chuyên nghiệp</MenuItem>
              <MenuItem value="Hài hước">Hài hước</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleGenerateCaptionsForIdeas}
            fullWidth
            disabled={loading || selectedIdeas.length === 0}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ mt: 2 }}
          >
            Chat
          </Button>
        </Box>
      )}
      {captions.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Chú thích ứng với ý tưởng
          </Typography>
          <List>
            {captions.map(({ idea, caption }, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <ListItemText primary={caption} secondary={`Ý tưởng: ${idea}`} />
                  </CardContent>
                  <CardActions>
                    <IconButton
                      onClick={() => handleSaveCaption({ idea, caption })}
                      color="primary"
                      title="Lưu chú thích"
                    >
                      <Save />
                    </IconButton>
                    <IconButton
                      onClick={() => handleShareCaption({ caption })}
                      color="primary"
                      title="Chia sẻ chú thích"
                    >
                      <Share />
                    </IconButton>
                  </CardActions>
                </Card>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default GenerateIdeasTab;