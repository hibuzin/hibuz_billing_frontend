const BASE_URL = "http://192.168.31.181:5000/api";

export const API = {

  // auth
   login: `${BASE_URL}/auth/login`,
  createUser: `${BASE_URL}/auth/create-user`,
  registerSuperAdmin: `${BASE_URL}/auth/register-super-admin`,

  
  // users
  users: `${BASE_URL}/users`,
  admins: `${BASE_URL}/admins`,
  cashiers: `${BASE_URL}/cashier`,
  

   // customers
  customers: `${BASE_URL}/customer/customers`,
  customerSearch: `${BASE_URL}/customer/customers/search`,

  //bill
  bill:`${BASE_URL}/bill`,

  //supplier 
  createsupplier:`${BASE_URL}/supplier/add`,
  suppliers: `${BASE_URL}/supplier`,

  // category
categories: `${BASE_URL}/category`,

// products
products: `${BASE_URL}/productadd`,
  createProduct: `${BASE_URL}/productadd/add`,


// purchase
purchase: `${BASE_URL}/purchase/purchase`,
createPurchase: `${BASE_URL}/purchase/purchase`,

};

