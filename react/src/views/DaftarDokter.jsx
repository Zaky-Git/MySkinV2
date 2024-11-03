import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { ClipLoader } from "react-spinners";

const DaftarDokter = () => {
    const [data, setData] = useState([]); // Current displayed data
    const [initialData, setInitialData] = useState([]); // Store initial data
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorsAndPatients();
    }, []);

    // Fetch all doctors initially
    const fetchDoctorsAndPatients = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/doctors");
            const doctors = response.data;

            const updatedDoctors = await Promise.all(
                doctors.map(async (doctor) => {
                    const patientCountResponse = await axiosClient.get(
                        `/doctor/${doctor.id}/patients-count`
                    );
                    doctor.patient_count =
                        patientCountResponse.data.patient_count;
                    return doctor;
                })
            );

            setData(updatedDoctors); // Set displayed data
            setInitialData(updatedDoctors); // Store initial data for reset
        } catch (error) {
            console.error("Error fetching doctors data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to search by name
    const searchByName = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(
                `/doctors/search?name=${searchQuery}`
            );
            setData(response.data);
        } catch (error) {
            console.error("Error searching doctors by name:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to reset the search
    const resetSearch = () => {
        setSearchQuery("");
        setData(initialData); // Reset to the initial data
    };

    const handleDetailClick = (doctorId) => {
        navigate(`/admin/detailDokter/${doctorId}`);
    };

    return (
        <div className="dashboard-content container">
            <div className="card-custom shadow-xl p-3 mt-4">
                <h3 className="font-bold">
                    Dokter
                    <hr />
                </h3>

                {/* Search Input with Search and Reset Buttons */}
                <div className="mb-4 flex">
                    <input
                        type="text"
                        placeholder="Cari dokter menggunakan nama, email, nomor telfon"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                    <button
                        onClick={searchByName}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Search
                    </button>
                    <button
                        onClick={resetSearch}
                        className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Reset
                    </button>
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
                            {data.map((item, index) => (
                                <tr key={index}>
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
