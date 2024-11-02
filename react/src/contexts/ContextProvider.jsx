import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    loginUser: () => {},
    logoutUser: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("USER")) || null
    );
    const [role, setRole] = useState(localStorage.getItem("USER_ROLE") || null);
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [notification, _setNotification] = useState("");
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("USER"));
        if (storedUser) {
            setUser(storedUser);
        }
        const storedRole = localStorage.getItem("USER_ROLE");
        if (storedRole) {
            setRole(storedRole);
        }
        const storedToken = localStorage.getItem("ACCESS_TOKEN");
        if (storedToken) {
            _setToken(storedToken);
        }
    }, []);

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const setNotification = (message) => {
        _setNotification(message);

        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    const loginUser = (userData, userToken, userRole) => {
        setUser(userData);
        setToken(userToken);
        setRole(userRole);
        localStorage.setItem("USER", JSON.stringify(userData));
        localStorage.setItem("USER_ROLE", userRole);
    };

    const logoutUser = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("USER");
        localStorage.removeItem("USER_ROLE");
    };

    return (
        <StateContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                role,
                notification,
                setNotification,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
