import React from "react";

export type UserInteractionProps = {
  answer: string,
  otherPossibleAnswers?: string[],
  dummies?: string[],
  onCorrectlyAnswered: () => void,
  onWronglyAnswered: () => void,
  isAnswered: boolean
}

export const defaultUserInteraction: React.FC<UserInteractionProps> = props => {
  return <p>
    DEFAULT USER INTERACTION
  </p>
}

export const UserInteractionContext = React.createContext(defaultUserInteraction)