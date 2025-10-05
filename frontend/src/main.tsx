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
        path="/services/manage/:id/:tab?"
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
          </>
        }
      />
      <Route
        path="/services/join/:id"
        element={<>
          <JoinPage />
        </>}
      />
      <Route 
        path="/docs"
        element={<>
          <h1>Documentation</h1>
        </>}
      />
      <Route
        path="/support"
        element={
          <>
            <h1>Support</h1>
          </>
        }
      />
    </Routes>
  </BrowserRouter>
);
