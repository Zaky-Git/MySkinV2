import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import Card from "../components/Card.jsx";
import {
    faUserDoctor,
    faHospitalUser,
    faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../axios-client.js";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const AdminDashboard = ({ openBerhasil }) => {
    const [dataPatient, setDataPatient] = useState([]);
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [namaDepan, setNamaDepan] = useState("");
    const [namaBelakang, setNamaBelakang] = useState("");
    const [password, setPassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [sumUser, setSumUser] = useState(0);
    const [sumDoctor, setSumDoctor] = useState(0);
    const [sumPengajuan, setSumPengajuan] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingPasien, setLoadingPasien] = useState(false);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const userResponse = await axiosClient.get("/countUser");
                const doctorResponse = await axiosClient.get("/countDoctor");
                const pengajuanResponse = await axiosClient.get(
                    "/countPengajuan"
                );

                setSumUser(userResponse.data);
                setSumDoctor(doctorResponse.data);
                setSumPengajuan(pengajuanResponse.data);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        const fetchDataPatient = async () => {
            try {
                const response = await axiosClient.get("/allVerifikasi");
                setDataPatient(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data patient:", error);
                setLoading(false);
            }
        };

        fetchCounts();
        fetchDataPatient();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            email === "" ||
            password === "" ||
            phoneNumber === "" ||
            namaDepan === "" ||
            namaBelakang === "" ||
            birthday === ""
        ) {
            return;
        }

        try {
            setLoadingPasien(true);
            const response = await axiosClient.post("/registerUser", {
                firstName: namaDepan,
                lastName: namaBelakang,
                number: phoneNumber,
                email: email,
                password: password,
                birthdate: birthday,
            });
            console.log(response.data);

            if (response.status === 200) {
                toast.success("Berhasil menambahkan pengguna");
            }

            setLoadingPasien(false);
            openBerhasil();
        } catch (error) {
            setLoadingPasien(false);
            toast.error(error.response.data.message);
            console.error(error.response.data);
        }
    };

    return (
        <div className="dashboard poppin-font">
            <ToastContainer />
            <div className="dashboard-content container">
                <div className="content">
                    <Card
                        icon1={faHospitalUser}
                        icon2={faUserDoctor}
                        icon3={faClipboardList}
                        title1={"Dokter"}
                        title2={"Pengajuan"}
                        sum1={sumUser}
                        sum2={sumDoctor}
                        sum3={sumPengajuan}
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
                                            <th className="col-3">Tanggal</th>
                                            <th className="col-3">Pasien</th>
                                            <th className="col-3">
                                                Diagnosis AI
                                            </th>
                                            <th className="col-3">Dokter</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPatient.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {item.userFirstName +
                                                        " " +
                                                        item.userLastName}
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
                                                    {item.doctorFirstName &&
                                                    item.doctorLastName
                                                        ? item.doctorFirstName +
                                                          " " +
                                                          item.doctorLastName
                                                        : "Tidak Memilih Dokter"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pasien">
                    <div
                        className="card-custom shadow-xl p-3"
                        style={{ height: "100%" }}
                    >
                        <h3 className="font-bold text-center">
                            Input Pengguna Baru
                            <hr />
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nama Depan</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={namaDepan}
                                    onChange={(event) => {
                                        setNamaDepan(event.target.value);
                                    }}
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
                                    value={namaBelakang}
                                    onChange={(event) => {
                                        setNamaBelakang(event.target.value);
                                    }}
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
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={phoneNumber}
                                    onChange={(event) => {
                                        setPhoneNumber(event.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Tanggal Lahir
                                </label>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={birthday}
                                    onChange={(event) => {
                                        setBirthday(event.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {loadingPasien ? "loading..." : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
