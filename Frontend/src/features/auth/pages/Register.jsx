import './Login.scss'
import {useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { useState } from 'react'

const Register = () => {
  const navigate = useNavigate();
  const {loading, handleRegister} = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e)=>{
  e.preventDefault();
  setError("");
  try {
    await handleRegister({username, email, password});
    navigate("/login");
  } catch (err) {
    setError(err?.response?.data?.message || "Registration failed. Please try again.");
  }
}
if(loading){
  return <div>Loading...</div>
}

  return (
    <main>
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {error && <div style={{color: "red", marginBottom: "15px"}}>{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" placeholder="Enter your username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email"  placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Enter your password" required />
          </div>
          <button type="submit">Register</button>
        </form>
        <div className="redirect-link">
          <p>Already have an account? <a onClick={() => navigate("/login")}>Login here</a></p>
        </div>
        
      </div>
    </main>
  )
}

export default Register