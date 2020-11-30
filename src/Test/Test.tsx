import React from "react";
import {WordNote2} from "../data/WordNotes/WordNote";

const Test: React.FC = () => {
  const wordNote = {
      "associatedWords": [
        "0617ad18-1ed1-426e-812a-94a6e8574f29",
        "c9ae256f-1f1c-4dc0-964d-9bcb33ccf912",
        "fc4918db-4c74-4e27-9240-1674004a19fe",
        "f0916aae-9810-4201-8b05-13f5efd1f043",
        "78afaed4-875e-4394-ba8d-f7294ed8f827"
      ],
      "title": "Yesterday, today, tomorrow",
      "id": "3afe3d68-7075-409b-9948-425f7a05e27f",
      "content": "\nJapanese date expressions are like this:\n\n* 一昨々日 (さきおととい): 3 days ago, seldom used.\n* 一昨日 (おととい): the day before yesterday, 2 days ago.\n* 昨日 (きのう): yesterday.\n* 今日 (きょう、こんにち): today. The expression of \"こんにちは\" (hello) comes from the abbreviation of \"今日はご機嫌いががですか\" (how are you today?). \n* 明日 (あした): tomorrow.\n* 明後日 (あさって): the day after tomorrow, 2 days later.\n* 明々後日 (しあさって): 3 days later.\n\nYou can also use \"～日前\" (～にちまえ, \"~days ago\") and \"～日後\" (~にちご, \"~days after\").\n* 15日前 (じゅうご-にちまえ, \"15 days ago\")\n* 30日後 (さんじゅう-にちご, \"30 days later)\n\nNumbers 2 to 10 need special care reading them however, since for example \"2日\" is \"ふつか\", not \"ににち\".\n* 2日前 (ふつかまえ, \"2 days ago\")\n* 10日後 (とおかご, \"10 days later\") \n"
    }
  return <WordNote2 wordNote={wordNote} />
}

export default Test