import AppBar from "./components/AppBar/AppBar";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "./components/MyAccount/Login";
import Customers from "./pages/Customers/Customers";
import Products from "./pages/Products/Products";
import Sales from "./pages/Sales";
import Payment from "./pages/Payment";
import Stocks from "./pages/Stocks";
import GST from "./pages/GST/GST";
import Analytics from "./pages/Analytics";
import Offers from "./pages/Offers";
import Home from "./pages/Home";
import CreateUser from "./components/MyAccount/Cashier/CreateCashier";
import Cashier from "./components/MyAccount/Cashier/Cashier";
import MyAccount from "./components/MyAccount/PersonIcon";
import Toast from "./components/Toast";
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
import CreatePartialGRN from "./Pages/GRN/CreatePartialGRN";
import CreateReturn from "./Pages/Return/CreateReturn";
import Returns from "./Pages/Return/Returns";
import CreateHSN from "./Pages/HSN/CreateHSN";
import HSNList from "./Pages/HSN/HSNList";


function MainLayout() {
   const [collapsed, setCollapsed] = useState(false); 
   const [lang, setLang] = useState("en");
  return (
    <>
     <AppBar lang={lang} setLang={setLang} />
<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} lang={lang} />
      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/home" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/gst" element={<GST />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-supplier" element={<CreateSupplier />} />
          <Route path="/create-category" element={<CreateCategory/>}/>
          <Route path="/create-purchase" element={<CreatePurchase/>}/>
          <Route path="/product" element={<Product/>}/>
          <Route path="/category" element={<Category/>}/>
          <Route path="/supplier" element={<Supplier/>}/>
          <Route path="/Purchase" element={<PurchaseList/>}/>
          <Route path="/bill" element={<Bill/>}/>
          <Route path="/create-customer" element={<CreateCustomer/>}/>
          <Route path="/create-grn" element={<CreateGRN/>}/>
          <Route path="/grn" element={<GRN/>}/>
          <Route path="/create-returns" element={<CreateReturn/>}/>
          <Route path="/return" element={<Returns/>}/>
          <Route path="/hsn" element={<HSNList/>}/>
          <Route path="/create-hsn" element={<CreateHSN/>}/>

        </Routes>        
      </div>
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Login />;
  }

  if (location.pathname === "/create-user") {
    return <CreateUser />;
  }

  if (location.pathname === "/cashier") {
    return <Cashier />;
  }
if (location.pathname === "/register") {
  return <Register />;
}
if (location.pathname === "/onboarding") {
  return <Onboarding />;
}
if (location.pathname === "/admin") {
  return <Admin />;
}
if (location.pathname === "/create-admin") {
  return <CreateAdmin />;
}
if (location.pathname === "/myaccountpage") {
  return <MyAccountPage />;
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