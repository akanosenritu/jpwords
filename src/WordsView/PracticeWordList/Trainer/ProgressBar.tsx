import React from "react";
import {createStyles, LinearProgress, Theme} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

type Props = {
  progress: number
}

export const MyLinearProgress =  withStyles((theme: Theme) =>
    createStyles({
      root: {
        height: 10,
        borderRadius: 5,
      },
      colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
      },
    }),
  )(LinearProgress)

export const ProgressBar: React.FC<Props> = props => {
  return <MyLinearProgress variant={"determinate"} style={{width: "100%"}} value={props.progress}/>
}