const API_URL = 'http://localhost:5000/api/auth';

export const signup = async (email, password) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Signup failed');
    if (data.token) localStorage.setItem('token', data.token);
    return data;
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    if (data.token) localStorage.setItem('token', data.token);
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
export const isAuthenticated = () => !!localStorage.getItem('token');
