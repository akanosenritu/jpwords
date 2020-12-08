import React, {useEffect} from "react";
import {Box, Button, TextField} from "@material-ui/core";
import {login, token} from "./API/API";
import {FormikErrors, useFormik} from "formik";
import Cookies from "js-cookie";
import {user} from "./data/User";

type LoginInfo = {
  userName: string,
  password: string
}

export const Login: React.FC = () => {
  useEffect(() => {
    fetch("/set-csrf-token/")
      .then(res => res.json())
      .then(data => console.log(data))
  }, [])
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: ""
    },
    validate: (values) => {
      const errors: FormikErrors<LoginInfo> = {};
      if (!values.userName) {
        errors.userName = "User name must not be empty."
      }
      if (!values.password) {
        errors.userName = "Password must not be empty."
      }
    },
    onSubmit: (values) => {
      user.logIn(values.userName, values.password)
    }
  })
  const onLogout = () => {
    user.logOut()
  }
  return <Box mx={3}>
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth={true} name={"userName"} label={"Username"} placeholder={"username"} value={formik.values.userName}
        error={!!formik.errors.userName} helperText={formik.errors.userName} autoComplete={"off"} onChange={formik.handleChange}
      />
      <TextField
        fullWidth={true} name={"password"} label={"Password"} placeholder={"password"} value={formik.values.password}
        error={!!formik.errors.password} helperText={formik.errors.password} autoComplete={"off"} onChange={formik.handleChange}
        type={"password"}
      />
      <Button type={"submit"}>Login</Button>
      <Button onClick={onLogout}>Logout</Button>
    </form>
  </Box>
}