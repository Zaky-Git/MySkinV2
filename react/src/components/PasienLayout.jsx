import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

export default function PasienLayout() {
    const { token } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <div>PasienLayout</div>;
}
