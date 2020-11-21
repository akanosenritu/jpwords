import React from 'react';
import {detectParts, evaluateAnswer, wordTypeExamples} from "./Word";

test("test of furigana creation", () => {
  const data = [
    [["歩く", "あるく"], [{main: "歩", furigana: "ある"},　{main: "く", furigana: null}]],
    [["あ", "あ"], [{main: "あ", furigana: null}]],
    [["歩いて来る", "あるいてくる"], [
      {main: "歩", furigana: "ある"}, {main: "い", furigana: null}, {main: "て", furigana: null},
      {main: "来", furigana: "く"}, {main: "る", furigana: null}
    ]],
    [["～円は", "～えんは"], [{main: "～", furigana: null}, {main: "円", furigana: "えん"}, {main: "は", furigana: null}]],
    [["～円", "～えん"], [{main: "～", furigana: null}, {main: "円", furigana: "えん"}]],
    [["海", "うみ"], [{main: "海", furigana: "うみ"}]]
  ];
  data.map(datum => {
    // @ts-ignore
    expect(detectParts(...datum[0])).toStrictEqual(datum[1]);
    // @ts-ignore
    // expect(detectParts2(...datum[0])).toStrictEqual(datum[1]);
  });
  expect(() => {detectParts("", "")}).toThrow();
});

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