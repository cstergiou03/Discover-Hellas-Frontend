import "../Style/registerPanel.css";
import Header from "./Header";
import logo from "../../src/assets/logo2.png";

function RegisterPanel() {
    return (
        <div className="register-panel-container">
            <Header />
            <div className="panel-container">
                <img src={logo} alt="Logo" />
                <div className="register-form-container">
                    <h2>Register</h2>
                    <form>
                        <label>Name</label>
                        <input type="text" placeholder="Enter your name" />
                        
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" />
                        
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" />
                        
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPanel;
