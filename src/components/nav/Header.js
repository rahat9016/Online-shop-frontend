import {
  AppstoreOutlined,
  LoginOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Search from "../forms/Search";
const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const handleClick = (e) => {
    setCurrent(e.key);
  };
  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };
  return (
    <div>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Item key="home" icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Item>
        {!user && (
          <Item className="ml-auto" key="resister" icon={<UserAddOutlined />}>
            <Link to="/resister">Resister</Link>
          </Item>
        )}
        {!user && (
          <Item key="login" icon={<UserOutlined />}>
            <Link to="/login">Login</Link>
          </Item>
        )}

        {user && (
          <SubMenu
            className="ml-auto"
            icon={<SettingOutlined />}
            title={user.email && user.email.split("@")[0]}
          >
            {user && user.role === "subscriber" && (
              <Item>
                <Link to="/user/history">Dashboard</Link>
              </Item>
            )}
            {user && user.role === "admin" && (
              <Item>
                <Link to="/admin/dashboard">Dashboard</Link>
              </Item>
            )}
            <Item key="setting:2">Option 2</Item>
            <Item key="logout" icon={<LoginOutlined />} onClick={logout}>
              Logout
            </Item>
          </SubMenu>
        )}
        <span className="float-right p-1">
          <Search />
        </span>
      </Menu>
    </div>
  );
};

export default Header;
