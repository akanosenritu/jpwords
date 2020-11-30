import {WordType} from "../../data/Word/Word";
import React from "react";
import {DrawerBase} from "../DrawerBase";

type RemoverProps = {
  word: WordType,
  removeWord: (word: WordType) => void,
}

const Remover: React.FC<RemoverProps> = props => {
  return <></>
}

type RemoveWordDrawerProps = {
  onClose: () => void,
  isOpen: boolean,
  word: WordType,
  removeWord: (word: WordType) => void,
}

export const RemoveWordDrawer: React.FC<RemoveWordDrawerProps> = props => {
  return <DrawerBase isOpen={props.isOpen} onClose={props.onClose} inside={<Remover word={props.word} removeWord={props.removeWord} />} />
}