import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { ClipLoader } from "react-spinners";

const DaftarDokter = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorsAndPatients();
    }, [search, sortBy, sortOrder, perPage, currentPage]);

    const fetchDoctorsAndPatients = async () => {
        setLoading(true);
        try {
            const params = {
                perPage,
                page: currentPage,
            };

            if (search) params.search = search;
            if (sortBy) params.sortBy = sortBy;
            if (sortOrder) params.sortOrder = sortOrder;

            const response = await axiosClient.get("/doctors/paginate", {
                params,
            });
            const { data: doctors, meta } = response.data;
            setData(doctors);
            setTotalPages(meta && meta.last_page ? meta.last_page : 1);
            setLoading(false);
        } catch (error) {
            console.error(
                "There was an error fetching the doctors data!",
                error
            );
            setLoading(false);
        }
    };

    const handleDetailClick = (doctorId) => {
        navigate(`/admin/detailDokter/${doctorId}`);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value || "");
    };

    const handleOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="dashboard-content">
            <div className="card-custom shadow-xl p-3 mt-4">
                <h3 className="font-bold">
                    Dokter
                    <hr />
                </h3>

                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Cari dokter..."
                        value={search}
                        onChange={handleSearchChange}
                        className="p-2 border rounded w-1/2"
                    />
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="p-2 border rounded"
                    >
                        <option value="">Urut Berdasar</option>
                        <option value="created">Tanggal Daftar</option>
                        <option value="firstName">Nama Depan</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={handleOrderChange}
                        className="p-2 border rounded"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="p-2 border rounded"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center">
                        <ClipLoader
                            color="#4A90E2"
                            loading={loading}
                            size={35}
                        />
                        <span className="ml-2">Memuat data...</span>
                    </div>
                ) : (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="col-2">Tanggal Daftar</th>
                                <th className="col-2">Nama Lengkap</th>
                                <th className="col-2">Email</th>
                                <th className="col-2">Nomor Telepon</th>
                                <th className="col-2">Jumlah Pasien</th>
                                <th className="col-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {item.firstName} {item.lastName}
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.number}</td>
                                    <td>{item.patient_count}</td>
                                    <td>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() =>
                                                handleDetailClick(item.id)
                                            }
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${
                                currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {data.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-[50vh]">
                        <span className="ml-2">Tidak ada dokter.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DaftarDokter;
