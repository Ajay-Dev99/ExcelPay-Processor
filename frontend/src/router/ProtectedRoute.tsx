import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {

    const token = localStorage.getItem("token");

    const isValid = token && token !== "undefined" && token !== "null";

    if (!isValid) {
        return <Navigate to="/" />;
    }

    return children;
}