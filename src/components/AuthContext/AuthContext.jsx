import { createContext, useContext, useState, useEffect } from "react";
import { urlServer } from "../../../config";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [verificandoAuth, setVerificandoAuth] = useState(true);

    useEffect(() => {
        fetch(`${urlServer}/auth/me`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 401) {
                    setUsuario(null);
                    setVerificandoAuth(false);
                    return;
                }
                return res.json();
            })
            .then(dados => {

                if (dados) {
                    setUsuario(dados);
                }

                setVerificandoAuth(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, setUsuario, verificandoAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}