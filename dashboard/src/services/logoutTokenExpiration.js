import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutOnTokenExpiration = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("ag_app_shop_token");

        if (token) {
            const tokenData = JSON.parse(window.atob(token.split(".")[1]));
            const expirationTime = tokenData.exp * 1000;

            const currentTime = new Date().getTime();

            if (currentTime > expirationTime) {
                localStorage.removeItem("ag_app_shop_token");
                navigate("/login");
            }
        }
    }, [navigate]);

    return null;
};

export default LogoutOnTokenExpiration;
