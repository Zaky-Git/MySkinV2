import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const NavigationBar = ({ openModal }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);

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
        }

        setActiveItem(activeItem);
    }, [location.pathname]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
                {/* Logo / Brand */}
                <div>
                    <Link className="navbar-brand" to="/">
                        Logo
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
                        <ul className="navbar-nav">
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
                            <li className="nav-item">
                                <Link
                                    to="/products"
                                    className={
                                        "nav-link" +
                                        (activeItem === "products"
                                            ? " focused text-primaryTW"
                                            : " text-secondaryTW")
                                    }
                                    onFocus={() => setActiveItem("products")}
                                    onBlur={() => setActiveItem(null)}
                                >
                                    Products
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/pengajuan"
                                    className={
                                        "nav-link" +
                                        (activeItem === "daftarPengajuan"
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
                        </ul>
                    </div>
                </div>

                {/* Button */}
                <div>
                    <button
                        className="btn btn-ms poppin-font"
                        onClick={() => openModal("login")}
                    >
                        Masuk
                    </button>
                </div>
            </div>
        </nav>
    );
};
export const NavigationBarAdminDoctor = () => {
    // Creating a new object with updated properties
    const updatedProfile = {
        name: "SUI",
        picture: "./assets/react.svg"
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
                {/* Logo / Brand */}
                <div>
                    <Link className="navbar-brand" to="/">
                        Logo
                    </Link>
                </div>

                {/* User Profile */}
                <div className="d-flex align-items-center">
                    <div>
                        <span>{updatedProfile.name}</span>
                    </div>
                    <div className="ms-3">
                        <img
                            src={updatedProfile.picture}
                            alt="User Profile"
                            style={{width: "50px", borderRadius: "50%"}}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};
