import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Account from "./pages/account/Account.tsx";

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
      </Routes>
    </BrowserRouter>
);
