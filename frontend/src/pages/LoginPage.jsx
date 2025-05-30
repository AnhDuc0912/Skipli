import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập số điện thoại, 2: Nhập mã xác thực
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const validateAccessCode = (code) => {
    return /^\d{6}$/.test(code);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/CreateNewAccessCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok && data.accessCode) {
        setSuccess("Vui lòng chờ cuộc gọi để nhận mã xác thực!");
        setStep(2);
      } else {
        setError(data.error || "Không thể gửi mã xác thực. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Lỗi kết nối server. Vui lòng kiểm tra lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccessCode(accessCode)) {
      setError("Mã xác thực phải là 6 chữ số.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/ValidateAccessCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, accessCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("phoneNumber", phoneNumber);
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Mã xác thực không đúng. Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      setError("Lỗi kết nối server. Vui lòng kiểm tra lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Xác thực số điện thoại
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handlePhoneSubmit} sx={{ mb: 2 }}>
          <TextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="+84869761465 hoặc 0869761465"
            autoFocus={step === 1}
            disabled={loading}
            inputProps={{ maxLength: 15 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="small"
                    type="submit"
                    disabled={loading}
                    sx={{
                      minWidth: "80px",
                      height: "32px",
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      textTransform: "none",
                    }}
                  >
                    {loading ? <CircularProgress size={16} color="inherit" /> : "Gửi mã"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box component="form" onSubmit={handleCodeSubmit}>
          <TextField
            label="Mã xác thực"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Nhập mã 6 chữ số"
            autoFocus={step === 2}
            disabled={loading || step === 1}
            inputProps={{ maxLength: 6, inputMode: "numeric" }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading || step === 1}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ mt: 1, mr: 2 }}
          >
            Xác minh mã
          </Button>
          {step === 2 && (
            <Button
              variant="text"
              onClick={() => {
                setStep(1);
                setAccessCode("");
                setError("");
                setSuccess("");
              }}
              sx={{ mt: 1 }}
            >
              Quay lại
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;