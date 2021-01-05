import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {shuffle} from "lodash"
import {loadWords} from "../../../data/Word/Word";
import {Trainer2} from "./Trainer";

describe("test trainer", () => {
  test("test with random 20 words", async () => {
    const words = await loadWords()
    const selectedWordUUIDs = shuffle(Object.keys(words)).slice(0, 20)
    const selectedWords = selectedWordUUIDs.map(wordUUID => words[wordUUID])
    console.log(selectedWords)
    const finishPractice = jest.fn()
    render(<Trainer2 words={selectedWords} reversed={false} finishPractice={finishPractice} />)
    for (const word of selectedWords) {
      userEvent.type(screen.getByRole("textbox"), word.kana)
      userEvent.type(screen.getByRole("textbox"), "{enter}");
    }
    expect(finishPractice.mock.calls.length).toBe(1)
  })
})