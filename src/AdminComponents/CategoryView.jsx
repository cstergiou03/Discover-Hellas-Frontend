import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/amenityView.css"
import CategoryForm from "./CategoryForm";
import { useState, useEffect } from "react";

function CategoryView(){
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 950);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 950);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return(
        <div className="amenity-view-container">
            <AdminSidebar/>
            <CategoryForm/>
            {!isSmallScreen && <ProfileSidebarAdmin />}
        </div>
    );
}   

export default CategoryView;