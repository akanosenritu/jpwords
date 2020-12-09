import React, {useContext, useState} from "react";
import {Box, Button, CircularProgress, DialogTitle} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import {FormikErrors, useFormik} from "formik";
import {UserContext} from "../data/User";

type SignUpInfo = {
  username: string,
  password1: string,
  password2: string
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

export const SignUpDialog: React.FC<Props> = (props) => {
  const [status, setStatus] = useState<Status>({name: "initial"})
  const {signUp} = useContext(UserContext)
  const formik = useFormik({
    initialValues: {
      username: "",
      password1: "",
      password2: ""
    },
    validate: (values) => {
      const errors: FormikErrors<SignUpInfo> = {};
      return errors
    },
    onSubmit: (values) => {
      setStatus({
        name: "loggingIn"
      })
      signUp(values.username, values.password1, values.password2)
        .then(result => {
          if (result.status === "success"){
            setStatus({
              name: "success",
            })
            setTimeout(()=>props.close(), 2000)
          } else {
            setStatus({
              name: "error",
              reason: result.reason
            })
          }
        })
        .catch(err => {
          console.log("sign up failed for unknown reason.", err)
          setStatus({
            name: "error",
            reason: "unknown error."
          })
        })
    }
  })
  return <>
    <DialogTitle>Sign Up</DialogTitle>
    <DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth={true} name={"username"} label={"Username"} placeholder={"username"} value={formik.values.username}
          error={!!formik.errors.username} helperText={formik.errors.username} autoComplete={"off"} onChange={formik.handleChange}
        />
        <TextField
          fullWidth={true} name={"password1"} label={"Password"} placeholder={"password"} value={formik.values.password1}
          error={!!formik.errors.password1} helperText={formik.errors.password1} autoComplete={"off"} onChange={formik.handleChange}
          type={"password"}
        />
        <TextField
          fullWidth={true} name={"password2"} label={"Password (again)"} placeholder={"password (again)"} value={formik.values.password2}
          error={!!formik.errors.password2} helperText={formik.errors.password2} autoComplete={"off"} onChange={formik.handleChange}
          type={"password"}
        />
        <Box m={"auto"}>
          <Button type={"submit"}>Sign Up</Button>
          <div style={{verticalAlign: "-20%", display: "inline-block"}}>
            {status.name === "loggingIn" && <CircularProgress size={20}/>}
          </div>
          {status.name === "success" &&
            <span style={{color: "green"}}>Successfully signed up.</span>
          }
          {status.name === "error" &&
            <span style={{color: "red"}}>{status.reason}</span>
          }
        </Box>
      </form>
    </DialogContent>
  </>
}