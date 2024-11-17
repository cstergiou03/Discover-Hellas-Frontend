import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import PageTop from "./PageTop.jsx";
import "../Style/mainPanel.css";

function MainPanel() {
    return (
        // <div className="main-container">
        //     <div className="top-container">
        //         <img src={sounio} className="greece-photo" />
        //         <Header></Header>
        //         <div className="welcome-container">
        //             <h1 className="blue">Welcome</h1><h1 className="white">To</h1><h1 className="blue">Greece</h1>
        //         </div>
        //     </div>
        //     <div className="mid-container">
        //         <h2>Cities of Greece</h2>
        //     </div>
        //     <Footer />
        // </div>
        <div className="main-container">
            <PageTop></PageTop>
            {/* <Footer/> */}
        </div>
        
    );
}

export default MainPanel;
