import React, {useContext, useState} from "react";
import {Box, Button, CircularProgress, DialogTitle} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import {FormikErrors, useFormik} from "formik";
import {UserContext} from "../data/User";

type LoginInfo = {
  userName: string,
  password: string
}

type Props = {
  close: () => void
}

type InitialStatus = {
  name: "initial"
}
type LoggingInStatus = {
  name: "loggingIn"
}
type SuccessStatus = {
  name: "success"
}
type ErrorStatus = {
  name: "error",
  reason: string
}

type Status = InitialStatus | LoggingInStatus | SuccessStatus | ErrorStatus

export const LoginDialog: React.FC<Props> = (props) => {
  const [status, setStatus] = useState<Status>({
    name: "initial"
  })
  const {login} = useContext(UserContext)
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
      setStatus({
        name: "loggingIn"
      })
      login(values.userName, values.password)
        .then(result => {
          if (result.status === "success") {
            setStatus({name: "success"})
            console.log("login succeeded.")
            setTimeout(()=>props.close(), 2000)
          } else {
            setStatus({name: "error", reason: result.reason})
          }
        })
        .catch(() => {
          setStatus({name: "error", reason: "unknown reason"})
        })
    }
  })
  console.log(status)
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
          <Button type={"submit"} disabled={status.name==="loggingIn"}>Login</Button>
          <div style={{verticalAlign: "-20%", display: "inline-block"}}>
            {status.name === "loggingIn" && <CircularProgress size={20}/>}
          </div>
          {status.name === "error" &&
            <span style={{color:"red"}}>{status.reason}</span>
          }
          {status.name === "success" &&
            <span style={{color:"green"}}>Successfully logged in.</span>
          }
        </Box>
      </form>
    </DialogContent>
  </>
}
