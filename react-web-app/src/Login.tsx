import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { TransitionStates } from "./models";


export interface LoginProps {
    states: TransitionStates;
}
// console.log("Client ID from ENV:", process.env.REACT_APP_GOOGLE_CLIENT_ID);


export default function Login(props: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const login_endpoint = process.env.REACT_APP_LOGIN_ENDPOINT;
const google_endpoint = process.env.REACT_APP_GOOGLE_LOGIN_ENDPOINT || "http://localhost:8080/auth/google";

    // Log the Google Client ID to ensure it's being read properly
    // console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

    const handleLogin = async () => {
        try {
            const response = await axios.post(login_endpoint || "", {
                username,
                password,
            });
            if (response.data && response.data.token.TokenID) {
                const tokenId: string = response.data.token.TokenID;
                Cookies.set("tokenid", tokenId);
                props.states.projects(); // Redirect to projects
            } else {
                console.error("Token not received");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse;

            const response = await axios.post(
                google_endpoint || "",
                { token: credential },
                { withCredentials: true } // Include session cookies
            );

            if (response.data && response.data.user) {
                console.log("Google login successful:", response.data.user);

                // Redirect to project files
                props.states.projects();
            } else {
                console.error("User data not received from Google login");
            }
        } catch (error) {
            console.error("Google Login failed:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="1006258443083-5rfmrf2oguiac3bmi4g1an7n8obmn5m2.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
                        Login to WASM Coder
                    </h2>

                    {/* Username/Password Login */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        Login
                    </button>

                    <div className="text-center my-4 text-gray-500">OR</div>

                    {/* Google Login */}
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => console.error("Google Login Failed")}
                        theme="outline"
                        size="large"
                        useOneTap
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
