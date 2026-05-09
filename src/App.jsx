import AppBar from "./components/AppBar/AppBar";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "./components/MyAccount/Login";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Payment from "./pages/Payment";
import Stocks from "./pages/Stocks";
import GST from "./pages/GST";
import Analytics from "./pages/Analytics";
import Offers from "./pages/Offers";
import Home from "./pages/Home";
import CreateUser from "./components/MyAccount/CreateCashier";
import Cashier from "./components/Cashier";
import MyAccount from "./components/MyAccount/PersonIcon";
import Toast from "./components/Toast";
import Register from "./components/Register";
import Onboarding from "./components/Onboarding";
import Admin from "./components/MyAccount/Admin";
import CreateAdmin from "./components/CreateAdmin";
import "./components/styles/theme.css";
import MyAccountPage from "./components/MyAccount/MyAccountPage";
import CreateProduct from "./components/CreateProduct";
import CreateSupplier from "./components/CreateSupplier";
import CreateCategory from "./components/CreateCategory";
import CreatePurchase from "./components/CreatePurchase";
import Product from "./components/Product";
import Category from "./components/Category";
import Supplier from "./components/Supplier";
import PurchaseList from "./components/PurchaseList";
import Bill from "./components/Bill";


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