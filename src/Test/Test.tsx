import React from 'react'
import {StaffOnly} from "../General/StaffOnly";

export const Test = (props: any) => (
  <StaffOnly>
    {"STAFF ONLY"}
  </StaffOnly>
)

