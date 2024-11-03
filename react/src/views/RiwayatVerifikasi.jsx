import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    TableSortLabel,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const RiwatVerifikasi = () => {
    const { user } = useStateContext();
    const [riwayatVerifikasi, setRiwayatVerifikasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [melanomaDetected, setMelanomaDetected] = useState("");
    const [verificationDateFrom, setVerificationDateFrom] = useState("");
    const [verificationDateTo, setVerificationDateTo] = useState("");
    const [analysisPercentageMin, setAnalysisPercentageMin] = useState("");
    const [analysisPercentageMax, setAnalysisPercentageMax] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/riwayatVerified/${user.id}`, {
                    params: {
                        search,
                        sort_field: sortField,
                        sort_order: sortOrder,
                        page: page + 1,
                        per_page: rowsPerPage,
                        melanoma_detected: melanomaDetected,
                        verification_date_from: verificationDateFrom,
                        verification_date_to: verificationDateTo,
                        analysis_percentage_min: analysisPercentageMin,
                        analysis_percentage_max: analysisPercentageMax,
                    },
                });
                setRiwayatVerifikasi(response.data.data);
                setTotalRecords(response.data.total);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) fetchData();
    }, [user, search, sortField, sortOrder, page, rowsPerPage, melanomaDetected, verificationDateFrom, verificationDateTo, analysisPercentageMin, analysisPercentageMax]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="dashboard-content">
            <div className="card-custom shadow-xl p-3 mt-4 container">
                <h3 className="font-bold">
                    Riwayat Verifikasi
                    <hr />
                </h3>
                <div className="flex justify-end mb-2 space-x-2">
                    <TextField
                        className="w-1/3"
                        size="small"
                        placeholder="Search.."
                        value={search}
                        onChange={handleSearchChange}
                        variant="outlined"
                    />
                    <FormControl size="small" className="w-1/4">
                        <InputLabel>Melanoma Detected</InputLabel>
                        <Select
                            value={melanomaDetected}
                            onChange={(e) => setMelanomaDetected(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="1">Yes</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        label="Date From"
                        type="date"
                        value={verificationDateFrom}
                        onChange={(e) => setVerificationDateFrom(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        size="small"
                        label="Date To"
                        type="date"
                        value={verificationDateTo}
                        onChange={(e) => setVerificationDateTo(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        size="small"
                        label="Min Analysis %"
                        type="number"
                        value={analysisPercentageMin}
                        onChange={(e) => setAnalysisPercentageMin(e.target.value)}
                    />
                    <TextField
                        size="small"
                        label="Max Analysis %"
                        type="number"
                        value={analysisPercentageMax}
                        onChange={(e) => setAnalysisPercentageMax(e.target.value)}
                    />
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-[50vh]">
                        <ClipLoader color="#4A90E2" loading={loading} size={35} />
                        <span className="ml-2">Memuat data...</span>
                    </div>
                ) : (
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sortDirection={sortField === "created_at" ? sortOrder : false}>
                                            <TableSortLabel
                                                active={sortField === "created_at"}
                                                direction={sortField === "created_at" ? sortOrder : "asc"}
                                                onClick={() => handleSortChange("created_at")}
                                            >
                                                Tanggal Pengajuan
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Pasien</TableCell>
                                        <TableCell>Diagnosis AI</TableCell>
                                        <TableCell>Verifikasi Dokter</TableCell>
                                        <TableCell>Catatan</TableCell>
                                        <TableCell align="right">Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {riwayatVerifikasi.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{`${item.user.firstName} ${item.user.lastName}`}</TableCell>
                                            <TableCell>
                                                <span className={item.skin_analysis.analysis_percentage < 50 ? "text-green-500" : "text-red-500"}>
                                                    {item.skin_analysis.analysis_percentage}% Melanoma
                                                </span>
                                            </TableCell>
                                            <TableCell>{item.verified_melanoma === 1 ? "Melanoma" : "Not Melanoma"}</TableCell>
                                            <TableCell>{item.skin_analysis.catatanDokter || "Tidak ada catatan dari Dokter"}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/dokter/detailVerifikasi/${item.id}`}>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                        Detail
                                                    </button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalRecords}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                )}
            </div>
        </div>
    );
};

export default RiwatVerifikasi;
