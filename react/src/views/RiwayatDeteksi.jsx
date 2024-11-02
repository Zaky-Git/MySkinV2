import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import getImageUrl from "../functions/getImage";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaInfoCircle } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Tooltip } from "react-tooltip";

const RiwayatDeteksi = () => {
    const { user, logoutUser, role } = useStateContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keluhan, setKeluhan] = useState("");
    const [currentId, setCurrentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get(
                    "/mySkinAnalysis/" + user.id
                );
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching the data", error);
            }
        };

        fetchData();
    }, []);

    const deleteAnalysis = async (id) => {
        try {
            confirmAlert({
                title: "Delete Hasil Deteksi",
                message: "Yakin ingin menghapus?",
                buttons: [
                    {
                        label: "Batalkan",
                        onClick: () => console.log("Batalkan clicked"),
                    },
                    {
                        label: "Hapus",
                        onClick: async () => {
                            setLoading(true);
                            await axiosClient.delete(`/skinAnalysis/${id}`);
                            setData(data.filter((item) => item.id !== id));
                            setLoading(false);
                            toast.success("Hasil deteksi berhasil dihapus");
                        },
                    },
                ],
                closeOnClickOutside: true,
                closeOnEscape: true,
            });
        } catch (error) {
            console.error("Error deleting the data", error);
        }
    };

    const updateKeluhan = async (id) => {
        const toastId = toast.loading("Memperbarui keluhan...");
        try {
            await axiosClient.put(`/updateKeluhanSkinAnalysis/${id}`, {
                keluhan,
            });
            setData(
                data.map((item) =>
                    item.id === id ? { ...item, keluhan } : item
                )
            );
            setKeluhan("");
            setCurrentId(null);
            setIsModalOpen(false);
            toast.update(toastId, {
                render: "Keluhan berhasil diperbarui",
                type: "success",
                isLoading: false,
                autoClose: 5000,
            });
        } catch (error) {
            toast.update(toastId, {
                render: "Error updating keluhan",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
            console.error("Error updating the keluhan", error);
        }
    };

    return (
        <div className="dashboard-content container">
            <ToastContainer />
            <div className="card-custom shadow-xl p-3 mt-4">
                <h3 className="font-bold">
                    Riwayat Deteksi
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
                                <th className="col-2">Tanggal Deteksi</th>
                                <th className="col-2">Persentase</th>
                                <th className="col-2">Gambar</th>
                                <th className="col-2">Keluhan</th>
                                <th className="col-2">Pengajuan</th>
                                <th className="col-2">Status</th>
                                <th className="col-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {new Date(
                                            item.updated_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span
                                            className={`${
                                                item.analysis_percentage > 60
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {item.analysis_percentage}%{" "}
                                            {" Melanoma"}
                                        </span>
                                    </td>
                                    <td>
                                        <img
                                            height={200}
                                            width={200}
                                            src={getImageUrl(item.image_path)}
                                            alt="Gambar"
                                            className="img-thumbnail"
                                        />
                                    </td>
                                    <td>
                                        {item.keluhan == null ||
                                        item.keluhan == ""
                                            ? "Tidak ada"
                                            : item.keluhan}
                                    </td>
                                    <td>
                                        <span
                                            className={`${
                                                !item.is_sudah_pengajuan
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {item.is_sudah_pengajuan
                                                ? "Sudah"
                                                : "belum"}
                                        </span>
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
                                    <td className="">
                                        <div className="flex flex-row gap-2 justify-items-center items-center">
                                            <Link
                                                to={`/pasien/detailDeteksi/${item.id}`}
                                            >
                                                <button
                                                    data-tooltip-id="detail-tooltip"
                                                    data-tooltip-content="Detail Deteksi"
                                                    data-tooltip-place="top"
                                                    className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full"
                                                    title="Detail"
                                                >
                                                    <FaInfoCircle />
                                                </button>
                                                <Tooltip id="detail-tooltip" />
                                            </Link>
                                            <button
                                                data-tooltip-id="delete-tooltip"
                                                data-tooltip-content="Hapus Hasil Deteksi"
                                                data-tooltip-place="top"
                                                onClick={() =>
                                                    deleteAnalysis(item.id)
                                                }
                                                className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-full"
                                                title="Delete"
                                            >
                                                <FaTrashAlt />
                                                <Tooltip id="delete-tooltip" />
                                            </button>
                                            <button
                                                data-tooltip-id="update-tooltip"
                                                data-tooltip-content="Perbarui Keluhan"
                                                data-tooltip-place="top"
                                                onClick={() => {
                                                    setCurrentId(item.id);
                                                    setKeluhan(item.keluhan);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded-full"
                                                title="Update Keluhan"
                                            >
                                                <FaEdit />
                                                <Tooltip id="update-tooltip" />
                                            </button>
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

                <Transition appear show={isModalOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-10"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Perbarui Keluhan
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={keluhan}
                                                onChange={(e) =>
                                                    setKeluhan(e.target.value)
                                                }
                                                className="form-control w-full"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-700"
                                                onClick={() =>
                                                    updateKeluhan(currentId)
                                                }
                                            >
                                                Perbarui
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-white bg-gray-500 border border-transparent rounded-md hover:bg-gray-700"
                                                onClick={() =>
                                                    setIsModalOpen(false)
                                                }
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default RiwayatDeteksi;
