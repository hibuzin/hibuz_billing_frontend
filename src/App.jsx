import AppBar from "./components/AppBar/AppBar";
import Sidebar from "./components/Sidebar/Sidebar";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useState, useEffect } from "react";

import Login from "./components/MyAccount/Login";
import Customers from "./pages/Customers/Customers";
import Products from "./pages/Products/Products";
import Sales from "./pages/Sales";
import Payment from "./pages/Payment";
import Stocks from "./pages/Stocks";
import GST from "./pages/GST/GST";
import Analytics from "./pages/Analytics";
import Offers from "./Pages/Settings";
import Settings from "./pages/Settings";
import Home from "./pages/Home";

import CreateUser from "./components/MyAccount/Cashier/CreateCashier";
import Cashier from "./components/MyAccount/Cashier/Cashier";
import MyAccount from "./components/MyAccount/PersonIcon";
import Register from "./components/Register";
import Onboarding from "./components/Onboarding";

import Admin from "./components/MyAccount/Admin/Admin";
import CreateAdmin from "./components/MyAccount/Admin/CreateAdmin";

import "./components/styles/theme.css";

import MyAccountPage from "./components/MyAccount/MyAccountPage";

import CreateProduct from "./Pages/Products/CreateProduct";
import CreateSupplier from "./components/CreateSupplier";

import CreateCategory from "./Pages/Category/CreateCategory";

import CreatePurchase from "./Pages/Purchase/CreatePurchase";

import Product from "./Pages/Products/Product";
import Category from "./Pages/Category/Category";

import Supplier from "./components/Supplier";

import PurchaseList from "./Pages/Purchase/PurchaseList";

import Bill from "./components/Bill";

import CreateCustomer from "./Pages/Customers/CreateCustomers";

import CreateGRN from "./Pages/GRN/CreateGRN";
import GRN from "./Pages/GRN/GRN";

import CreateReturn from "./Pages/Return/CreateReturn";
import Returns from "./Pages/Return/Returns";

import CreateHSN from "./Pages/HSN/CreateHSN";
import HSNList from "./Pages/HSN/HSNList";

import Account from "./Pages/Settings/Account";
import ManageBusiness from "./pages/Settings/ManageBusiness";
import InvoiceSettings from "./pages/Settings/InvoiceSettings";
import PrintSettings from "./pages/Settings/PrintSettings";
import ManageUsers from "./pages/Settings/ManageUsers";
import HelpSupport from "./pages/Settings/HelpSupport";

import { API } from "./constants/api";

function MainLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [lang, setLang] =
    useState("en");

  return (
    <>
      <AppBar
        lang={lang}
        setLang={setLang}
      />

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        lang={lang}
      />

      <div
        className={`main-content ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <Routes>
          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/sales"
            element={<Sales />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/stocks"
            element={<Stocks />}
          />

          <Route
            path="/gst"
            element={<GST />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/offers"
            element={<Offers />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/account"
            element={<Account />}
          />

          <Route
            path="/myaccountpage"
            element={<MyAccountPage />}
          />

          <Route
            path="/settings/business"
            element={<ManageBusiness />}
          />

          <Route
            path="/settings/invoice"
            element={<InvoiceSettings />}
          />

          <Route
            path="/settings/print"
            element={<PrintSettings />}
          />

          <Route
            path="/settings/users"
            element={<ManageUsers />}
          />

          <Route
            path="/settings/support"
            element={<HelpSupport />}
          />

          <Route
            path="/myaccount"
            element={<MyAccount />}
          />

          <Route
            path="/create-user"
            element={<CreateUser />}
          />

          <Route
            path="/cashier"
            element={<Cashier />}
          />

          <Route
            path="/create-product"
            element={<CreateProduct />}
          />

          <Route
            path="/create-supplier"
            element={<CreateSupplier />}
          />

          <Route
            path="/create-category"
            element={<CreateCategory />}
          />

          <Route
            path="/create-purchase"
            element={<CreatePurchase />}
          />

          <Route
            path="/product"
            element={<Product />}
          />

          <Route
            path="/category"
            element={<Category />}
          />

          <Route
            path="/supplier"
            element={<Supplier />}
          />

          <Route
            path="/purchase"
            element={<PurchaseList />}
          />

          <Route
            path="/bill"
            element={<Bill />}
          />

          <Route
            path="/create-customer"
            element={<CreateCustomer />}
          />

          <Route
            path="/create-grn"
            element={<CreateGRN />}
          />

          <Route
            path="/grn"
            element={<GRN />}
          />

          <Route
            path="/create-returns"
            element={<CreateReturn />}
          />

          <Route
            path="/return"
            element={<Returns />}
          />

          <Route
            path="/hsn"
            element={<HSNList />}
          />

          <Route
            path="/create-hsn"
            element={<CreateHSN />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

          <Route
            path="/create-admin"
            element={<CreateAdmin />}
          />
        </Routes>
      </div>
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  const [loading, setLoading] =
    useState(true);

  const [isRegistered, setIsRegistered] =
    useState(false);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const res = await fetch(
        API.setstatus,
      );

      const data = await res.json();

      setIsRegistered(data.isRegistered);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // ROOT ROUTE
  if (location.pathname === "/") {
    return isRegistered ? (
      <Navigate to="/login" replace />
    ) : (
      <Navigate to="/onboarding" replace />
    );
  }

  // LOGIN ROUTE
  if (location.pathname === "/login") {

    // already registered na login allow
    if (isRegistered) {
      return <Login />;
    }

    // register agala na onboarding ku redirect
    return <Navigate to="/onboarding" replace />;
  }

  // ONBOARDING ROUTE
  if (location.pathname === "/onboarding") {

    // already registered na onboarding open aaga kudathu
    if (isRegistered) {
      return <Navigate to="/login" replace />;
    }

    return <Onboarding />;
  }

  // REGISTER ROUTE
  if (location.pathname === "/register") {
    return <Register />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;