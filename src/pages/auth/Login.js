import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { createOrUpdateUser } from "../../functions/auth";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("rahat.official.info9016@gmail.com"); //rahat.official.info9016@gmail.com
  const [password, setPassword] = useState("rahat9016"); //rahat9016
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  // console.log(history?.location?.state?.from);
  useEffect(() => {
    let intended = history?.location?.state;
    if (intended) {
      console.log("IF existing");
      return;
    } else {
      console.log("else existing");
      if (user && user.token) {
        history.push("/");
      }
    }
  }, [user, history]);
  console.log(history?.location?.state?.from);
  const roleBaseRedirect = (res) => {
    let intended = history?.location?.state;
    console.log(intended);
    if (intended) {
      history.push(intended?.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      createOrUpdateUser(idTokenResult.token)
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
          roleBaseRedirect(res);
        })
        .catch((error) => console.log(error));

      history.push("/");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Login with Google
  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
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
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };
  const loginFrom = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type={"email"}
          value={email}
          placeholder="Your E-mail"
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          className="form-control"
        />
      </div>
      <br />
      <div className="form-group">
        <input
          type={"password"}
          value={password}
          placeholder="Your Password"
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="form-control"
        />
      </div>
      <br />
      <Button
        onClick={handleSubmit}
        size="large"
        type="primary"
        shape="round"
        className="mb-3"
        disabled={!email || password.length < 6}
        block
        icon={<MailOutlined />}
      >
        Login with Email/Password
      </Button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}

          {loginFrom()}
          <Button
            onClick={googleLogin}
            size="large"
            type="danger"
            shape="round"
            className="mb-3"
            block
            icon={<GoogleOutlined />}
          >
            Login with Google
          </Button>
          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
