import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ChooseRole from "./pages/ChooseRole";
import CompanyForm from "./pages/CompanyForm";
import InvestorSearch from "./pages/InvestorForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/company-form" element={<CompanyForm />} />
        <Route path="/investor-search" element={<InvestorSearch />} />

      </Routes>
    </Router>
  );
}

export default App;
