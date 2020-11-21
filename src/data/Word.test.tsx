import {Category, evaluateAnswer, isAnswerCorrect} from "./Word";


export const wordTypeExamples = [
  {
    uuid: "6a9b3e61-1eeb-47a2-82ce-31879476770f",
    kanji: "例",
    kana: "れい",
    category: ["n"] as Category[],
    meaning: "example"
  },
  {
    uuid: "22d662b7-98a9-4ef6-b8b7-1763d33f2e2d",
    kanji: "意味",
    kana: "いみ",
    category: ["vs"] as Category[],
    meaning: "meaning",
    similarWordUUIDs: ["6a9b3e61-1eeb-47a2-82ce-31879476770f"]
  },
  {
    uuid: "8e41dff0-81ca-4e70-b2dd-9116b8679642",
    meaning: "ten",
    kana: "じゅう",
    kanji: "十",
    category: ["num"] as Category[],
    similarWordUUIDs: [
      "dcd0fca7-6c70-4cc1-9998-2df8b7977b11"
    ]
  },
  {
    uuid: "6a45ac20-d511-4931-9c75-eabd682a5ef5",
    meaning: "counter for occurrences",
    kana: "～ど",
    kanji: "～度",
    category: ["n-suf"] as Category[]
  },
]

describe("test WordType related functions", () => {
  test("test isAnswerCorrect()", () => {
    const word = wordTypeExamples[0];
    expect(isAnswerCorrect(word, "れい")).toBe(true);
    expect(isAnswerCorrect(word, "例")).toBe(true);
    expect(isAnswerCorrect(word, "まちがい")).toBe(false);
    const word3 = wordTypeExamples[3];
    expect(isAnswerCorrect(word3, "ど")).toBe(true);
    expect(isAnswerCorrect(word3, "～ど")).toBe(true);
    expect(isAnswerCorrect(word3, "度")).toBe(true);
    expect(isAnswerCorrect(word3, "～度")).toBe(true);
    expect(isAnswerCorrect(word3, "まちがい")).toBe(false);
  })
  test("test evaluateAnswer()", () => {
    const word = wordTypeExamples[0];
    expect(evaluateAnswer(word, "れい")).toBe("CORRECT");
    expect(evaluateAnswer(word, "例")).toBe("CORRECT");
    expect(evaluateAnswer(word, "まちがい")).toBe("WRONG");
    const word2 = wordTypeExamples[2];
    expect(evaluateAnswer(word2, "じゅう")).toBe("CORRECT");
    expect(evaluateAnswer(word2, "十")).toBe("CORRECT");
    expect(evaluateAnswer(word2, "まちがい")).toBe("WRONG");
    expect(evaluateAnswer(word2, "とう")).toBe("CORRECT, BUT NOT WHAT I EXPECTED");
  })
})

