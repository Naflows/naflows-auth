import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Account from "./pages/account/Account.tsx";
import ManageService from "./pages/services/manage/ManageService.tsx";
import Home from "./pages/home/Home.tsx";
import CreateService from "./pages/services/create/CreateService.tsx";
import AppFooter from "./global/components/AppFooter.tsx";
import JoinPage from "./pages/services/join/JoinPage.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<>
        <Home /><AppFooter />
      </>} />
      <Route path="/login" element={<>
        <App /><AppFooter />
      </>} />
      <Route
        path="/account/:tab?"
        element={
          <>
            <Account />
          </>
        }
      />
      <Route
        path="/account/services/:id?"
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
      <Route
        path="/services/new"
        element={
          <>
            <CreateService />
            <AppFooter />
          </>
        }
      />
      <Route
        path="/services/join/:id"
        element={<>
          <JoinPage />
        </>}
      />

    </Routes>
  </BrowserRouter>
);
