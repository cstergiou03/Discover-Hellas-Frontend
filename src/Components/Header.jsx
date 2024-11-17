import logo from "../assets/logo2.png";
import "../Style/header.css";

function Header() {

    return (
        <header className="header">
            <img src={logo} alt="Company Logo" className="logo" />
            <nav className="navigation">
                <div className="dropdown">
                    <span className="dropdown-title">Προορισμοί</span>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <a href="/trip">Οργάνωσε το ταξίδι σου</a>
                <a href="/trip">Εκδηλώσεις</a>
                <a href="/trip">Εμπειρίες</a>
                <a href="/trip">Πάροχοι</a>
                <input />
                <button>EN</button>
            </nav>
        </header>

    );
}

export default Header;