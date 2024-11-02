import "bootstrap/dist/css/bootstrap.min.css";
import ".././index.css";
import Card from "../components/Card.jsx";
import {
    faClock,
    faFileCircleCheck,
    faHospitalUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const DokterDashboard = () => {
    const { user } = useStateContext();
    const [ajuan, setAjuan] = useState([]);
    const [pasien, setPasien] = useState([]);
    const [sumPasien, setSumPasien] = useState(0);
    const [sumUnver, setSumUnver] = useState(0);
    const [sumVer, setSumVer] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            const fetchData = async () => {
                try {
                    const userResponse = await axiosClient.get(
                        `/doctor/${user.id}/patients-count`
                    );
                    const unverResponse = await axiosClient.get(
                        `/doctor/${user.id}/countUserUnver`
                    );
                    const verResponse = await axiosClient.get(
                        `/doctor/${user.id}/countUserVer`
                    );
                    const pasienResponse = await axiosClient.get(
                        `/listPasien/${user.id}`
                    );
                    const ajuanResponse = await axiosClient.get(
                        `/ajuanVerifikasi/${user.id}`
                    );

                    setSumPasien(userResponse.data.patient_count);
                    setSumUnver(unverResponse.data);
                    setSumVer(verResponse.data);
                    setPasien(pasienResponse.data);
                    setAjuan(ajuanResponse.data);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [user]);

    const handleVerifikasiClick = (id) => {
        navigate(`/dokter/verifikasi/${id}`);
    };

    return (
        <div className="dashboard poppin-font">
            <div className="dashboard-content container">
                <div className="content">
                    <Card
                        icon1={faHospitalUser}
                        icon2={faClock}
                        icon3={faFileCircleCheck}
                        title1={"Menunggu Verifikasi"}
                        title2={"Terverifikasi"}
                        sum1={sumPasien}
                        sum2={sumUnver}
                        sum3={sumVer}
                    />
                    <div className="unverif-list">
                        <div className="list-header"></div>
                        <div className="card-custom shadow-xl p-3">
                            <h3 className="font-bold">
                                Ajuan Verifikasi
                                <hr />
                            </h3>
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
                                            <th className="col-4">Tanggal</th>
                                            <th className="col-4">Pasien</th>
                                            <th className="col-4">
                                                Diagnosis AI
                                            </th>
                                            <th className="col-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ajuan.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {item.firstName +
                                                        " " +
                                                        item.lastName}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`${
                                                            item.analysis_percentage <
                                                            50
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }`}
                                                    >
                                                        {
                                                            item.analysis_percentage
                                                        }
                                                        %{" Melanoma"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleVerifikasiClick(
                                                                item.id
                                                            )
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Verifikasi
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {ajuan.length === 0 && !loading && (
                                <div className="flex items-center justify-center h-full">
                                    <span className="ml-2">
                                        Tidak ada pengajuan verifikasi.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pasien">
                    <div
                        className="card-custom shadow-xl p-3"
                        style={{ height: "100%" }}
                    >
                        <h3 className="font-bold">
                            Pasien
                            <hr />
                        </h3>
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
                                        <th className="col-4">Nama</th>
                                        <th className="col-4">Nomor Telepon</th>
                                        <th className="col-4">Jumlah Ajuan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pasien.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item.firstName +
                                                    " " +
                                                    item.lastName}
                                            </td>
                                            <td>{item.number}</td>
                                            <td>{item.jumlah_ajuan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {pasien.length === 0 && !loading && (
                            <div className="flex items-center justify-center h-[50vh]">
                                <span className="ml-2">Tidak ada pasien.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DokterDashboard;
