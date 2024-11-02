import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { ClipLoader } from "react-spinners";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifikasiPengguna = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchUnverifiedUsers = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get("/penggunaUnver", {
                    params: { role: filter === "all" ? undefined : filter },
                });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(
                    "There was an error fetching the unverified users!",
                    error
                );
                setLoading(false);
            }
        };

        fetchUnverifiedUsers();
    }, [filter]);

    const handleFilterChange = (role) => {
        setFilter(role);
    };

    const handleVerifyUser = (userId) => {
        confirmAlert({
            title: "Konfirmasi Verifikasi",
            message: "Apakah Anda yakin ingin memverifikasi pengguna ini?",
            buttons: [
                {
                    label: "Tidak",
                },
                {
                    label: "Ya",
                    onClick: async () => {
                        try {
                            const response = await axiosClient.put(
                                `/verifikasi-pengguna/${userId}`
                            );
                            if (response.status === 200) {
                                toast.success("Pengguna berhasil diverifikasi");
                                setData((prevData) =>
                                    prevData.filter(
                                        (user) => user.id !== userId
                                    )
                                );
                            }
                        } catch (error) {
                            toast.error(
                                "Terjadi kesalahan saat memverifikasi pengguna"
                            );
                            console.error(
                                "There was an error verifying the user!",
                                error
                            );
                        }
                    },
                },
            ],
        });
    };

    return (
        <div className="dashboard-content container-fluid">
            <ToastContainer />
            <div className="card-custom shadow-xl p-3 mt-4">
                <h3 className="font-bold">
                    Verifikasi Pengguna
                    <hr />
                </h3>
                <div className="mb-4">
                    <button
                        className={`btn ${
                            filter === "all" ? "btn-primary" : "btn-secondary"
                        }`}
                        onClick={() => handleFilterChange("all")}
                    >
                        Semua
                    </button>
                    <button
                        className={`btn ml-2 ${
                            filter === "pasien"
                                ? "btn-primary"
                                : "btn-secondary"
                        }`}
                        onClick={() => handleFilterChange("pasien")}
                    >
                        Pasien
                    </button>
                    <button
                        className={`btn ml-2 ${
                            filter === "dokter"
                                ? "btn-primary"
                                : "btn-secondary"
                        }`}
                        onClick={() => handleFilterChange("dokter")}
                    >
                        Dokter
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
                                <th className="col-2">Umur</th>
                                <th></th>
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
                                    <td>
                                        {new Date().getFullYear() -
                                            new Date(
                                                item.birthdate
                                            ).getFullYear()}
                                    </td>
                                    <td>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() =>
                                                handleVerifyUser(item.id)
                                            }
                                        >
                                            Verifikasi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {data.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-[50vh]">
                        <span className="ml-2">
                            Tidak ada pengguna yang tidak diverifikasi.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifikasiPengguna;
