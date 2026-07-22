import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>CareerHub</h2>
        <p>Temukan karier impianmu bersama CareerHub.</p>

        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Jobs</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <p className="copyright">
          © 2026 CareerHub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;