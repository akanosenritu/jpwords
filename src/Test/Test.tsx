import React from 'react'
import {ContentEditor} from "../General/Dialogs/ContentEditor"
import {APIWordNoteType} from "../API/APIWordNote"

export const Test = (props: any) => {
  const wordNote: APIWordNoteType = {
    "uuid": "7a7c77b0-b1e6-458a-8c05-b59de0baec96",
    "title": "Auxiliary Suru",
    "associated_words": [],
    "associated_categories": [
      "1a2aa4c2-a3bd-44b0-b69b-af7d6fb7dceb"
    ],
    "is_published": false
  }
  return <ContentEditor onClose={()=>{}} wordNote={wordNote} />
}
