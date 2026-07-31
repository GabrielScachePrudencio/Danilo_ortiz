import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import TelaPagamento from "./pages/TelaPagamento";
import Assinatura from "./pages/Assinatura/Assinatura";
import AdministrativoNovo from './pages/AdministrativoNovo/administrativonovo';
import HomeAluno from './pages/HomeAluno/home-aluno/HomeAluno';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/login/:idplano" element={<Login/>}/>

        <Route path="/home/conta/:idAlunoE" element={<HomeAluno/>}/>
        <Route path="/home/conta" element={<HomeAluno />} />

        <Route path="/home/telapagamento/:idplano" element={<TelaPagamento/>}/>
        <Route path="/home/telapagamento/" element={<TelaPagamento/>}/>

        <Route path="/home/administrativonovo" element={<AdministrativoNovo/>}/>

        <Route path="/home/assinatura" element={<Assinatura />} />

      </Routes>
    </Router>
  );
}

export default App;
