import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { ClipLoader } from "react-spinners";

const DetailDokter = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState({});
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        number: "",
        email: "",
    });
    const [loadingDoctor, setLoadingDoctor] = useState(true);
    const [loadingPatients, setLoadingPatients] = useState(true);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await axiosClient.get(`/doctor/${id}`);
                setDoctor(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    number: response.data.number,
                    email: response.data.email,
                });
                setLoadingDoctor(false);
            } catch (error) {
                console.error(
                    "There was an error fetching the doctor details!",
                    error
                );
                setLoadingDoctor(false);
            }
        };

        const fetchPatients = async () => {
            try {
                const patientsResponse = await axiosClient.get(
                    `/allUserByDoctor/${id}`
                );
                setPatients(patientsResponse.data);
                setLoadingPatients(false);
            } catch (error) {
                console.error(
                    "There was an error fetching the patients data!",
                    error
                );
                setLoadingPatients(false);
            }
        };

        fetchDoctorDetails();
        fetchPatients();
    }, [id]);

    const handlePerbaharuiClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.put(`/doctor/${id}`, formData);
            setDoctor(response.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error(
                "There was an error updating the doctor details!",
                error
            );
        }
    };

    return (
        <div className="dashboard-content">
            <div className="detail-dokter">
                <div className="card-custom px-5 mt-4">
                    <h2 className="font-bold">
                        Detail Dokter
                        <hr />
                    </h2>
                    {loadingDoctor ? (
                        <div className="flex items-center justify-center">
                            <ClipLoader
                                color="#4A90E2"
                                loading={loadingDoctor}
                                size={35}
                            />
                            <span className="ml-2">Memuat data...</span>
                        </div>
                    ) : (
                        <>
                            <div className="mt-2">
                                <small>Tanggal Daftar</small>
                                <h4 className="font-bold">
                                    {new Date(
                                        doctor.created_at
                                    ).toLocaleString()}
                                </h4>
                            </div>
                            <div className="mt-2">
                                <small>Nama</small>
                                <h4 className="font-bold">
                                    {doctor.firstName} {doctor.lastName}
                                </h4>
                            </div>
                            <div className="mt-2">
                                <small>Nomor Telepon</small>
                                <h4 className="font-bold">{doctor.number}</h4>
                            </div>
                            <div className="mt-2">
                                <small>Email</small>
                                <h4 className="font-bold">{doctor.email}</h4>
                            </div>
                            <div className="mt-20">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handlePerbaharuiClick}
                                >
                                    Perbaharui
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="card-custom shadow-xl p-3 mt-4">
                <h2 className="font-bold">
                    Ajuan Verifikasi
                    <hr />
                </h2>
                {loadingPatients ? (
                    <div className="flex items-center justify-center">
                        <ClipLoader
                            color="#4A90E2"
                            loading={loadingPatients}
                            size={35}
                        />
                        <span className="ml-2">Memuat data...</span>
                    </div>
                ) : (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="col-4">Tanggal</th>
                                <th className="col-4">Pasien</th>
                                <th className="col-4">Diagnosis AI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {item.firstName + " " + item.lastName}
                                    </td>
                                    <td>
                                        <span
                                            className={`${
                                                item.analysis_percentage < 50
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {item.analysis_percentage}%
                                            {" Melanoma"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {patients.length === 0 && !loadingPatients && (
                    <div className="flex items-center justify-center h-[50vh]">
                        <span className="ml-2">Tidak ada pasien.</span>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                Perbaharui Detail
                            </h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleCloseModal}
                            >
                                X
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nama Depan</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Nama Belakang
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mt-10">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailDokter;
