import { DollarOutlined, DownSquareOutlined } from "@ant-design/icons";
import { Checkbox, Menu, Radio, Slider } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import Star from "../components/forms/Star";
import { getCategories } from "../functions/category";
import { fetchProductByFilter, getProductByCount } from "../functions/product";
import { getSubs } from "../functions/sub";
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "HP",
    "Asus",
    "Acer",
    "Lenovo",
    "Samsung",
    "Microsoft",
    "Gental park",
    "No Brand",
  ]);
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");
  let { search } = useSelector((state) => ({ ...state }));
  let { text } = search;
  const dispatch = useDispatch();
  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => setCategories(res.data));
    getSubs().then((res) => {
      setSubs(res.data);
    });
  }, []);
  const fetchProducts = (arg) => {
    fetchProductByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };
  // 1 Load products by default page
  const loadAllProducts = () => {
    setLoading(true);
    getProductByCount(12)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  // 2 load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3 load products based on price range
  useEffect(() => {
    fetchProducts({ price });
  }, [price]);

  //Handler Price
  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    //reset
    setCategoryIds([]);
    setPrice(value);
    setSub("");
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  //Show categories handler
  const showCategories = () => {
    return categories.map((c) => (
      <div>
        <Checkbox
          onChange={handleClick}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));
  };

  const handleClick = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // setPrice([0, 0]);
    // setStar("");
    // setSub("");
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };
  //Show product by star
  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(0, 0);
    setCategoryIds([]);
    setStar(num);
    setSub("");
    fetchProducts({ stars: num });
  };
  const showStars = () => {
    return (
      <div>
        <Star starClick={handleStarClick} numberOfStars={5} />
        <Star starClick={handleStarClick} numberOfStars={4} />
        <Star starClick={handleStarClick} numberOfStars={3} />
        <Star starClick={handleStarClick} numberOfStars={2} />
        <Star starClick={handleStarClick} numberOfStars={1} />
      </div>
    );
  };
  //Show products by Subs
  const showSubs = () =>
    subs.map((sub) => {
      return (
        <div
          className="p-2 badge badge-secondary m-1"
          key={sub._id}
          onClick={() => handleSubmit(sub)}
          style={{ cursor: "pointer" }}
        >
          {sub.name}
        </div>
      );
    });
  const handleSubmit = (sub) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(0, 0);
    setCategoryIds([]);
    setStar("");
    fetchProducts({ sub });
  };

  //Show product based on brand name
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-1 pr-4"
      >
        {b}
      </Radio>
    ));
  const handleBrand = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(0, 0);
    setCategoryIds([]);
    setStar("");
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  //Show product based on color
  const showColors = () =>
    colors.map((c) => (
      <Radio
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-1 pr-4"
      >
        {c}
      </Radio>
    ));
  const handleColor = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(0, 0);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor(e.target.value);
    fetchProducts({ color: e.target.value });
  };
  //Show product based on color
  const showShipping = () => (
    <>
      <Checkbox
        value="Yes"
        checked={shipping === "Yes"}
        onChange={handleShippingChange}
        className="pb-1 pl-1 pr-4"
      >
        Yes
      </Checkbox>
      <Checkbox
        value="No"
        checked={shipping === "No"}
        onChange={handleShippingChange}
        className="pb-1 pl-1 pr-4"
      >
        No
      </Checkbox>
    </>
  );
  const handleShippingChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice(0, 0);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />
          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
          >
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4 "
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>
            {/* Category  */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Categories
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showCategories()}</div>
            </SubMenu>
            {/* Ratings */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Sub Categories
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showStars()}</div>
            </SubMenu>
            {/* Sub categories  */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Ratings
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-4  pr-4 p-4">
                {showSubs()}
              </div>
            </SubMenu>
            {/* Brand */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Brand
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="p-5">
                {showBrands()}
              </div>
            </SubMenu>
            {/* Colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Colors
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="p-5">
                {showColors()}
              </div>
            </SubMenu>
            {/* Shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Shipping
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="p-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p> No Products Found</p>}
          <div className="row pb-5">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 mt-5">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
