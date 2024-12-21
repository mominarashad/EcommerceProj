import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Sidebar from "./component/AdminDashboard/Sidebar";
// import Navbar from "./component/AdminDashboard/Navbar";
// import Dashboard from "./component/AdminDashboard/AdminDashboard";
import KFCPage from "./foodpanda/KFC";
import MacdonaldPage from "./foodpanda/Macdonald";
import JonnysPage from "./foodpanda/jonny";
import KababjeesPage from "./foodpanda/Kababjees";
import Khaddi from './brandwear/khaddi';
import Sapphire from './brandwear/Sapphire';
import Alkaram from './brandwear/Alkaram';
import SignIn from "./component/signin";
import SignUp from "./component/signup";
import J from './brandwear/J';
import SamsungPage from "./electronics/samsung";
// import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
// import Settings from "./component/AdminDashboard/Settings";
import UserDashboard from "./component/UserDashboard";
import ApplePage from "./electronics/apple";
import PellPage from "./electronics/pell";
import DawlancePage from "./electronics/dawlance";
import EuroPage from "./groceryandcrockery/eurostore";
import AlfatahPage from "./groceryandcrockery/alfatah";
import ImtiazPage from "./groceryandcrockery/imtiaz";
import CarrefourPage from "./groceryandcrockery/carrefour";
// import ProductTable from "./component/AdminDashboard/ProductList";
import './App.css'; // Ensure styles for layout are imported
// import AddProduct from "./component/AdminDashboard/AddProduct";
// import EditProduct from "./component/AdminDashboard/EditProduct";
import ContactForm from "./component/Contact";
// import FetchContact from './component/AdminDashboard/FetchContact'
import CartPage from "./component/Cart";
import Checkout from './component/Checkout';
import ProductDetailsPage from "./foodpanda/ProductDetailsPage";
import ShopCards from "./component/Shops";
import FoodShop from './component/FoodShop';
import ElectronicsShop from './component/ElectronicsShop';
import GroceryShop from './component/GroceryShop';
import DressesShop from './component/DressesShop';
import Dashboard from "./component/AdminDashboard/AdminDashboard";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import Settings from "./component/AdminDashboard/Settings";
import ProductTable from "./component/AdminDashboard/ProductList";
import EditProduct from "./component/AdminDashboard/EditProduct";
import FetchContact from './component/AdminDashboard/FetchContact'
const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Sidebar will persist across all pages */}
       
        <div className="main-content">
          {/* Navbar persists across all pages */}
          
          <Routes>
            {/* <Route path="/admin-dashboard" element={<Dashboard />} /> */}
            
            <Route path="/product/:productId" element={<ProductDetailsPage/>} />
            <Route path="/foods/KFC" element={<KFCPage />} />
            <Route path="/foods/Macdonald" element={<MacdonaldPage />} />
            <Route path="/foods/Jonnys" element={<JonnysPage />} />
            <Route path="/foods/Kababjees" element={<KababjeesPage />} />
            <Route path="/dresses/khaddi" element={<Khaddi />} />
            <Route path="/dresses/sapphire" element={<Sapphire />} />
            <Route path="/dresses/alkaram" element={<Alkaram />} />
            <Route path="/dresses/j" element={<J />} />
            <Route path="/" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/electronics/samsung" element={<SamsungPage />} />
            <Route path="/electronics/apple" element={<ApplePage />} />
            <Route path="/electronics/pell" element={<PellPage />} />
            <Route path="/electronics/dawlance" element={<DawlancePage />} />
            <Route path="/groceryandcrockery/euro" element={<EuroPage />} />
            <Route path="/groceryandcrockery/alfatah" element={<AlfatahPage />} />
            <Route path="/groceryandcrockery/imtiaz" element={<ImtiazPage />} />
            <Route path="/groceryandcrockery/carrefour" element={<CarrefourPage />} />
            {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
            <Route path="/user-dashboard" element={<UserDashboard />} />
            {/* <Route path="/products" element={<ProductTable />} /> */}
            {/* <Route path="/settings" element={<Settings />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} /> */}
            <Route path="/contact" element={<ContactForm />} />
            {/* <Route path="/admincontact" element={<FetchContact/>} /> */}
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path='/user-products' element={<ShopCards/>}/>
            <Route path="/food-shop" element={<FoodShop />} />
            <Route path="/electronics-shop" element={<ElectronicsShop />} />
            <Route path="/dresses-shop" element={<DressesShop />} />
            <Route path="/grocery-shop" element={<GroceryShop />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductTable />} />
            <Route path="/settings" element={<Settings />} />
            {/* <Route path="/add-product" element={<AddProduct />} /> */}
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/admincontact" element={<FetchContact/>} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
