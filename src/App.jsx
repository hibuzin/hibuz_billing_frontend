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

import Login from "./Pages/auth/Login";
import Customers from "./Pages/Customers/Customers";
import Sales from "./Pages/Sales/Sales";
import Payment from "./Pages/Payment/Payment";
import Stocks from "./Pages/Stock/AvailableStocks";
import LowStocks from "./Pages/Stock/LowStock";
import OutOfStock from "./Pages/Stock/OutOfStock";
import GST from "./Pages/GST/GST";
import Analytics from "./Pages/Analytics/Analytics";
import Offers from "./Pages/Offers/Offers";
import Home from "./Pages/Dashboard/Home";

import MyAccount from "./components/MyAccount/PersonIcon";
import Onboarding from "./Pages/auth/Onboarding";

import "./components/styles/theme.css";

import CreateUser from "./Pages/Settings/ManageUsers/CreateUser";
import CreateProduct from "./Pages/Items/CreateItems";
import ItemDetails from "./Pages/Items/ItemDetailsPage";
import CreateSupplier from "./Pages/Suppliers/CreateSupplier";
import SupplierDetails from "./Pages/Suppliers/SupplierDetails";

import CreateCategory from "./Pages/Category/CreateCategory";
import PurchaseBillView from "./Pages/Purchase/PurchaseBillView";
import CreatePurchase from "./Pages/Purchase/CreatePurchase";

import Product from "./Pages/Items/Items";
import Category from "./Pages/Category/Category";

import Supplier from "./Pages/Suppliers/Supplier";

import PurchaseList from "./Pages/Purchase/PurchaseList";

import TopSellingProducts from "./Pages/Sales/TopSellingProducts";

import POSBilling from "./Pages/POSBilling/POSBilling";

import CreateCustomer from "./Pages/Customers/CreateCustomers";

import CreateGRN from "./Pages/GRN/CreateGRN";
import GRN from "./Pages/GRN/GRN";

import CreateReturn from "./Pages/Return/CreateReturn";
import Returns from "./Pages/Return/Returns";

import CreateHSN from "./Pages/HSN/CreateHSN";
import HSNList from "./Pages/HSN/HSNList";

import Account from "./Pages/Settings/Account/Account";
import ManageBusiness from "./Pages/Settings/ManageBusiness/ManageBusiness";
import InvoiceSettings from "./Pages/Settings/InvoiceSetting/InvoiceSettings";
import PrintSettings from "./Pages/Settings/PrintSetting/PrintSettings";
import ManageUsers from "./Pages/Settings/ManageUsers/ManageUsers";
import HelpSupport from "./Pages/Settings/Help/HelpSupport";

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
        className={`main-content ${collapsed ? "collapsed" : ""
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
            path="/lowstock"
            element={<LowStocks />}
          />

          <Route path="/outofstock" 
          element={<OutOfStock />} 
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
            path="/createuser"
            element={<CreateUser />}
          />

          <Route
            path="/account"
            element={<Account />}
          />

          <Route
            path="/managebusiness"
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
            path="/create-product"
            element={<CreateProduct />}
          />

          <Route
  path="/item/:id"
  element={<ItemDetails />}
/>


          <Route
            path="/create-supplier"
            element={<CreateSupplier />}
          />

<Route
  path="/supplier/:id"
  element={<SupplierDetails />}
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
            path="/topsellingproduct"
            element={<TopSellingProducts />}
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

          <Route path="/supplier/:supplierId/purchase/:purchaseId" element={<PurchaseBillView />} />

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

        </Routes>
      </div>
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

const token = localStorage.getItem("token");

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

  // token irundha direct home
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // token illa na old flow
  return isRegistered ? (
    <Navigate to="/login" replace />
  ) : (
    <Navigate to="/onboarding" replace />
  );
}

  // LOGIN ROUTE
  if (location.pathname === "/login") {

  // already logged in
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // registered user
  if (isRegistered) {
    return <Login />;
  }

  // not registered
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

  if (!token) {
  return <Navigate to="/login" replace />;
}

 if (location.pathname === "/posbilling") {
    if (!token) return <Navigate to="/login" replace />;
    return <POSBilling />;
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