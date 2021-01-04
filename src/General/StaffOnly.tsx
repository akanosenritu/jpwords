import React, {useContext} from "react";
import {isStaff, UserContext} from "../data/User";

export const StaffOnly: React.FC = props => {
  const user = useContext(UserContext)
  return <>
    {isStaff(user.user)
      ? props.children
      : <p>You have to be logged in as a staff to view this page.</p>
    }
  </>
}