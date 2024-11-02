import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { ClipLoader } from "react-spinners";

const DaftarPasien = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient
            .get("/users")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the patients data!",
                    error
                );
                setLoading(false);
            });
    }, []);

    return (
        <div className="dashboard-content container">
            <div className="card-custom shadow-xl p-3 mt-4">
                <h3 className="font-bold">
                    Pasien
                    <hr />
                </h3>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <ClipLoader color="#4A90E2" loading={loading} size={35} />
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
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    {item.firstName} {item.lastName}
                                </td>
                                <td>{item.email}</td>
                                <td>{item.number}</td>
                                <td>
                                    {new Date().getFullYear() - new Date(item.birthdate).getFullYear()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {data.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-[50vh]">
                                    <span className="ml-2">
                                        Tidak ada pasien.
                                    </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DaftarPasien;
