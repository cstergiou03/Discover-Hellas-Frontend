import "../Style/footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <p>Discover Hellas</p>
                </div>
                <div className="footer-links">
                    <ul>
                        <li><a href="/destination">Προορισμοί</a></li>
                        <li><a href="/map">Οργάνωσε το ταξίδι σου</a></li>
                        <li><a href="/events">Εκδηλώσεις</a></li>
                        <li><a href="/activity">Δραστηριότητες</a></li>
                        <li><a href="/provider">Πάροχοι</a></li>
                    </ul>
                    <p className="footer-text">© 2024 Discover Hellas | All rights reserved</p>
                    {/* <ul>
                        <li><a href="/terms">Terms of Use</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/contact">Επικοινωνία</a></li>
                    </ul> */}
                </div>
                <div className="footer-socials">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
