import { useState } from "react";
import axiosClient from "../../axios-client";

const Daftar = ({ openLogin, closeModal, openBerhasil }) => {
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [namaDepan, setNamaDepan] = useState("");
    const [namaBelakang, setNamaBelakang] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [isAgree, setIsAgree] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const isFormValid =
        !isAgree ||
        password === "" ||
        phoneNumber === "" ||
        namaDepan === "" ||
        namaBelakang === "" ||
        birthdate === "" ||
        password === "" ||
        confirmationPassword === "" ||
        (password !== confirmationPassword &&
            password != "" &&
            confirmationPassword != "");

    const handleSubmit = async () => {
        try {
            if (
                email === "" ||
                password === "" ||
                phoneNumber === "" ||
                namaDepan === "" ||
                namaBelakang === "" ||
                birthdate === "" ||
                password === "" ||
                confirmationPassword === ""
            ) {
                return;
            }

            if (password !== confirmationPassword) {
                setErrorMessage("Kata sandi berbeda");
                return;
            }

            const response = await axiosClient.post("/register", {
                firstName: namaDepan,
                lastName: namaBelakang,
                number: phoneNumber,
                email: email,
                birthdate: birthdate,
                password: password,
            });

            console.log(response.data);

            openBerhasil();
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div className="flex flex-col w-screen">
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
                                <div className="font-bold text-3xl">Daftar</div>
                                <div className="font-light mt-2">
                                    Buat akun Anda
                                </div>
                            </div>
                            <div className="grid grid-cols-2 mb-3 gap-3 w-full">
                                <div className="flex flex-col w-full">
                                    <h7>Nama Depan</h7>
                                    <div className="input-group w-full">
                                        <input
                                            className="p-1 border-2 rounded-md w-full border-primaryTW"
                                            type="text"
                                            onChange={(event) => {
                                                setNamaDepan(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h7>Nama Belakang</h7>
                                    <div className="input-group">
                                        <input
                                            className="p-1 border-[2px] rounded-md w-full border-primaryTW"
                                            type="text"
                                            onChange={(event) => {
                                                setNamaBelakang(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h7>Email</h7>
                                    <div className="input-group">
                                        <input
                                            className="p-1 border-2 rounded-md w-full border-primaryTW"
                                            type="email"
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h7>No. Telepon</h7>
                                    <div className="input-group">
                                        <input
                                            className="p-1 border-2 rounded-md w-full border-primaryTW"
                                            type="number"
                                            onChange={(event) => {
                                                setPhoneNumber(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h7>Kata Sandi</h7>
                                    <div className="input-group">
                                        <input
                                            className={`p-1 border-2 rounded-md w-full focus:outline-none  ${
                                                password !==
                                                confirmationPassword &&
                                                password != "" &&
                                                confirmationPassword != ""
                                                    ? "border-red-500"
                                                    : "border-primaryTW"
                                            } `}
                                            type="password"
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h7>Konfirmasi Kata Sandi</h7>
                                    <div className="input-group">
                                        <input
                                            className={`p-1 border-2 rounded-md w-full focus:outline-none ${
                                                password !==
                                                confirmationPassword &&
                                                password != "" &&
                                                confirmationPassword != ""
                                                    ? "border-red-500"
                                                    : "border-primaryTW"
                                            } `}
                                            type="password"
                                            onChange={(event) => {
                                                setConfirmationPassword(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h7>Tanggal Lahir</h7>
                                    <div className="input-group">
                                        <input
                                            className="p-1 border-2 rounded-md w-full border-primaryTW"
                                            type="date"
                                            onChange={(event) => {
                                                setBirthdate(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {password !== confirmationPassword &&
                                password != "" &&
                                confirmationPassword != "" && (
                                    <div className="pb-2 text-red-500">
                                        (Kata Sandi tidak sama)
                                    </div>
                                )}
                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="formCheck"
                                    checked={isAgree}
                                    onChange={(event) => {
                                        setIsAgree(event.target.checked);
                                    }}
                                />
                                <label
                                    htmlFor="formCheck"
                                    className="form-check-label text-secondary"
                                >
                                    <small>
                                        Saya setuju dengan persyaratan
                                        penggunaan
                                    </small>
                                </label>
                            </div>
                            <div className="mb-4 poppin-font text-white ">
                                <div
                                    className={` ${
                                        isFormValid
                                            ? "bg-gray-500"
                                            : "bg-primaryTW"
                                    }  rounded-md px-12 py-2 `}
                                >
                                    <button
                                        disabled={isFormValid}
                                        type="button"
                                        onClick={handleSubmit}
                                    >
                                        <div className="font-bold text-center">
                                            Daftar
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <small>
                                    Sudah memiliki akun?{" "}
                                    <a
                                        href="#"
                                        className="no-underline"
                                        onClick={openLogin}
                                    >
                                        Masuk
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

export default Daftar;
