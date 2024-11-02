import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export const NavigationBar = ({ openModal }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const { user, logoutUser, role } = useStateContext();

    useEffect(() => {
        const path = location.pathname;

        let activeItem = null;
        if (path === "/") {
            activeItem = "deteksiKanker";
        } else if (path === "/faq") {
            activeItem = "faq";
        } else if (path === "/products") {
            activeItem = "products";
        } else if (path === "/about") {
            activeItem = "about";
        } else if (path === "/pengajuan") {
            activeItem = "daftarPengajuan";
        } else if (path === "/pasien/riwayatPengajuan") {
            activeItem = "riwayatPengajuan";
        }

        setActiveItem(activeItem);
    }, [location.pathname]);

    return (
        <>
            {role == "dokter" ? (
                <nav className="navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        {/* Logo / Brand */}
                        <div>
                            <Link className="navbar-brand" to="/">
                                MySkin
                            </Link>
                            {/* Navbar Toggler for small screens */}
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        {/* Navbar Items */}
                        <div>
                            <div className="poppin-font" id="navbarNav">
                                <ul className="navbar-nav ">
                                    <li className="nav-item">
                                        <Link
                                            to="/dokter/dashboard"
                                            className={
                                                "nav-link" +
                                                (activeItem === "deteksiKanker"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem("deteksiKanker")
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/dokter/pengajuan"
                                            className={
                                                "nav-link" +
                                                (activeItem ===
                                                "daftarPengajuan"
                                                    ? " text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onClick={() =>
                                                setActiveItem("daftarPengajuan")
                                            }
                                        >
                                            Daftar Pengajuan
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/dokter/riwayatVerifikasi"
                                            className={
                                                "nav-link" +
                                                (activeItem === "deteksiKanker"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem("deteksiKanker")
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Riwayat Verifikasi
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            {user ? (
                                <div className="flex gap-2">
                                    <div className="my-auto">
                                        {"Hi " + user.firstName}
                                    </div>
                                    <div>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                logoutUser();
                                                window.location.reload();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-ms poppin-font"
                                    onClick={() => openModal("login")}
                                >
                                    Masuk
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            ) : role == "pasien" ? (
                <nav className="navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        {/* Logo / Brand */}
                        <div>
                            <Link className="navbar-brand" to="/">
                                MySkin
                            </Link>
                            {/* Navbar Toggler for small screens */}
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        {/* Navbar Items */}
                        <div>
                            <div className="poppin-font" id="navbarNav">
                                <ul className="navbar-nav ">
                                    <li className="nav-item">
                                        <Link
                                            to="/"
                                            className={
                                                "nav-link" +
                                                (activeItem === "deteksiKanker"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem("deteksiKanker")
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Deteksi Kanker
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/pasien/riwayatDeteksi"
                                            className={
                                                "nav-link" +
                                                (activeItem === "riwayatDeteksi"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem("riwayatDeteksi")
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Riwayat Deteksi
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/pasien/riwayatPengajuan"
                                            className={
                                                "nav-link" +
                                                (activeItem ===
                                                "riwayatPengajuan"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem(
                                                    "riwayatPengajuan"
                                                )
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Riwayat Pengajuan
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/faq"
                                            className={
                                                "nav-link" +
                                                (activeItem === "faq"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() => setActiveItem("faq")}
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            FAQ
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            {user ? (
                                <div className="flex gap-2">
                                    <div className="my-auto">
                                        {"Hi " + user.firstName}
                                    </div>
                                    <div>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                logoutUser();
                                                window.location.reload();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-ms poppin-font"
                                    onClick={() => openModal("login")}
                                >
                                    Masuk
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            ) : role == "admin" ? (
                <nav className="navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        {/* Logo / Brand */}
                        <div>
                            <Link className="navbar-brand" to="/">
                                MySkin
                            </Link>
                            {/* Navbar Toggler for small screens */}
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        {/* Navbar Items */}
                        <div>
                            <div className="poppin-font" id="navbarNav">
                                <ul className="navbar-nav ">
                                    <li className="nav-item">
                                        <Link
                                            to="/admin/dashboard"
                                            className={
                                                "nav-link" +
                                                (activeItem === "deteksiKanker"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem("deteksiKanker")
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/admin/daftarPasien"
                                            className={
                                                "nav-link" +
                                                (activeItem === "faq"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() => setActiveItem("faq")}
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Daftar Pasien
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to="/admin/daftarDokter"
                                            className={
                                                "nav-link" +
                                                (activeItem === "faq"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() => setActiveItem("faq")}
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Daftar Dokter
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/admin/verifikasiPengguna"
                                            className={
                                                "nav-link" +
                                                (activeItem === "faq"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() => setActiveItem("faq")}
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Verifikasi Pengguna
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            {user ? (
                                <div className="flex gap-2">
                                    <div className="my-auto">
                                        {"Hi " + user.firstName}
                                    </div>
                                    <div>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                logoutUser();
                                                window.location.reload();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-ms poppin-font"
                                    onClick={() => openModal("login")}
                                >
                                    Masuk
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className="navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        {/* Logo / Brand */}
                        <div>
                            <Link className="navbar-brand" to="/">
                                MySkin
                            </Link>
                            {/* Navbar Toggler for small screens */}
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        {/* Navbar Items */}
                        <div>
                            <div className="poppin-font" id="navbarNav">
                                <ul className="navbar-nav ">
                                    <li className="nav-item">
                                        <Link
                                            to="/"
                                            className={
                                                "nav-link" +
                                                (activeItem === "deteksiKanker"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() =>
                                                setActiveItem("deteksiKanker")
                                            }
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            Deteksi Kanker
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/faq"
                                            className={
                                                "nav-link" +
                                                (activeItem === "faq"
                                                    ? " focused text-primaryTW"
                                                    : " text-secondaryTW")
                                            }
                                            onFocus={() => setActiveItem("faq")}
                                            onBlur={() => setActiveItem(null)}
                                        >
                                            FAQ
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            {user ? (
                                <div className="flex gap-2">
                                    <div className="my-auto">
                                        {"Hi " + user.firstName}
                                    </div>
                                    <div>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                logoutUser();
                                                window.location.reload();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-ms poppin-font"
                                    onClick={() => openModal("login")}
                                >
                                    Masuk
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
};
// export const NavigationBarAdminDoctor = () => {
//     // Creating a new object with updated properties
//     const updatedProfile = {
//         name: "SUI",
//         picture: "./assets/react.svg",
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-light bg-white">
//             <div className="container">
//                 {/* Logo / Brand */}
//                 <div>
//                     <Link className="navbar-brand" to="/">
//                         Logo
//                     </Link>
//                 </div>

//                 {/* User Profile */}
//                 <div className="d-flex align-items-center">
//                     <div>
//                         <span>{updatedProfile.name}</span>
//                     </div>
//                     <div className="ms-3">
//                         <img
//                             src={updatedProfile.picture}
//                             alt="User Profile"
//                             style={{ width: "50px", borderRadius: "50%" }}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };
