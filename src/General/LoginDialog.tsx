import React, {useState} from "react";
import {Box, Button, CircularProgress, DialogTitle} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import {FormikErrors, useFormik} from "formik";
import {user} from "../data/User";

type LoginInfo = {
  userName: string,
  password: string
}

type Props = {
  close: () => void
}

export const LoginDialog: React.FC<Props> = (props) => {
  const [statusText, setStatusText] = useState("")
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: ""
    },
    validate: (values) => {
      const errors: FormikErrors<LoginInfo> = {};
      return errors
    },
    onSubmit: (values) => {
      user.logIn(values.userName, values.password)
        .then(() => {
          setStatusText("Logged in successfully.")
          setTimeout(()=>props.close(), 2000)
        })
        .catch(err => {
          console.log(err)
          setStatusText("Unable to login.")
        })
    }
  })

  return <>
    <DialogTitle>Login</DialogTitle>
    <DialogContent>
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
        <Box m={"auto"}>
          <Button type={"submit"} disabled={user.isLoggedIn()}>Login</Button>
          <div style={{verticalAlign: "-20%", display: "inline-block"}}>
            {user.status === "LoggingIn" && <CircularProgress size={20}/>}
          </div>
          {statusText &&
          <span style={{color: user.isLoggedIn()? "green": "red"}}>{statusText}</span>
          }
        </Box>
      </form>
    </DialogContent>
  </>
}