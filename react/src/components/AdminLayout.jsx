import {NavigationBarAdminDoctor} from "./NavigationBar.jsx";
import {Outlet} from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-primaryAlternativeTW font-poppins">
            <NavigationBarAdminDoctor/>
            <div className="flex-grow">
                <Outlet/>
            </div>
        </div>
    );
};

export default AdminLayout;
