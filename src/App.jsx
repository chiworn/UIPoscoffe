import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import POSHeader from './assets/components/POS/POSHeader';
import "./index.css";
import POS from "./assets/page/POS";
import Dashboard from "./assets/page/Dashboard";
import Reports from "./assets/page/Reports";
import Products from "./assets/page/Products";
import Login from "./assets/page/Login";
import Lyout from "./Lyout";
import Register from "./assets/page/Register";

// Component to handle conditional header
function AppRoutes() {
  const location = useLocation();             


  return (
    <>
      <Routes>
         <Route index  element={<Login />} />
          <Route path="/register" element={<Register/>} />
         <Route element={<Lyout/> } >
            <Route path="/POS" element={<POS />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reports" element={<Reports />} />
         </Route> 
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
