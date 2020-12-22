import React, {useEffect, useState} from "react";
import {getAudioForWord} from "../../API/APIAudioFile";
import {IconButton} from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

type Props = {
  wordUUID: string,
  url?: string
}

export const PlayAudioButton: React.FC<Props> = props => {
  const [url, setURL] = useState<null|string>(props.url? props.url: null)
  useEffect(() => {
    if (props.url) return
    getAudioForWord(props.wordUUID)
      .then(result => {
        if (result.status === "success") {
          setURL(result.audioFile.url)
        }
      })
      .catch(err => {})
  }, [props.wordUUID, props.url])
  const onClick = () => {
    if (!url) return
    const audio = new Audio(url)
    audio.play()
  }
  return <IconButton disabled={url===null} onClick={onClick} style={{padding: 0, border: 0}}>
    <PlayCircleOutlineIcon />
  </IconButton>
}