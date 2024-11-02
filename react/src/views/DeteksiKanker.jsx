import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Cropper from "react-easy-crop";
import "react-image-crop/dist/ReactCrop.css";
import React, { useEffect, useRef, useState } from "react";
import getCroppedImg from "../functions/cropImage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../customStyle/confirm.css";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import RingLoader from "react-spinners/RingLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Carousel } from "react-bootstrap";
import femaleDoctor from "../assets/female-doctor-diagnosing-melanoma-body-female-patient.jpg";
import doctorGloves from "../assets/doctor-getting-hand-gloves.jpg";
import biorobots from "../assets/3d-rendering-biorobots-concept.jpg";
const ITEMS_PER_PAGE = 8;

const DeteksiKanker = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [state, setState] = useState("upload");
    const [loading, setLoading] = useState(false);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [selectDocterIsChecked, setSelectDocterIsChecked] = useState(false);
    const [selectedDocter, setSelectedDocter] = useState(null);
    const [keakuratan, setKeakuratan] = useState(null);
    const [verified, setVerified] = useState(null);
    const [keluhan, setKeluhan] = useState(null);
    const navigate = useNavigate();
    const [listDokter, setListDokter] = useState(null);

    const [skinAnalysisId, setSkinAnalysisId] = useState(null);
    const targetSectionRef = useRef(null);

    const { user, token, role } = useStateContext();

    const handleAnalysisGambar = async () => {
        setLoading(true);

        try {
            const cropImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );
            console.log("donee", { cropImage });
            setCroppedImage(cropImage);

            const responseBlob = await fetch(cropImage);
            const blob = await responseBlob.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });

            const formData = new FormData();
            formData.append("image", file);
            formData.append("skinAnalysisId", skinAnalysisId);

            if (user) {
                formData.append("userId", user.id);
            }

            const response = await axiosClient.post("skinAnalysis", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.data;
            console.log("Data:", data);

            setSkinAnalysisId(data.data.skinAnalysisId);
            console.log(skinAnalysisId);
            setKeakuratan(data.data.skinAnalysis.analysis_percentage);

            setLoading(false);
            setState("analisa");
        } catch (e) {
            toast.error("Gagal menganalisa gambar");
            setLoading(false);
            console.error(e);
        }
    };

    useEffect(() => {
        console.log("User:", user);
        console.log("Token:", token);

        if (role == "dokter") {
            navigate("/dokter/dashboard");
        } else if (role == "admin") {
            navigate("/admin/dashboard");
        }

        if (user && state == "analisa" && role == "pasien") {
            console.log("analisa ulang");
            handleAnalysisGambar();
        }
    }, [user, token, role, navigate]);

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

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (
            !file.type.includes("image/jpeg") &&
            !file.type.includes("image/png")
        ) {
            alert("Format file harus JPEG atau PNG.");
            return;
        }

        // if (file.size > 5 * 1024 * 1024) {
        //     alert("Ukuran file maksimum adalah 5 MB.");
        //     return;
        // }

        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
            // const width = image.width;
            // const height = image.height;

            // if (width < 800 || height < 600) {
            //     alert("Resolusi gambar minimal harus lebih 800 x 600 piksel.");
            //     return;
            // }
            setImageSrc(image.src);
            setImageName(file.name);
            setState("crop");
            console.log("Nama file:", file.name);
        };
    };

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
                        navigate("/pasien/riwayatPengajuan");
                    },
                },
            ],
            closeOnClickOutside: true,
            closeOnEscape: true,
        });
    };
    let [color, setColor] = useState("#2AA8FF");
    const images = [femaleDoctor, doctorGloves, biorobots];

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };
    const handleScrollToTargetSection = () => {
        targetSectionRef.current.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="flex flex-col justify-between mt-8">
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
            {state == "upload" ? (
                <div className="">
                    <div className="homepage-container m-3">
                        <div className="hero-section relative h-[60vh] rounded-lg bg-cover bg-center flex items-center justify-center overflow-hidden">
                            <div className="overlay absolute inset-0 bg-black opacity-65 rounded-lg"></div>
                            <div className="container relative">
                                <h1 className="text-5xl font-bold text-primaryTW">
                                    MySkin
                                </h1>
                                <p className="text-lg text-white max-w-md">
                                    Deteksi penyakit kulit Melanoma online
                                    dengan teknologi kecerdasan buatan
                                </p>
                                <div className="mb-4 poppin-font text-white">
                                    <button
                                        className="bg-primaryTW w-40 rounded-md px-4 py-2"
                                        onClick={handleScrollToTargetSection}
                                    >
                                        Coba Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="services-section w-full mt-3">
                            <div className="w-full rounded-lg bg-whiteTW p-6">
                                <div className="flex flex-wrap container">
                                    <div className="w-full md:w-1/3 px-4">
                                        <div
                                            className={`service-card text-center p-4 bg-white shadow-md rounded-lg ${
                                                activeIndex === 0
                                                    ? "border-primaryTW border-4"
                                                    : ""
                                            }`}
                                        >
                                            <h3 className="text-xl font-bold mb-2">
                                                Deteksi Awal
                                            </h3>
                                            <p className="text-gray-600">
                                                MySkin membantu mendeteksi
                                                gejala awal melanoma untuk
                                                penanganan yang lebih cepat
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 px-4">
                                        <div
                                            className={`service-card text-center p-4 bg-white shadow-md rounded-lg ${
                                                activeIndex === 1
                                                    ? "border-primaryTW border-4"
                                                    : ""
                                            }`}
                                        >
                                            <h3 className="text-xl font-bold mb-2">
                                                Diagnosis Dokter
                                            </h3>
                                            <p className="text-gray-600">
                                                MySkin menyediakan 10+ dokter
                                                untuk memverifikasi penyakit
                                                Anda
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 px-4">
                                        <div
                                            className={`service-card text-center p-4 bg-white shadow-md rounded-lg ${
                                                activeIndex === 2
                                                    ? "border-primaryTW border-4"
                                                    : ""
                                            }`}
                                        >
                                            <h3 className="text-xl font-bold mb-2">
                                                Diagnosis AI
                                            </h3>
                                            <p className="text-gray-600">
                                                MySkin menggunakan kecerdasan
                                                buatan yang andal untuk
                                                menganalisa kulit Anda
                                            </p>
                                        </div>
                                    </div>
                                    <div className="container carousel-section z-0">
                                        <Carousel
                                            activeIndex={activeIndex}
                                            onSelect={handleSelect}
                                        >
                                            {images.map((image, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        className="d-block px-4 w-100"
                                                        src={image}
                                                        alt={`Slide ${
                                                            index + 1
                                                        }`}
                                                        style={{
                                                            height: "500px",
                                                            width: "500px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-lg bg-whiteTW m-3 pb-2"
                        ref={targetSectionRef}
                    >
                        <div className="text-center flex flex-col items-center">
                            <h1 className="poppin-font fw-bolder mt-4 mb-4">
                                Deteksi Kanker Kulit
                            </h1>
                            <div className="poppin-font container-sm mb-4">
                                <h5 className="text-muted">
                                    Masukkan gambar untuk mendeteksi kanker dari
                                    gambar yang diberikan.
                                </h5>
                            </div>
                            <div className="mb-4 poppin-font text-white ">
                                <div className=" bg-primaryTW w-40 rounded-md px-4 py-2 ">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                        id="upload-image"
                                    />
                                    <label
                                        htmlFor="upload-image"
                                        className="cursor-pointer"
                                    >
                                        <div className="font-bold">
                                            Pilih Gambar
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div
                            className="poppin-font align-items-center text-muted"
                            style={{ width: "500px", margin: "auto" }}
                        >
                            <h3 className="text-center">Aturan Gambar</h3>
                            <div
                                className="container-sm"
                                style={{ width: "400px" }}
                            >
                                <ol type="1">
                                    <li>1. Format: JPEG, PNG.</li>
                                    <li>2. Ukuran: Maksimum 5 MB.</li>
                                    <li>
                                        3. Resolusi: Minimal 800 x 600 piksel.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            ) : state == "crop" ? (
                <div className="">
                    <div className="text-center flex flex-col items-center w-screen">
                        <h1 className="poppin-font fw-bolder mt-4 mb-4">
                            Crop Gambar
                        </h1>
                        <div className="poppin-font container-sm mb-4">
                            <h5 className="text-muted">
                                Sesuaikan gambar dengan area yang ingin
                                diperiksa dan pastikan tanda nya benar-benar
                                terlihat jelas.
                            </h5>
                        </div>
                        <div
                            className={`mb-4 poppin-font text-white bg-white container flex items-center justify-center p-8 flex-col `}
                        >
                            <div className="w-80 h-80 relative">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="pt-4">
                                <h5 className="font-light text-black text-xs">
                                    {imageName}
                                </h5>
                            </div>
                            <div className="pt-2">
                                <div className=" bg-primaryTW  rounded-md px-12 py-2 ">
                                    <button
                                        onClick={handleAnalysisGambar}
                                        type="button"
                                    >
                                        Crop Photo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                state == "analisa" && (
                    <div className="">
                        <div className="text-center flex flex-col items-center w-screen">
                            <h1 className="poppin-font fw-bolder mt-4 mb-4">
                                Analisa Gambar
                            </h1>
                            <div className="poppin-font container-sm mb-4">
                                <h5 className="text-muted">
                                    Klik tombol analisa untuk mendeteksi ulang
                                    kanker pada gambar.
                                </h5>
                            </div>
                            <div
                                className={`mb-4 poppin-font text-white bg-white container flex items-center justify-center p-8 flex-col `}
                            >
                                {skinAnalysisId && (
                                    <div className="mb-4 text-black font-semibold flex justify-start container">
                                        <div className="px-12">
                                            ID Analisa : {skinAnalysisId}
                                        </div>
                                    </div>
                                )}

                                <div className="w-80 flex items-center justify-center h-80 relative -z-0">
                                    <img
                                        className="object-cover w-80 h-80"
                                        src={croppedImage}
                                        alt=""
                                    />
                                </div>
                                <div className="pt-4">
                                    <h5 className="font-light text-black text-xs">
                                        {imageName}
                                    </h5>
                                </div>
                                <div className="pt-2 flex gap-4">
                                    <div className=" bg-primaryTW  rounded-md px-12 py-2 ">
                                        <button
                                            onClick={() => {
                                                setState("upload");
                                                reset();
                                            }}
                                            type="button"
                                        >
                                            Ganti Gambar
                                        </button>
                                    </div>
                                    <div className=" bg-primaryTW  rounded-md px-12 py-2 ">
                                        <button
                                            onClick={handleAnalysisGambar}
                                            type="button"
                                        >
                                            Analisa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 poppin-font  bg-white container">
                            <div className=" text-black ">
                                <div className="bg-white flex flex-col p-12">
                                    <div>
                                        <h1 className="text-lg">
                                            Hasil Deteksi
                                        </h1>
                                    </div>
                                    <div className="">
                                        <div className="flex gap-3 ">
                                            <div className="w-28">Melanoma</div>
                                            <div>
                                                :{" "}
                                                {keakuratan > 60
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
                                                        keakuratan > 60
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    : {keakuratan}% Melanoma (
                                                    {keakuratan > 60
                                                        ? "Berbahaya"
                                                        : "Aman"}
                                                    )
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 ">
                                            <div className="w-28">Status</div>
                                            <div>
                                                :{" "}
                                                <span className="text-red-500">
                                                    Unverified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {role && (
                            <div className="mb-4 poppin-font  bg-white container">
                                <div className="text-black">
                                    <div className="bg-white flex flex-col p-12">
                                        <div>
                                            <h1 className="text-lg">
                                                Pengajuan Verifikasi
                                            </h1>
                                        </div>
                                        <div className="flex flex-col mt-2 mb-2">
                                            <div className="m-0 pb-2">
                                                Keluhan :
                                            </div>
                                            <textarea
                                                placeholder="Berikan catatan disini"
                                                className="p-3 border border-black h-52 w-full overflow-y-auto"
                                                onChange={(e) => {
                                                    setKeluhan(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="">
                                            <div className="">
                                                <div className="text-sm text-gray-500">
                                                    *Checklis ini jika ingin
                                                    memilih dokter anda sendiri
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
                                                    Menentukan Dokter Sendiri
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
                                                selectedDocter == null && (
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
                                                                (dokter) => (
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
                                                                (_, index) => (
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
                                                    Ajukan Verifikasi
                                                </button>
                                            </div>
                                            {!selectedDocter &&
                                            selectDocterIsChecked ? (
                                                <div className="text-sm text-gray-500">
                                                    *Pilih Dokter atau matikan
                                                    ceklis Menentukan Dokter
                                                    Sendiri
                                                </div>
                                            ) : selectedDocter &&
                                              selectDocterIsChecked ? (
                                                <div className="text-sm text-gray-500">
                                                    *{selectedDocter["nama"]}{" "}
                                                    akan dipilih sebagai dokter
                                                    anda
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">
                                                    *Dokter akan ditentukan
                                                    secara otomatis
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default DeteksiKanker;
