import { useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import RingLoader from "react-spinners/RingLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({
    openSignup,
    closeModal,
    openResetKataSandi,
    openBerhasil,
}) => {
    const { loginUser } = useStateContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#2AA8FF");

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.post("/login", {
                email: email,
                password: password,
            });

            const { user, token, role } = response.data;

            // if (user.verified !== 1 && role !== 'admin') {
            //     setLoading(false);
            //     toast.error("Akun sedang diverifikasi oleh Admin");
            //     return;
            // }

            console.log("Token received:", token);
            localStorage.setItem("token", token);
            console.log(response.data);
            loginUser(user, token, role);
            openBerhasil();
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
            console.error(error.response.data);
        }
    };

    return (
        <div className="flex flex-col w-screen">
            <ToastContainer />
            {loading && (
                <div className="fixed top-0 left-0 w-full h-screen z-50">
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <RingLoader
                            color={color}
                            loading={loading}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </div>
            )}
            <div className="container d-flex justify-content-center align-items-center min-vh-100 font-poppins">
                <div className="border rounded-5 p-5 bg-white shadow w-50">
                    <div className="right-box">
                        <div className="align-items-center flex flex-col items-center">
                            <div className="mb-4 flex w-full justify-between">
                                <h5>My Skin</h5>
                                <p
                                    className="text-muted cursor-pointer"
                                    onClick={closeModal}
                                >
                                    X
                                </p>
                            </div>
                            <div className="flex flex-col items-center mb-8">
                                <div className="font-bold text-3xl">Masuk</div>
                                <div className="font-light mt-2">
                                    Masuk untuk tetap terhubung
                                </div>
                            </div>
                            <div className="flex flex-col w-full mb-3">
                                <div>Email</div>
                                <div className="input-group pt-1">
                                    <input
                                        className="p-2 border-2 w-full rounded-md border-primaryTW"
                                        type="text"
                                        onChange={handleEmailChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full mb-3">
                                <div>Kata Sandi</div>
                                <div className="input-group pt-1">
                                    <input
                                        className="p-2 border-2 w-full rounded-md border-primaryTW"
                                        type="password"
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-5 d-flex justify-content-between mt-2">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="formCheck"
                                    />
                                    <label
                                        htmlFor="formCheck"
                                        className="form-check-label text-secondary"
                                    >
                                        <small>Remember Me</small>
                                    </label>
                                </div>
                                <div className="forgot">
                                    <small>
                                        <a
                                            className="no-underline"
                                            onClick={openResetKataSandi}
                                            href="#"
                                        >
                                            Lupa Kata Sandi?
                                        </a>
                                    </small>
                                </div>
                            </div>
                            <div className="mb-4 poppin-font text-white ">
                                <div className=" bg-primaryTW  rounded-md px-12 py-2 ">
                                    <button type="button">
                                        <div
                                            className="font-bold text-center"
                                            onClick={handleSubmit}
                                        >
                                            Masuk
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4 text-center text-gray-500">
                                <small>
                                    Email harus mengandung salah satu dari
                                    domain berikut:
                                    <span className="text-primaryTW">
                                        {" "}
                                        @pasien.myskin.ac.id
                                    </span>{" "}
                                    untuk Login sebagai pasien, atau
                                    <span className="text-primaryTW">
                                        {" "}
                                        <br />
                                        @dokter.myskin.ac.id
                                    </span>{" "}
                                    untuk Login sebagai dokter.
                                </small>
                            </div>
                            <div>
                                <small>
                                    Belum memiliki akun?{" "}
                                    <a
                                        href="#"
                                        className="no-underline"
                                        onClick={openSignup}
                                    >
                                        Klik disini untuk daftar
                                    </a>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
