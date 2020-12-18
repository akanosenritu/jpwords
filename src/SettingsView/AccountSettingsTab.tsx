import React, {useContext, useState} from "react";
import {useFormik} from "formik";
import {Box, Button, CircularProgress} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {H5} from "../General/Components/Headers";
import {UserContext} from "../data/User";

type InitialStatus = {
  name: "initial"
}
type LoggingInStatus = {
  name: "changing"
}
type SuccessStatus = {
  name: "success"
}
type ErrorStatus = {
  name: "error",
  reason: string
}
type Status = InitialStatus | LoggingInStatus | SuccessStatus | ErrorStatus

const formikInitialValue = {
  oldPassword: "",
  newPassword1: "",
  newPassword2: "",
}

export const AccountSettingsTab: React.FC= (props) => {
  const [status, setStatus] = useState<Status>({name: "initial"})
  const {user, resetPassword} = useContext(UserContext)
  const formik = useFormik({
    initialValues: formikInitialValue,
    onSubmit: (values) => {
      if (user.status === "Anonymous") {
        setStatus({
          name: "error",
          reason: "Cannot change password for an anonymous user."
        })
      } else {
        resetPassword(
          user.username,
          values.oldPassword,
          values.newPassword1,
          values.newPassword2
        )
          .then(result => {
            if (result.status === "success") {
              setStatus({name: "success"});
              formik.resetForm()
            }
            else {
              setStatus({
                name: "error",
                reason: result.reason
              })
            }
          })
      }
    }
  })
  return <div style={{paddingLeft: 10}}>
    <form onSubmit={formik.handleSubmit}>
      <H5>Change password</H5>
      <TextField
        fullWidth={true} name={"oldPassword"} label={"Old password"} placeholder={"old password"} value={formik.values.oldPassword}
        error={!!formik.errors.oldPassword} helperText={formik.errors.oldPassword} autoComplete={"off"} onChange={formik.handleChange}
        type={"password"}
      />
      <TextField
        fullWidth={true} name={"newPassword1"} label={"New password"} placeholder={"new password"} value={formik.values.newPassword1}
        error={!!formik.errors.newPassword1} helperText={formik.errors.newPassword1} autoComplete={"off"} onChange={formik.handleChange}
        type={"password"}
      />
      <TextField
        fullWidth={true} name={"newPassword2"} label={"New password (again)"} placeholder={"new password (again)"} value={formik.values.newPassword2}
        error={!!formik.errors.newPassword2} helperText={formik.errors.newPassword2} autoComplete={"off"} onChange={formik.handleChange}
        type={"password"}
      />
      <Box m={"auto"}>
        <Button type={"submit"} disabled={status.name==="changing"}>Change</Button>
        <div style={{verticalAlign: "-20%", display: "inline-block"}}>
          {status.name === "changing" && <CircularProgress size={20}/>}
        </div>
        {status.name === "error" &&
          <span style={{color:"red"}}>{status.reason}</span>
        }
        {status.name === "success" &&
          <span style={{color:"green"}}>Successfully changed.</span>
        }
      </Box>
    </form>
  </div>
}
