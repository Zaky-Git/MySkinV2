import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import getImageUrl from "../functions/getImage";
import { ClipLoader } from "react-spinners";

const DaftarPengajuanUmum = () => {
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get("pengajuanUmum");
                setVerificationRequests(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = verificationRequests.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatIndonesianMonth = (date) => {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return `${day} ${months[monthIndex]} ${year}`;
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-4">
                Daftar Pengajuan Umum
            </h1>
            {loading ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <ClipLoader color="#4A90E2" loading={loading} size={35} />
                    <span className="ml-2">Memuat data...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white shadow-md rounded-lg p-6"
                        >
                            <h2 className="text-lg font-semibold mb-2">
                                {request.user.firstName} {request.user.lastName}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Diagnosis Melanoma [AI]:{" "}
                                <span
                                    className={`font-bold ${
                                        request.skin_analysis
                                            .analysis_percentage < 50
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {request.skin_analysis.analysis_percentage}%
                                </span>
                            </p>
                            <p className="text-gray-600 mb-2">
                                Keluhan:{" "}
                                {request.skin_analysis.keluhan == "" ||
                                request.skin_analysis.keluhan == null
                                    ? "Tidak ada"
                                    : request.skin_analysis.keluhan}
                            </p>
                            <p className="text-gray-600 mb-2">
                                Diajukan pada:{" "}
                                {formatIndonesianMonth(
                                    new Date(request.created_at)
                                )}
                            </p>
                            <img
                                src={getImageUrl(
                                    request.skin_analysis.image_path
                                )}
                                alt="Gambar"
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <div className="flex justify-end">
                                <Link
                                    to={`/dokter/verifikasi/${request.skin_analysis.id}`}
                                >
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
                                        Detail Pengajuan
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && (
                <div className="flex justify-center mt-8">
                    {Array.from(
                        {
                            length: Math.ceil(
                                verificationRequests.length / itemsPerPage
                            ),
                        },
                        (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`mx-1 px-3 py-1 rounded-md ${
                                    currentPage === i + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                } focus:outline-none`}
                            >
                                {i + 1}
                            </button>
                        )
                    )}
                </div>
            )}
            {verificationRequests.length == 0 && !loading && (
                <div className="flex items-center justify-center h-[50vh]">
                    <span className="ml-2">
                        Tidak ada pengajuan umum yang tersedia.
                    </span>
                </div>
            )}
        </div>
    );
};

export default DaftarPengajuanUmum;
