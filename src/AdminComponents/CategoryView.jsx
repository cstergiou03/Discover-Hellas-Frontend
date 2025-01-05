import AdminSidebar from "./AdminSidebar";
import ProfileSidebarAdmin from "./ProfileSidebarAdmin";
import "../StyleAdmin/amenityView.css"
import CategoryForm from "./CategoryForm";

function CategoryView(){

    return(
        <div className="amenity-view-container">
            <AdminSidebar/>
            <CategoryForm/>
            <ProfileSidebarAdmin/>
        </div>
    );
}   

export default CategoryView;