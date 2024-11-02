import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Cropper from "react-easy-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useEffect, useState } from "react";
import getCroppedImg from "../functions/cropImage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../customStyle/confirm.css";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import RingLoader from "react-spinners/RingLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getImageUrl from "../functions/getImage";
import downloadImage from "../functions/downloadImage";

const ITEMS_PER_PAGE = 8;

const DetailDeteksi = () => {
    const { id } = useParams();
    const [imageSrc, setImageSrc] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [state, setState] = useState("upload");
    const [loading, setLoading] = useState(true);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [selectDocterIsChecked, setSelectDocterIsChecked] = useState(false);
    const [selectedDocter, setSelectedDocter] = useState(null);
    const [keakuratan, setKeakuratan] = useState(null);
    const [verified, setVerified] = useState(null);
    const [keluhan, setKeluhan] = useState(null);
    const navigate = useNavigate();
    const [listDokter, setListDokter] = useState(null);
    const [data, setData] = useState(null);

    const [skinAnalysisId, setSkinAnalysisId] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const { user, token, role } = useStateContext();

    useEffect(() => {
        console.log("User:", user);
        console.log("Token:", token);

        if (role == "dokter") {
            navigate("/dokter/dashboard");
        } else if (role == "admin") {
            navigate("/admin/dashboard");
        }
    }, [user, token, role, navigate]);

    const fetchData = async () => {
        try {
            const response = await axiosClient.get("/getSkinAnalysis/" + id);
            setData(response.data);
            setSkinAnalysisId(response.data.skin_analysis.id);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching the data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectDocterIsChecked) {
            getAllDoctors();
        }
    }, [selectDocterIsChecked]);

    const getAllDoctors = async () => {
        setDoctorLoading(true);
        try {
            const response = await axiosClient.get("/doctors");
            setListDokter(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setDoctorLoading(false);
        }
    };

    const reset = () => {
        setSelectedDocter(null);
        setSelectDocterIsChecked(false);
        setSearchQuery("");
        setCurrentPage(1);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const handleSelectDocterIsCheckedChange = (event) => {
        setSelectDocterIsChecked(event.target.checked);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (listDokter && searchQuery) {
            setFilteredDoctors(
                listDokter.filter(
                    (dokter) =>
                        dokter.firstName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        dokter.lastName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                )
            );
        } else {
            // Jika salah satu dari listDokter atau searchQuery kosong, tidak perlu filter
            setFilteredDoctors(listDokter);
        }
    }, [listDokter, searchQuery]);

    const [currentItems, setCurrentItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (selectDocterIsChecked && filteredDoctors) {
            const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
            const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
            const slicedItems = filteredDoctors.slice(
                indexOfFirstItem,
                indexOfLastItem
            );
            setCurrentItems(slicedItems);
            setTotalPages(Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE));
        }
    }, [filteredDoctors, currentPage, selectDocterIsChecked]);

    const submitVerification = async () => {
        const message =
            selectDocterIsChecked && selectedDocter
                ? `Hasil scan akan diajukan ke Dokter ${selectedDocter.nama} untuk di verifikasi`
                : "Hasil scan akan diajukan ke Dokter untuk di verifikasi";

        confirmAlert({
            title: "Ajukan Verifikasi",
            message: message,
            buttons: [
                {
                    label: "Batalkan",
                    onClick: () => {
                        console.log("Batalkan clicked");
                    },
                },
                {
                    label: "Ajukan Verifikasi",
                    onClick: async () => {
                        console.log("Ajukan Verifikasi clicked");
                        setLoading(true);
                        var response = await axiosClient.post(
                            `mengajukanVerifikasi/${skinAnalysisId}`,
                            {
                                keluhan: keluhan,
                                doctorId: selectedDocter
                                    ? selectedDocter.id
                                    : null,
                                userId: user.id,
                                skinAnalysisId: skinAnalysisId,
                            }
                        );

                        setLoading(false);
                        toast.success("Berhasil mengajukan verifikasi");
                        fetchData();
                    },
                },
            ],
            closeOnClickOutside: true,
            closeOnEscape: true,
        });
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
            {!loading && (
                <div className="">
                    <div className="text-center flex flex-col items-center w-screen">
                        <h1 className="poppin-font fw-bolder mt-4 mb-4">
                            Detail Hasil Deteksi
                        </h1>
                        <div className="poppin-font container-sm mb-4">
                            <h5 className="text-muted">
                                {data.is_sudah_diajukan
                                    ? data.skin_analysis.verified == 0
                                        ? "Hasil deteksi sudah diverifikasi dokter"
                                        : "Pengajuan verifikasi belum diverifikasi dokter"
                                    : "Klik tombol analisa untuk mendeteksi ulang kanker pada gambar"}
                            </h5>
                        </div>

                        <div className="flex flex-col md:flex-row container bg-white p-8">
                            <div
                                className={`mb-4 poppin-font text-white bg-white flex px-8 flex-col basis-1/2`}
                            >
                                <div className="mb-4 text-black font-semibold flex justify-start">
                                    <div className="xl:px-7">
                                        ID Deteksi : {data.skin_analysis.id}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center h-80 relative -z-0">
                                    <img
                                        className="object-cover w-80 h-80"
                                        src={getImageUrl(
                                            data.skin_analysis.image_path
                                        )}
                                        alt=""
                                    />
                                </div>
                                <div className="pt-4">
                                    <h5 className="font-light text-black text-xs">
                                        {imageName}
                                    </h5>
                                </div>
                                <div className="pt-2 flex gap-4 self-center">
                                    <div className=" bg-primaryTW  rounded-md px-12 py-2 ">
                                        <button
                                            onClick={() => {
                                                if (!isDownloading) {
                                                    downloadImage(
                                                        data.skin_analysis
                                                            .image_path,
                                                        setIsDownloading
                                                    );
                                                }
                                            }}
                                            type="button"
                                        >
                                            {isDownloading
                                                ? "Downloading..."
                                                : "Unduh Gambar"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white flex flex-col text-start w-full pr-8">
                                <div>
                                    <h1 className="text-lg">
                                        Hasil Deteksi AI
                                    </h1>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <div className="flex gap-3 ">
                                            <div className="w-36">Melanoma</div>
                                            <div>
                                                :{" "}
                                                {data.skin_analysis
                                                    .analysis_percentage > 60
                                                    ? "Iya"
                                                    : "Tidak"}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-30">
                                            <div className="w-36">
                                                Keakuratan
                                            </div>
                                            <div>
                                                <div
                                                    className={`text-start ${
                                                        keakuratan > 60
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
                                            <div className="w-36">Status</div>
                                            <div>
                                                :{" "}
                                                <span
                                                    className={`${
                                                        data.skin_analysis
                                                            .verified
                                                            ? " text-green-500"
                                                            : " text-red-500"
                                                    }`}
                                                >
                                                    {data.skin_analysis.verified
                                                        ? "verified"
                                                        : "unverified"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="">
                                        {role && (
                                            <div className="poppin-font  bg-white ">
                                                <div className="text-black">
                                                    <div className="bg-white text-start flex flex-col">
                                                        <div className="flex gap-3">
                                                            <h1 className="text-lg my-auto">
                                                                Pengajuan
                                                                Verifikasi
                                                            </h1>
                                                            <div
                                                                className={`px-2 py-1 border-2 rounded-full ${
                                                                    data.is_sudah_diajukan
                                                                        ? data
                                                                              .skin_analysis
                                                                              .verified ==
                                                                          0
                                                                            ? "bg-yellow-50  border-yellow-400"
                                                                            : "bg-green-50  border-green-400"
                                                                        : "bg-red-50  border-red-400"
                                                                } `}
                                                            >
                                                                <button className="">
                                                                    {data.is_sudah_diajukan
                                                                        ? data
                                                                              .skin_analysis
                                                                              .verified ==
                                                                          0
                                                                            ? "Pending"
                                                                            : "Sudah diverifikasi"
                                                                        : "Belum"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {data.is_sudah_diajukan ? (
                                                            data.skin_analysis
                                                                .verified ==
                                                            0 ? (
                                                                ""
                                                            ) : (
                                                                <div className="flex flex-col gap-2 pt-2">
                                                                    <div>
                                                                        <div className="flex gap-3 w-30">
                                                                            <div className="w-36">
                                                                                Nama
                                                                                Dokter
                                                                            </div>
                                                                            <div>
                                                                                <div>
                                                                                    :{" "}
                                                                                    {data
                                                                                        .doctor
                                                                                        .firstName +
                                                                                        " " +
                                                                                        data
                                                                                            .doctor
                                                                                            .lastName}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-3 ">
                                                                            <div className="w-36">
                                                                                {
                                                                                    "Catatan Dokter"
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                :{" "}
                                                                                {data
                                                                                    .skin_analysis
                                                                                    .catatanDokter
                                                                                    ? data
                                                                                          .skin_analysis
                                                                                          .catatanDokter
                                                                                    : "Tidak ada"}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-3 ">
                                                                            <div className="w-36">
                                                                                Melanoma
                                                                            </div>
                                                                            <div>
                                                                                :{" "}
                                                                                <span
                                                                                    className={`${
                                                                                        data
                                                                                            .skin_analysis
                                                                                            .melanoma_detected
                                                                                            ? " text-red-500"
                                                                                            : " text-green-500"
                                                                                    }`}
                                                                                >
                                                                                    {data
                                                                                        .skin_analysis
                                                                                        .melanoma_detected
                                                                                        ? "Melanoma"
                                                                                        : "Bukan Melanoma"}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div>
                                                                <div className="flex flex-col mt-2 mb-2">
                                                                    <div className="m-0 pb-2">
                                                                        Keluhan
                                                                        :
                                                                    </div>
                                                                    <textarea
                                                                        placeholder="Berikan catatan disini"
                                                                        className="p-3 border border-black h-52 w-full overflow-y-auto"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setKeluhan(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="">
                                                                    <div className="">
                                                                        <div className="text-sm text-gray-500">
                                                                            *Checklis
                                                                            ini
                                                                            jika
                                                                            ingin
                                                                            memilih
                                                                            dokter
                                                                            anda
                                                                            sendiri
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 mt-2">
                                                                        <div className="">
                                                                            <input
                                                                                className="w-6 h-6 bg-primaryTW"
                                                                                type="checkbox"
                                                                                name=""
                                                                                id=""
                                                                                checked={
                                                                                    selectDocterIsChecked
                                                                                }
                                                                                onChange={
                                                                                    handleSelectDocterIsCheckedChange
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            Menentukan
                                                                            Dokter
                                                                            Sendiri
                                                                        </div>
                                                                    </div>

                                                                    {selectedDocter &&
                                                                        selectDocterIsChecked && (
                                                                            <div className="bg-primaryTW p-2 rounded-lg mt-4 mb-3">
                                                                                <div className="w-full flex justify-between py-2 px-6 bg-white">
                                                                                    <div className="flex gap-4 items-center">
                                                                                        <div className="rounded-full w-20 h-20 overflow-hidden">
                                                                                            <img
                                                                                                src={`http://localhost:8000/${selectedDocter.profile_picture_path}`}
                                                                                                alt={`Foto Profil ${selectedDocter.firstName} ${selectedDocter.lastName}`}
                                                                                                className="object-cover w-full h-full"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            {selectedDocter[
                                                                                                "firstName"
                                                                                            ] +
                                                                                                " " +
                                                                                                selectedDocter[
                                                                                                    "lastName"
                                                                                                ]}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center">
                                                                                        <div
                                                                                            className={`bg-yellow-400 text-whiteTW rounded-md px-12 py-2 flex-none h-10`}
                                                                                        >
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    setSelectedDocter(
                                                                                                        null
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                Ganti
                                                                                                Dokter
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    {selectDocterIsChecked &&
                                                                        selectedDocter ==
                                                                            null && (
                                                                            <div
                                                                                className={
                                                                                    "w-full flex flex-col bg-primaryAlternativeTW mt-4 mb-3"
                                                                                }
                                                                            >
                                                                                <div className="bg-primaryTW p-2 rounded-lg">
                                                                                    <input
                                                                                        className="input-group placeholder:text-lg placeholder:text-black p-2 rounded-lg"
                                                                                        type="text"
                                                                                        placeholder="Search"
                                                                                        value={
                                                                                            searchQuery
                                                                                        }
                                                                                        onChange={
                                                                                            handleSearchChange
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <div className="p-12 grid grid-cols-4 gap-2 min-h-[500px]">
                                                                                    {currentItems.map(
                                                                                        (
                                                                                            dokter
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    dokter.id
                                                                                                }
                                                                                                className="p-4 flex flex-col gap-2 items-center justify-center shadow-md rounded-md bg-white"
                                                                                            >
                                                                                                <div className="rounded-full w-20 h-20 overflow-hidden">
                                                                                                    <img
                                                                                                        src={`http://localhost:8000/${dokter.profile_picture_path}`}
                                                                                                        alt={`Foto Profil ${dokter.firstName} ${dokter.lastName}`}
                                                                                                        className="object-cover w-full h-full"
                                                                                                    />
                                                                                                </div>

                                                                                                <div className="text-center">
                                                                                                    {dokter[
                                                                                                        "firstName"
                                                                                                    ] +
                                                                                                        " " +
                                                                                                        dokter[
                                                                                                            "lastName"
                                                                                                        ]}
                                                                                                </div>
                                                                                                <div
                                                                                                    className={` ${"bg-primaryTW"}  text-whiteTW rounded-md px-6 py-1`}
                                                                                                >
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() => {
                                                                                                            setSelectedDocter(
                                                                                                                dokter
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        Pilih
                                                                                                        Dokter
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex justify-center mb-4">
                                                                                    {Array.from(
                                                                                        {
                                                                                            length: totalPages,
                                                                                        },
                                                                                        (
                                                                                            _,
                                                                                            index
                                                                                        ) => (
                                                                                            <button
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    handlePageChange(
                                                                                                        index +
                                                                                                            1
                                                                                                    )
                                                                                                }
                                                                                                className={`px-4 py-2 mx-1 ${
                                                                                                    currentPage ===
                                                                                                    index +
                                                                                                        1
                                                                                                        ? "bg-primaryTW text-white"
                                                                                                        : "bg-white text-black"
                                                                                                }`}
                                                                                            >
                                                                                                {index +
                                                                                                    1}
                                                                                            </button>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                                <div
                                                                    className="w-full flex items-center justify-center flex-col gap-2 pt-3
                                    "
                                                                >
                                                                    <div
                                                                        className={` ${
                                                                            selectDocterIsChecked &&
                                                                            !selectedDocter
                                                                                ? "bg-gray-500 "
                                                                                : "bg-primaryTW"
                                                                        }  text-whiteTW rounded-md px-12 py-2`}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                selectDocterIsChecked &&
                                                                                !selectedDocter
                                                                            }
                                                                            className={`${
                                                                                selectDocterIsChecked &&
                                                                                !selectedDocter
                                                                                    ? "cursor-not-allowed"
                                                                                    : "cursor-pointer"
                                                                            }`}
                                                                            onClick={() => {
                                                                                if (
                                                                                    selectDocterIsChecked &&
                                                                                    !selectedDocter
                                                                                ) {
                                                                                    return;
                                                                                } else {
                                                                                    submitVerification();
                                                                                }
                                                                            }}
                                                                        >
                                                                            Ajukan
                                                                            Verifikasi
                                                                        </button>
                                                                    </div>
                                                                    {!selectedDocter &&
                                                                    selectDocterIsChecked ? (
                                                                        <div className="text-sm text-gray-500">
                                                                            *Pilih
                                                                            Dokter
                                                                            atau
                                                                            matikan
                                                                            ceklis
                                                                            Menentukan
                                                                            Dokter
                                                                            Sendiri
                                                                        </div>
                                                                    ) : selectedDocter &&
                                                                      selectDocterIsChecked ? (
                                                                        <div className="text-sm text-gray-500">
                                                                            *
                                                                            {
                                                                                selectedDocter[
                                                                                    "nama"
                                                                                ]
                                                                            }{" "}
                                                                            akan
                                                                            dipilih
                                                                            sebagai
                                                                            dokter
                                                                            anda
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-sm text-gray-500">
                                                                            *Dokter
                                                                            akan
                                                                            ditentukan
                                                                            secara
                                                                            otomatis
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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

export default DetailDeteksi;
