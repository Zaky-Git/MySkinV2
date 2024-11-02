import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { NavigationBar } from "../components/NavigationBar";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, role } = useStateContext();

    if (!user) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-primaryAlternativeTW font-poppins">
            <NavigationBar />
            <div className="flex-grow">
                <Outlet />
            </div>
            {role === "pasien" && (
                <div className="text-muted poppin-font text-center mb-4 mt-4">
                    <p>
                        *Hasil deteksi belum dipastikan benar karena web hanya
                        memberikan indikasi awal, silahkan ajukan hasil
                        verifikasi ke dokter.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProtectedRoute;
