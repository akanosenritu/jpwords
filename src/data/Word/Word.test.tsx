import {Category, evaluateAnswer, loadWords} from "./Word";
import {loadWordListsForLanguage, WordList} from "../WordLists/WordList";
import wordData from "../GeneratedData/words.json";

export const wordTypeExamples = [
  {
    uuid: "6a9b3e61-1eeb-47a2-82ce-31879476770f",
    kanji: "例",
    kana: "れい",
    category: ["n"] as Category[],
    meaning: {
      ENG: "example"
    }
  },
  {
    uuid: "22d662b7-98a9-4ef6-b8b7-1763d33f2e2d",
    kanji: "意味",
    kana: "いみ",
    category: ["n-vs"] as Category[],
    meaning: {
      ENG: "meaning"
    }
  },
  {
    uuid: "8e41dff0-81ca-4e70-b2dd-9116b8679642",
    meaning: {
      ENG: "ten"
    },
    kana: "じゅう",
    kanji: "十",
    category: ["num"] as Category[]
  },
  {
    uuid: "6a45ac20-d511-4931-9c75-eabd682a5ef5",
    meaning: {
      ENG: "counter for occurrences"
    },
    kana: "～ど",
    kanji: "～度",
    category: ["n-suf"] as Category[]
  },
]

describe("test WordType related functions", () => {
  test("test evaluateAnswer()", () => {
    const word = wordTypeExamples[0];
    expect(evaluateAnswer(word, "れい")).toBe("CORRECT");
    expect(evaluateAnswer(word, "れい", true)).toBe("WRONG");
    expect(evaluateAnswer(word, "例")).toBe("CORRECT");
    expect(evaluateAnswer(word, "まちがい")).toBe("WRONG");
    const word2 = wordTypeExamples[2];
    expect(evaluateAnswer(word2, "じゅう")).toBe("CORRECT");
    expect(evaluateAnswer(word2, "じゅう", true)).toBe("WRONG");
    expect(evaluateAnswer(word2, "十")).toBe("CORRECT");
    expect(evaluateAnswer(word2, "まちがい")).toBe("WRONG");
  })
})

describe("test integrity of words data", () => {
  test("confirm the uuid of a word is unique", () => {
    let counts: {[wordUUID: string]: number} = {};
    for (let wordDatum of wordData.words) {
      if (counts[wordDatum.uuid]) counts[wordDatum.uuid] += 1
      else counts[wordDatum.uuid] = 1
    }
    for (let wordUUID in counts) {
      expect(counts[wordUUID]).toBe(1);
    }
  })

  test("confirm every word in the word list for English is present in words.json", async () => {
    const wordsDict = await loadWords()
    const wordLists = await loadWordListsForLanguage("ENG", wordsDict)
    for (let wordList of wordLists) {
      for (const word of wordList.words) {
        expect(word).toBeDefined();
      }
    }
  })

  /**
  test("confirm the category of a word is included in the category list", () => {
    for (let wordUUID in availableWords) {
      const word = availableWords[wordUUID];
      for (let category of word.category) {
        expect(categoryList.includes(category)).toBe(true);
      }
    }
  })
   **/

  /**
  test("confirm the similarWordUUIDs of a word is a valid reference", () => {
    for (let wordUUID in availableWords) {
      const word = availableWords[wordUUID];
      if (!word.similarWordUUIDs) return
      for (let similarWordUUID of word.similarWordUUIDs) {
        expect(availableWords.hasOwnProperty(similarWordUUID)).toBe(true);
      }
    }
  })
   **/
})
