import { createContext, useContext, useState, useEffect } from "react";
import { urlServer } from "../../../config";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [verificandoAuth, setVerificandoAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setVerificandoAuth(false);
            return;
        }

        fetch(`${urlServer}/auth/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem("authToken");
                    setUsuario(null);
                    setVerificandoAuth(false);
                    return;
                }
                return res.json();
            })
            .then(dados => {
                if (dados && dados.id) {
                    setUsuario(dados);
                }
                setVerificandoAuth(false);
            })
            .catch(erro => {
                console.error("Erro ao verificar autenticação:", erro);
                localStorage.removeItem("authToken");
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