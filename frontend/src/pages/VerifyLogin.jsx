
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyEmail } from "../hooks/useAuth";

const VerifyLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const started = useRef(false);

    const {
        mutate,
        isPending,
        isError,
        error,
        isSuccess,
    } = useVerifyEmail();

    const token = new URLSearchParams(location.search).get("token");

    useEffect(() => {
        if (!token || started.current) return;

        started.current = true;

        mutate(token, {
            onSuccess: () => {
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            },
        });
    }, [token, mutate, navigate]);

    if (!token) {
        return (
            <div className="text-center mt-20 text-red-600">
                Verification token missing.
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="text-center mt-20">
                Verifying your email...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center mt-20 text-red-600">
                {error?.response?.data?.message ||
                    "Email verification failed"}
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center mt-20 text-green-600">
                <h2 className="text-2xl font-bold">
                    Email Verified Successfully!
                </h2>

                <p className="mt-2">
                    Redirecting you to login...
                </p>
            </div>
        );
    }

    return null;
};

export default VerifyLogin;
