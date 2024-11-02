import { useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { BiArrowBack } from "react-icons/bi";
import RingLoader from "react-spinners/RingLoader";

const ResetKataSandi = ({ openLogin, closeModal, openBerhasil }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#2AA8FF");

    const listState = ["inputEmail", "inputPassword"];

    const [state, setState] = useState(listState[0]);

    const handleCheckMail = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.post("/checkEmail", {
                email: email,
            });

            if (response.status == 200) {
                setMessage("");
                setLoading(false);
                setState(listState[1]);
            }
        } catch (error) {
            setLoading(false);
            setMessage(error.response.data.message);
            console.error(error.response.data);
        }
    };

    const handleResetKataSandi = async () => {
        try {
            if (
                password == confirmationPassword &&
                password != "" &&
                confirmationPassword != ""
            ) {
                setLoading(true);
                const response = await axiosClient.post("/changePassword", {
                    email: email,
                    password: password,
                });

                setLoading(false);

                if (response.status == 200) {
                    openBerhasil();
                }
            }
            console.log(password, confirmationPassword);
        } catch (error) {
            setMessage(error.response.data.error);

            setLoading(false);
            console.error(error.response.data);
        }
    };

    return (
        <div className="flex flex-col w-screen">
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
                                <div className="flex gap-2">
                                    <BiArrowBack
                                        className="cursor-pointer my-auto"
                                        onClick={
                                            state == [listState[0]]
                                                ? openLogin
                                                : () => setState(listState[0])
                                        }
                                    />

                                    <h5 className="my-auto">My Skin</h5>
                                </div>
                                <p
                                    className="text-muted cursor-pointer my-auto"
                                    onClick={closeModal}
                                >
                                    X
                                </p>
                            </div>
                            <div className="flex flex-col items-center mb-8">
                                <div className="font-bold text-3xl">
                                    Reset Kata Sandi
                                </div>
                                {state == listState[0] ? (
                                    <div className="font-light mt-2">
                                        Masukan Email Address
                                    </div>
                                ) : (
                                    <div className="font-light mt-2">
                                        Masukan Kata Sandi Baru
                                    </div>
                                )}
                            </div>

                            {state == "inputEmail" ? (
                                <div className="flex flex-col w-full mb-3">
                                    <h7>Email</h7>
                                    <div className="input-group pt-1">
                                        <input
                                            className="p-2 border-2 w-full rounded-md border-primaryTW"
                                            type="text"
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                            }}
                                        />
                                    </div>
                                    {message != "" && (
                                        <div className="text-red-500">
                                            {message}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full">
                                    <div className="flex flex-col w-full mb-3">
                                        <h7>Email</h7>
                                        <div className="input-group pt-1">
                                            <input
                                                className="p-2 border-2 w-full rounded-md"
                                                type="text"
                                                disabled
                                                value={email}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex flex-col w-full mb-3">
                                            <h7>Kata Sandi</h7>
                                            <div className="input-group pt-1">
                                                <input
                                                    className="p-2 border-2 w-full rounded-md border-primaryTW"
                                                    type="password"
                                                    onChange={(e) => {
                                                        setPassword(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full mb-3">
                                            <h7>Konfirmasi Kata Sandi</h7>
                                            <div className="input-group pt-1">
                                                <input
                                                    className="p-2 border-2 w-full rounded-md border-primaryTW"
                                                    type="password"
                                                    onChange={(e) => {
                                                        setConfirmationPassword(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {message != "" && (
                                        <div className="text-red-500">
                                            {message}
                                        </div>
                                    )}
                                </div>
                            )}
                            {state == "inputEmail" ? (
                                <div className="mt-4 poppin-font text-white ">
                                    <div className=" bg-primaryTW  rounded-md px-12 py-2 ">
                                        <button type="button">
                                            <div
                                                className="font-bold text-center"
                                                onClick={() => {
                                                    handleCheckMail();
                                                }}
                                            >
                                                Lanjut
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 poppin-font text-white ">
                                    <div
                                        className={` ${
                                            password == confirmationPassword &&
                                            password != "" &&
                                            confirmationPassword != ""
                                                ? "bg-primaryTW"
                                                : "bg-gray-500"
                                        }   rounded-md px-12 py-2 `}
                                    >
                                        <button type="button">
                                            <div
                                                className="font-bold text-center"
                                                onClick={handleResetKataSandi}
                                            >
                                                Reset
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetKataSandi;
