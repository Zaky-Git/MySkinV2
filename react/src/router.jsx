import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import NotFound from "./views/NotFound";
import GuestLayout from "./components/GuestLayout";
import PasienLayout from "./components/PasienLayout";
import DoctorLayout from "./components/DoctorLayout";
import DeteksiKanker from "./views/DeteksiKanker";
import FAQ from "./views/FAQ";
import DaftarPengajuanUmum from "./views/DaftarPengajuanUmum";
import Verifikasi from "./views/Verifikasi";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/",
                element: <DeteksiKanker />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/faq",
                element: <FAQ />,
            },
            {
                path: "/pengajuan",
                element: <DaftarPengajuanUmum />,
            },
            {
                path: "/verifikasi",
                element: <Verifikasi />,
            },
        ],
    },
    {
        path: "/",
        element: <PasienLayout />,
        children: [
            {
                path: "/",
                element: <DeteksiKanker />,
            },
        ],
    },
    {
        path: "/",
        element: <DoctorLayout />,
        children: [
            {
                path: "/pengajuan",
                element: <DaftarPengajuanUmum />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
