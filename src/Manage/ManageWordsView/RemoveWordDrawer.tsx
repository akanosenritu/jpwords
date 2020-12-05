import React from "react";
import {DrawerBase} from "../DrawerBase";
import {APIWordType} from "../../API/APIWord";

type RemoverProps = {
  word: APIWordType,
  removeWord: (word: APIWordType) => void,
}

const Remover: React.FC<RemoverProps> = props => {
  return <></>
}

type RemoveWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  word: APIWordType,
  removeWord: (word: APIWordType) => void,
}

export const RemoveWordDrawer: React.FC<RemoveWordDrawerProps> = props => {
  return <DrawerBase isOpen={props.isOpen} onClose={props.onClose} inside={<Remover word={props.word} removeWord={props.removeWord} />} />
}