import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  ListItemText,
  IconButton,
  CardActions,
} from "@mui/material";
import { Share, Delete } from "@mui/icons-material";
import { db } from "../config/firebase";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";

function ProfileTab({ phoneNumber, setError }) {
  const [savedCaptions, setSavedCaptions] = useState([]);

  // Lấy danh sách chú thích đã lưu từ Firebase
  useEffect(() => {
    if (phoneNumber) {
      const fetchSavedCaptions = async () => {
        try {
          const q = query(
            collection(db, "users", phoneNumber, "captions"),
            where("phoneNumber", "==", phoneNumber)
          );
          const querySnapshot = await getDocs(q);
          const captionsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSavedCaptions(captionsList);
        } catch (error) {
          console.error("Error fetching saved captions:", error);
          setError("Không thể tải chú thích đã lưu.");
        }
      };
      fetchSavedCaptions();
    }
  }, [phoneNumber, setError]);

  // Xóa chú thích khỏi Firebase
  const handleUnsaveCaption = async (captionId) => {
    if (!phoneNumber) {
      setError("Không tìm thấy số điện thoại. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const captionRef = doc(db, "users", phoneNumber, "captions", captionId);
      await deleteDoc(captionRef);
      // Cập nhật giao diện
      setSavedCaptions((prev) => prev.filter((caption) => caption.id !== captionId));
    } catch (error) {
      console.error("Error deleting caption:", error);
      setError("Không thể xóa chú thích.");
    }
  };

  // Chia sẻ chú thích
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
      <Typography variant="h5" gutterBottom>
        Chú thích đã lưu
      </Typography>
      {savedCaptions.length === 0 ? (
        <Typography>Chưa có chú thích nào được lưu.</Typography>
      ) : (
        <List>
          {savedCaptions.map((caption) => (
            <ListItem key={caption.id} sx={{ mb: 2 }}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <ListItemText
                    primary={caption.caption}
                    secondary={`Chủ đề: ${caption.topic} | Mạng: ${caption.socialMedia} | Tông giọng: ${caption.tone}`}
                  />
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleUnsaveCaption(caption.id)}
                    color="error"
                    title="Xóa chú thích"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShareCaption(caption)}
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
      )}
    </Box>
  );
}

export default ProfileTab;