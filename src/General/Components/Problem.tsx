import React, {useContext, useState} from "react";
import {HiddenContext} from "../../GrammarView/HiddenContext";
import {UserInteractionContext} from "../../GrammarView/UserInteractionContext";
import {NLPTLevel} from "../../data/NLPTLevel";
import {Language} from "../../data/Language";
import {initialConfigurations, useConfigurations} from "../../LocalStorage/Configurations";

type ProblemProps = {
  answer: string,
  otherPossibleAnswers?: string[],
  dummies?: string[],
  translation?: string,
  translations: {[lang in Language]: string},
  rationale?: React.ReactElement,
  targetLevel?: NLPTLevel
}

export const Problem: React.FC<ProblemProps> = props => {
  const [isHidden, setIsHidden] = useState(true)
  const UserInteraction = useContext(UserInteractionContext)
  const {configurations} = useConfigurations(initialConfigurations)

  const translation = props.translations? props.translations[configurations.language]: props.translation

  return <HiddenContext.Provider value={isHidden}>
    <p>{props.children}</p>
    {translation && <p style={{marginLeft: 10, fontSize: "1rem"}}>{translation}</p>}
    <UserInteraction
      answer={props.answer}
      onCorrectlyAnswered={()=>setIsHidden(false)}
      onWronglyAnswered={()=>setIsHidden(false)}
      isAnswered={!isHidden}
      dummies={props.dummies}
      otherPossibleAnswers={props.otherPossibleAnswers}
    />
    {props.rationale && !isHidden &&
      <p style={{marginLeft: 10, fontSize: "1rem", border: "1px solid lightgray", borderRadius: 10, padding: 4, backgroundColor: "#ebfaeb"}} >{props.rationale}</p>
    }
  </HiddenContext.Provider>
}
