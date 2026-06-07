const BASE_URL = "https://pos-backend-6uh4.onrender.com/api";

export const API = {

  // auth
  login: `${BASE_URL}/auth/login`,
  createUser: `${BASE_URL}/auth/create-user`,
  registerSuperAdmin: `${BASE_URL}/auth/register-super-admin`,

  // setup
  setstatus: `${BASE_URL}/auth/setup-status`,

  // users
  users: `${BASE_URL}/users`,
  admins: `${BASE_URL}/admins`,
  cashiers: `${BASE_URL}/cashier`,

  // customers
  customers: `${BASE_URL}/customer/customers`,
  customerSearch: `${BASE_URL}/customer/customers/search`,

  // bill
  bill: `${BASE_URL}/bill`,
  scan: `${BASE_URL}/scan`,
  holdBill: `${BASE_URL}/hold-bill/hold`,

  // supplier
  createsupplier: `${BASE_URL}/supplier/add`,
  suppliers: `${BASE_URL}/supplier`,
  supplierPurchases: (id) => `${BASE_URL}/supplier/${id}/purchases`,
  supplierProductSummary: (id) =>
    `${BASE_URL}/supplier/${id}/product-wise-summary`,
  supplierbalance: `${BASE_URL}/supplier/supplier-balances`,

  // category
  categories: `${BASE_URL}/category`,

  // products
  products: `${BASE_URL}/productadd`,
  createProduct: `${BASE_URL}/productadd/add`,

  // purchase
  purchase: `${BASE_URL}/purchase`,
  createPurchase: `${BASE_URL}/purchase/purchase`,
  purchaseById: (id) => `${BASE_URL}/purchase/${id}`,

  // stock
  stock: `${BASE_URL}/stock`,
  stockValue: `${BASE_URL}/stock/stock-value`,
};