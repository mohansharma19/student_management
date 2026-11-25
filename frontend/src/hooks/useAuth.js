import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../services/api";

// REGISTER
export const useRegister = () => {
    return useMutation({
        mutationFn: async (userData) => {
            const response = await API.post(
                "/auth/register",
                userData
            );

            return response.data;
        },
    });

};

// LOGIN
export const useLogin = () => {
    return useMutation({
        mutationFn: async (userData) => {
            const response = await API.post(
                "/auth/login",
                userData
            );

            return response.data;
        },
    });

};

// VERIFY EMAIL (REGISTRATION)
export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async (token) => {
            const response = await API.get(
                "/auth/verify-email",
                {
                    params: { token },
                }
            );

            return response.data;
        },
    });

};

// GET LOGGED-IN USER
export const useGetMe = () => {
    const token = localStorage.getItem("token");

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await API.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.user;
        },
        enabled: !!token,
        retry: false,
    });

};