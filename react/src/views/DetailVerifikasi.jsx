import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";
import getImageUrl from "../functions/getImage";
import downloadImage from "../functions/downloadImage";
import { toast } from "react-toastify";
import { useStateContext } from "../contexts/ContextProvider";

const DetailVerifikasi = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [catatan, setCatatan] = useState("");
    const { user } = useStateContext();
    const [verificationMelanomaStatus, setVerificationMelanomaStatus] =
        useState("melanoma");

    const handleVerificationMelanomaChange = (event) => {
        setVerificationMelanomaStatus(event.target.value);
    };

    const fetchData = async () => {
        try {
            const response = await axiosClient.get(`verification/${id}`);
            if (response.status === 200) {
                const data = response.data;
                setData(data);
                setCatatan(data.skin_analysis.catatanDokter || "");
                setVerificationMelanomaStatus(
                    data.verified_melanoma == "1"
                        ? "melanoma"
                        : "bukan melanoma"
                );
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching the data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const navigate = useNavigate();

    const updateVerification = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.put(`updateVerification/${id}`, {
                verifiedMelanoma: verificationMelanomaStatus === "melanoma",
                catatanDokter: catatan,
                doctor_id: user.id,
            });

            if (response.status === 200) {
                setLoading(false);
                toast.success("Berhasil memperbarui verifikasi");
                navigate("/dokter/riwayatVerifikasi");
            } else {
                setLoading(false);
                toast.error("Gagal memperbarui verifikasi");
            }
        } catch (error) {
            console.error("Error updating verification", error);
            setLoading(false);
            toast.error("Gagal memperbarui verifikasi");
        }
    };

    const submitVerification = () => {
        confirmAlert({
            title: "Perbarui Verifikasi",
            message: "Yakin ingin memperbarui verifikasi?",
            buttons: [
                {
                    label: "Batalkan",
                    onClick: () => console.log("Batalkan clicked"),
                },
                {
                    label: "Perbarui",
                    onClick: updateVerification,
                },
            ],
            closeOnClickOutside: true,
            closeOnEscape: true,
        });
    };

    const hitungUmur = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();

        if (isNaN(birthDate)) {
            return "Invalid Date";
        }

        const age = today.getFullYear() - birthDate.getFullYear();
        const isBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());

        return isBirthdayPassed ? age : age - 1;
    };

    let [color, setColor] = useState("#2AA8FF");

    return (
        <div className="flex flex-col justify-between w-screen mt-8">
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
            {!loading && data && (
                <div className="flex flex-col gap-4 container">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="bg-white p-8 rounded-md shadow-md">
                            <div className="mb-3">
                                <h4>Detail Pasien</h4>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="m-0 pb-[1px]">Nama</div>
                                <h6>
                                    {data.user.firstName +
                                        " " +
                                        data.user.lastName}
                                </h6>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="m-0 pb-[1px]">
                                    Nomor Telepon
                                </div>
                                <h6>{data.user.number}</h6>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="m-0 pb-[1px]">Email</div>
                                <h6>{data.user.email}</h6>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="m-0 pb-[1px]">Umur</div>
                                <h6>{hitungUmur(data.user.birthdate)}</h6>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="m-0 pb-2">Keluhan</div>
                                <div className="p-3 border border-black h-52 w-80 overflow-y-auto">
                                    {data.skin_analysis.keluhan == null ||
                                    data.skin_analysis.keluhan === ""
                                        ? "Tidak ada"
                                        : data.skin_analysis.keluhan}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-md shadow-md w-full">
                            <div className="mb-3">
                                <h4>Prediksi Penyakit</h4>
                            </div>
                            <div className="flex flex-col lg:flex-row mt-8">
                                <div
                                    className={`poppin-font text-white bg-white container flex items-center flex-col`}
                                >
                                    <div className="w-80 flex items-center justify-center h-80 relative">
                                        <img
                                            className="object-cover w-80 h-80"
                                            src={getImageUrl(
                                                data.skin_analysis.image_path
                                            )}
                                            alt=""
                                        />
                                    </div>
                                    <div className="pt-4 flex gap-4 mb-4 lg:mb-0">
                                        <div className="bg-primaryTW rounded-md px-12 py-2">
                                            <button
                                                onClick={() =>
                                                    downloadImage(
                                                        data.skin_analysis
                                                            .image_path
                                                    )
                                                }
                                                type="button"
                                            >
                                                Unduh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <div className="flex gap-3 ">
                                            <div className="w-28">Melanoma</div>
                                            <div>
                                                :{" "}
                                                {data.skin_analysis
                                                    .analysis_percentage > 60
                                                    ? "Iya"
                                                    : "Tidak"}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-30">
                                            <div className="w-28">
                                                Keakuratan
                                            </div>
                                            <div>
                                                <div
                                                    className={`text-start ${
                                                        data.skin_analysis
                                                            .analysis_percentage >
                                                        60
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    :{" "}
                                                    {
                                                        data.skin_analysis
                                                            .analysis_percentage
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 ">
                                            <div className="w-28">Status</div>
                                            <div>
                                                :{" "}
                                                <span
                                                    className={`${
                                                        data.skin_analysis
                                                            .verified == "1"
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    } `}
                                                >
                                                    {data.skin_analysis.verified
                                                        ? "verified"
                                                        : "unverified"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-md shadow-md mb-8">
                        <div className="flex justify-between">
                            <div>
                                <div className="mb-3">
                                    <h4>Verifikasi Hasil Deteksi</h4>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <div className="flex flex-col gap-2 mb-2">
                                    <div className="text-sm text-gray-500">
                                        *Verifikasi Melanoma
                                    </div>
                                    <div className="pl-1">
                                        <select
                                            value={verificationMelanomaStatus}
                                            onChange={
                                                handleVerificationMelanomaChange
                                            }
                                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="melanoma">
                                                Melanoma
                                            </option>
                                            <option value="bukan melanoma">
                                                Bukan Melanoma
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-1 mt-1">
                                <h5>Catatan : </h5>
                            </div>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Berikan catatan disini"
                                className="p-3 border border-black h-52 w-full overflow-y-auto"
                            />
                            <button
                                type="button"
                                onClick={submitVerification}
                                className="pt-2 flex gap-4 self-end mt-3"
                            >
                                <div className="bg-primaryTW text-white rounded-md px-12 py-2">
                                    <text type="button">Perbarui</text>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailVerifikasi;
