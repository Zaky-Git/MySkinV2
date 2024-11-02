import { useStateContext } from "../contexts/ContextProvider";
import { BsCheck2Circle } from "react-icons/bs";
const Berhasil = ({ closeModal }) => {
    const { setUser, setToken } = useStateContext();

    return (
        <div className="flex flex-col w-screen">
            <div className="container d-flex justify-content-center align-items-center min-vh-100 font-poppins">
                <div className="border rounded-5 p-5 bg-white shadow w-50">
                    <div className="right-box">
                        <div className="align-items-center flex flex-col items-center gap-2">
                            <div className="text-7xl text-primaryTW">
                                <BsCheck2Circle />
                            </div>
                            <div>
                                <h1 className="text-5xl text-primaryTW">
                                    Berhasil !
                                </h1>
                            </div>
                            <div className="mt-2 poppin-font text-white ">
                                <div className=" bg-primaryTW  rounded-md px-6 py-2 ">
                                    <button type="button">
                                        <div
                                            className="font-bold text-center text-sm"
                                            onClick={closeModal}
                                        >
                                            Kembali ke beranda
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Berhasil;
