import React from "react";
import {createUserPreference, UserPreference} from "../data/Storage/UserPreference";

export const DebugContext = React.createContext(false);

export const UserPreferenceContext = React.createContext<UserPreference>(createUserPreference());