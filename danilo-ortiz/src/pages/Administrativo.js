import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function Conta(){
    const navigate = useNavigate();

    const [erro, setErro] = useState();

    const url = "http://localhost:8080/alunos";

    //useEffect(() => {
    //    pegarAlunoPorId();
    //}, []);

   
    
    const irParaFazerLogin = () => {
        navigate("/login");
    }
    const irParaFazerHome = () => {
        navigate("/");
    }
    const irParaAdm = () => {
        navigate("home/administrativo");
    }
    return (

        <div>
            <h1>ADMINISTRATIVO</h1>
            
        </div>
    );
}