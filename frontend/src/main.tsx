import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Account from "./pages/account/Account.tsx";
import ManageService from "./pages/services/ManageService.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<App />} />
        <Route
          path="/account/:tab?"
          element={
            <>
              <Account />
            </>
          }
        />
        <Route 
          path="/services/manage/:id"
          element={
            <>
              <ManageService />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
);
