import React from "react";
import {PracticeHistory} from "../data/PracticeHistory";

export const DebugContext = React.createContext(false);

export const PracticeHistoryContext = React.createContext<PracticeHistory|null>(null)