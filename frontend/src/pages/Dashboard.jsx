import { useState } from "react";
import {
  Container,
  Box,
  Alert as MuiAlert,
  Snackbar,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import ServiceTab from "../components/ServicesTab";
import ProfileTab from "../components/ProfileTab";

function Dashboard() {
  const [tab, setTab] = useState(0); // 0: Services, 1: Profile
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const phoneNumber = localStorage.getItem("phoneNumber") || "";

  // Nếu không có số điện thoại, hiện cảnh báo tĩnh
  if (!phoneNumber) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <MuiAlert severity="error">
            Vui lòng đăng nhập để truy cập dashboard.
          </MuiAlert>
        </Box>
      </Container>
    );
  }

  // Hiển thị Snackbar khi error hoặc success thay đổi
  const showSnackbar = (message, severity) => {
    if (!message) return;
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleError = (msg) => {
    setError(msg);
    setSuccess("");
    showSnackbar(msg, "error");
  };

  const handleSuccess = (msg) => {
    setSuccess(msg);
    setError("");
    showSnackbar(msg, "success");
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Sidebar tab={tab} setTab={setTab} />

        {tab === 0 && (
          <ServiceTab
            phoneNumber={phoneNumber}
            setError={handleError}
            setSuccess={handleSuccess}
          />
        )}
        {tab === 1 && (
          <ProfileTab
            phoneNumber={phoneNumber}
            setError={handleError}
          />
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarSeverity === "error" ? error : success}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Dashboard;
