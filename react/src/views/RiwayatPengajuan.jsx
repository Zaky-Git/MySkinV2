import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import getImageUrl from "../functions/getImage";
import { ClipLoader } from "react-spinners";
import { confirmAlert } from "react-confirm-alert";
import { FaTrashAlt, FaEdit, FaInfoCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";

const RiwayatPengajuan = () => {
    const { user } = useStateContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get(
                    "/pasienVerificationList/" + user.id
                );
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching the data", error);
            }
        };

        fetchData();
    }, [user.id]);

    const handleDetailClick = (id) => {
        navigate(`/pasien/detailPengajuan/${id}`);
    };

    const deleteVerification = async (id) => {
        try {
            confirmAlert({
                title: "Batalkan Pengajuan Verifikasi",
                message: "Yakin ingin membatalkan pengajuan?",
                buttons: [
                    {
                        label: "Cancel",
                        onClick: () => console.log("Cancel clicked"),
                    },
                    {
                        label: "Delete",
                        onClick: async () => {
                            const toastId = toast.loading(
                                "Membatalkan pengajuan verifikasi..."
                            );
                            setLoading(true);
                            await axiosClient.delete(`/verification/${id}`);
                            setData(
                                data.filter(
                                    (item) => item.skin_analysis.id !== id
                                )
                            );
                            setLoading(false);
                            toast.update(toastId, {
                                render: "Pengajuan verifikasi berhasil dibatalkan!",
                                type: "success",
                                isLoading: false,
                                autoClose: 5000,
                            });
                        },
                    },
                ],
                closeOnClickOutside: true,
                closeOnEscape: true,
            });
        } catch (error) {
            toast.error("Error deleting verification");
            console.error("Error deleting the verification", error);
        }
    };

    return (
        <div className="dashboard-content container">
            <ToastContainer />
            <div className="card-custom shadow-xl p-3 mt-4">
                <h3 className="font-bold">
                    Riwayat Pengajuan
                    <hr />
                </h3>
                {loading ? (
                    <div className="flex items-center justify-center h-[50vh]">
                        <ClipLoader
                            color="#4A90E2"
                            loading={loading}
                            size={35}
                        />
                        <span className="ml-2">Memuat data...</span>
                    </div>
                ) : data.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="col-1">Tanggal Pengajuan</th>
                                <th className="col-1">Persentase</th>
                                <th className="col-2">Gambar</th>
                                <th className="col-1">Keluhan</th>
                                <th className="col-1">Status</th>
                                <th className="col-1">Tanggal Diverifikasi</th>
                                <th className="col-1">Verified By</th>
                                <th className="col-1">Melanoma</th>
                                <th className="col-1">Catatan Dokter</th>
                                <th className="col-1"></th>
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
                                        <span
                                            className={`${
                                                item.skin_analysis
                                                    .analysis_percentage < 60
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {
                                                item.skin_analysis
                                                    .analysis_percentage
                                            }
                                            %{" Melanoma"}
                                        </span>
                                    </td>
                                    <td>
                                        <img
                                            height={200}
                                            width={200}
                                            src={getImageUrl(
                                                item.skin_analysis.image_path
                                            )}
                                            alt="Gambar"
                                            className="img-thumbnail"
                                        />
                                    </td>
                                    <td>
                                        {item.skin_analysis.keluhan == "" ||
                                        item.skin_analysis.keluhan == null
                                            ? "Tidak ada"
                                            : item.skin_analysis.keluhan}
                                    </td>
                                    <td>
                                        <span
                                            className={`${
                                                !item.verified
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {item.verified
                                                ? "Verified"
                                                : "Unverified"}
                                        </span>
                                    </td>
                                    <td>
                                        {item.skin_analysis.verification_date ==
                                        null
                                            ? "Unverified"
                                            : new Date(
                                                  item.skin_analysis.verification_date
                                              ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {item.doctor
                                            ? item.doctor.firstName +
                                              " " +
                                              item.doctor.lastName
                                            : "Belum ditentukan"}
                                    </td>
                                    <td>
                                        {item.verified
                                            ? item.verified_melanoma == "0"
                                                ? "Bukan Melanoma"
                                                : "Melanoma"
                                            : "Unverified"}
                                    </td>
                                    <td>
                                        {item.skin_analysis.catatanDokter ==
                                            null ||
                                        item.skin_analysis.catatanDokter == ""
                                            ? "Tidak ada"
                                            : item.skin_analysis.catatanDokter}
                                    </td>
                                    <td>
                                        <div className="flex flex-row gap-2 justify-items-center items-center">
                                            <button
                                                data-tooltip-id="detail-tooltip"
                                                data-tooltip-content="Detail Pengajuan"
                                                data-tooltip-place="top"
                                                className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full"
                                                onClick={() =>
                                                    handleDetailClick(
                                                        item.skin_analysis.id
                                                    )
                                                }
                                            >
                                                <FaInfoCircle />
                                            </button>
                                            <Tooltip id="detail-tooltip" />
                                            <button
                                                data-tooltip-id="delete-tooltip"
                                                data-tooltip-content="Batalkan pengajuan"
                                                data-tooltip-place="top"
                                                className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-full"
                                                onClick={() =>
                                                    deleteVerification(
                                                        item.skin_analysis.id
                                                    )
                                                }
                                            >
                                                <FaTrashAlt />
                                            </button>
                                            <Tooltip id="delete-tooltip" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div></div>
                )}

                {data.length == 0 && !loading && (
                    <div className="flex items-center justify-center h-[50vh]">
                        <span className="ml-2">
                            Tidak ada riwayat pengajuan.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiwayatPengajuan;
