import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import API_URL from "../api";

type JwtPayload = {
  userId: number;
  iat: number;
  exp: number;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_URL}
/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const accessToken = res.data.accessToken;

      // ✅ Decode token to get userId
      const decoded = jwtDecode<JwtPayload>(accessToken);

      // ✅ Dispatch with correct userId
      dispatch(setCredentials({ accessToken, userId: decoded.userId }));

      alert("Login successful!");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
