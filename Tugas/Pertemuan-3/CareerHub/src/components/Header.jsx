import { FaBriefcase } from "react-icons/fa";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <FaBriefcase className="logo-icon" />
        <h2>CareerHub</h2>
      </div>

      <nav>
        <a href="#">Home</a>
        <a href="#">Jobs</a>
        <a href="#">Companies</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>

      <button className="login-btn">Login</button>
    </header>
  );
}

export default Header;