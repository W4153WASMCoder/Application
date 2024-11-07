import React, { useState } from 'react';
import axios from "axios";
import { ActiveToken } from './models';

export interface LoginProps {
    setToken: (tokenID: number) => void;
}

export default function Login(props: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login_endpoint = process.env.REACT_APP_LOGIN_ENDPOINT;
    console.log(login_endpoint);
    const handleLogin = async () => {
        try {
            const response = await axios.post(login_endpoint || '', {
                username,
                password
            });
            // Assuming the response contains the token ID
            if (response.data && response.data.token.TokenID) {
                const token:ActiveToken = response.data.token;
                props.setToken(token.TokenID!);
            } else {
                console.error('Token not received');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Login</h2>
                
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
            </div>
        </div>
    );
}
