import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );
      dispatch(
        setCredentials({ accessToken: res.data.accessToken, userId: 0 })
      ); // userId will improve later
      alert("Registration successful!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterPage;
