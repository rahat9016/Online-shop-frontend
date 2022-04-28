import "antd/dist/antd.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "mdb-ui-kit/css/mdb.min.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/nav/Header";
import AdminRoute from "./components/routes/AdminRoute";
import UserRoute from "./components/routes/UserRoute";
import { auth } from "./firebase";
import { currentUser } from "./functions/auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Resister from "./pages/auth/Resister";
import ResisterComplete from "./pages/auth/ResisterComplete";
import CategoryHome from "./pages/category/CategoryHome";
import Home from "./pages/Home";
import Product from "./pages/Product";
import AllProducts from "./pages/product/AllProducts";
import ProductCreate from "./pages/product/ProductCreate";
import ProductUpdate from "./pages/product/ProductUpdate";
import Shop from "./pages/Shop";
import SubHome from "./pages/sub/SubHome";
import History from "./pages/user/History";
import Password from "./pages/user/Password";
import Wishlist from "./pages/user/Wishlist";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                email: res.data.email,
                name: res.data.name,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => console.log(error));
      }
      return () => unsubscribe;
    });
  }, [dispatch]);

  return (
    <div>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/resister">
          <Resister />
        </Route>
        <Route exact path="/resister/complete">
          <ResisterComplete />
        </Route>
        <Route exact path="/forgot/password">
          <ForgotPassword />
        </Route>
        <UserRoute exact path="/user/history">
          <History />
        </UserRoute>
        <UserRoute exact path="/user/password">
          <Password />
        </UserRoute>
        <UserRoute exact path="/user/wishlist">
          <Wishlist />
        </UserRoute>
        <AdminRoute exact path="/admin/dashboard">
          <AdminDashboard />
        </AdminRoute>
        <AdminRoute exact path="/admin/category">
          <CategoryCreate />
        </AdminRoute>
        <AdminRoute exact path="/admin/category/:slug">
          <CategoryUpdate />
        </AdminRoute>
        <AdminRoute exact path="/admin/sub">
          <SubCreate />
        </AdminRoute>
        <AdminRoute exact path="/admin/sub/:slug">
          <SubUpdate />
        </AdminRoute>
        <AdminRoute exact path="/admin/product">
          <ProductCreate />
        </AdminRoute>
        <AdminRoute exact path="/admin/products">
          <AllProducts />
        </AdminRoute>
        <AdminRoute exact path="/admin/product/:slug">
          <ProductUpdate />
        </AdminRoute>
        <Route exact path="/product/:slug">
          <Product />
        </Route>
        <Route exact path="/category/:slug">
          <CategoryHome />
        </Route>
        <Route exact path="/sub/:slug">
          <SubHome />
        </Route>
        <Route exact path="/shop">
          <Shop />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
