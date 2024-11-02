import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";
import axiosClient from "../../axios-client";
import { ClipLoader } from "react-spinners";
import getImageUrl from "../functions/getImage";
import downloadImage from "../functions/downloadImage";
import { toast } from "react-toastify";
import { useStateContext } from "../contexts/ContextProvider";

const DetailPengajuan = () => {
    const { id } = useParams();
    const location = useLocation();
    const { item } = location.state || {};
    const [data, setData] = useState(item || null);
    const [loading, setLoading] = useState(!item);
    const [catatan, setCatatan] = useState(
        item?.skin_analysis?.catatanDokter || ""
    );
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
                setData(response.data);
                setCatatan(response.data.skin_analysis.catatanDokter);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching the data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!item) {
            fetchData();
        }
    }, [id]);

    const navigate = useNavigate();

    const submitVerification = () => {
        confirmAlert({
            title: "Simpan Verifikasi",
            message: "Yakin ingin verifikasi?",
            buttons: [
                {
                    label: "Batalkan",
                    onClick: () => console.log("Batalkan clicked"),
                },
                {
                    label: "Verifikasi",
                    onClick: async () => {
                        setLoading(true);
                        const response = await axiosClient.post(
                            `verifikasiSkin/${id}`,
                            {
                                verifiedMelanoma:
                                    verificationMelanomaStatus === "melanoma",
                                catatanDokter: catatan,
                                doctor_id: user.id,
                            }
                        );

                        if (response.status === 200) {
                            setLoading(false);
                            toast.success("Berhasil verifikasi");
                            navigate("/dokter/riwayatVerifikasi");
                        }
                        setLoading(false);
                    },
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
        <div className="flex flex-col justify-between w-screen mt-8 mb-8">
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
            {data?.doctor ? (
                <div className="flex flex-col gap-4 container">
                    <div className="flex flex-col mb-4">
                        <div className="bg-white p-8 rounded-md shadow-md font-bold">
                            Diverifikasi Oleh :{" "}
                            {data?.doctor?.firstName +
                                " " +
                                data?.doctor?.lastName}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 container">
                    <div className="flex flex-col mb-4">
                        <div className="bg-white p-8 rounded-md shadow-md font-bold">
                            Belum diverifikasi
                        </div>
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
                        <div className="bg-white p-8 rounded-md shadow-md  w-full">
                            <div className="mb-3">
                                <h4>Prediksi Penyakit</h4>
                            </div>
                            <div className="flex flex-col xl:flex-row mt-8">
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
                                                onClick={downloadImage(
                                                    data.skin_analysis
                                                        .image_path
                                                )}
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
                                                <span className="text-red-500">
                                                    {data.skin_analysis.verified
                                                        ? "verified"
                                                        : "unverified"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-md mt-4">
                                        <div className="flex flex-col">
                                            <div className="mb-1 mt-1">
                                                <h5>Catatan Dokter : </h5>
                                            </div>
                                            <div className="p-3 border border-black h-52  overflow-y-auto">
                                                {catatan == null ||
                                                catatan === ""
                                                    ? "Tidak ada"
                                                    : catatan}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailPengajuan;
