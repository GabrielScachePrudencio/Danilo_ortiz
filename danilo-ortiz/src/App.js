import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Administrativo from "./pages/Administrativo";
import Conta from "./pages/Conta";
import Login from "./pages/Login";
import TelaPagamento from "./pages/TelaPagamento";
import ErroPagamento from "./pages/ErroPagamento";
import CorretoPagamento from "./pages/CorretoPagamento";
import Assinatura from "./pages/Assinatura/Assinatura";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/login/:idplano" element={<Login/>}/>

        <Route path="/home/conta/:idAlunoE" element={<Conta/>}/>
        <Route path="/home/conta" element={<Conta />} />

        <Route path="/home/telapagamento/erro" element={<ErroPagamento/>}/>
        <Route path="/home/telapagamento/correto" element={<CorretoPagamento/>}/>

        <Route path="/home/telapagamento/:idplano" element={<TelaPagamento/>}/>
        <Route path="/home/telapagamento/" element={<TelaPagamento/>}/>

        <Route path="/home/administrativo" element={<Administrativo/>}/>

        <Route path="/home/assinatura" element={<Assinatura />} />


      </Routes>
    </Router>
  );
}

export default App;
