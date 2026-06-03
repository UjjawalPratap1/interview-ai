import './Login.scss'
import {useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { useState } from 'react'

const Login = () => {
  const {loading, handleLogin} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e)=>{
  e.preventDefault();
  setError("");
  try {
    await handleLogin({email, password});
    navigate("/");
  } catch (err) {
    setError(err?.response?.data?.message || "Login failed. Please try again.");
  }
}
if(loading){
  return <div>Loading...</div>
}

  return (
    <main>
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div style={{color: "red", marginBottom: "15px"}}>{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email"  placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Enter your password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="redirect-link">
          <p>Don't have an account? <a onClick={() => navigate("/register")}>Register here</a></p>
        </div>
      </div>
    </main>
  )
}

export default Login