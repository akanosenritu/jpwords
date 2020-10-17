import React from 'react';
import {detectParts, Word} from "./Word";

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
})