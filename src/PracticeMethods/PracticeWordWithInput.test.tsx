import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {PracticeWordWithInput} from "./PracticeWordWithInput";
import {wordTypeExamples} from "../data/Word";

describe("test inputs", () => {
  let word = wordTypeExamples[0];
  let mockOnNext = jest.fn();
  beforeEach(() => {
    mockOnNext = jest.fn()
    render(<PracticeWordWithInput word={word} onNext={mockOnNext} />)
  })
  for (let i=0; i < wordTypeExamples.length; i++) {
    word = wordTypeExamples[i];
    test("no answer, enter pressed once", () => {
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      const parentElement = screen.getByRole("textbox").parentElement;
      if (!parentElement) throw new Error("the parent of the input is null.")
      expect(parentElement).toHaveStyle(`background-color: #fffaf2`)
      expect(mockOnNext.mock.calls.length).toBe(0);
    })

    test("no answer, enter pressed twice", () => {
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      const parentElement = screen.getByRole("textbox").parentElement;
      if (!parentElement) throw new Error("the parent of the input is null.")
      expect(parentElement).toHaveStyle(`background-color: #fffaf2`)
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      expect(mockOnNext.mock.calls.length).toBe(1);
    })

    test("correct answer with kana, enter pressed once", () => {
      userEvent.type(screen.getByRole("textbox"), word.kana);
      const parentElement = screen.getByRole("textbox").parentElement;
      if (!parentElement) throw new Error("the parent of the input is null.")
      expect(parentElement).toHaveStyle(`background-color: #e9fce9`)
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      expect(mockOnNext.mock.calls.length).toBe(1);
    })

    test("correct answer with kanji, enter pressed once", () => {
      userEvent.type(screen.getByRole("textbox"), word.kanji);
      const parentElement = screen.getByRole("textbox").parentElement;
      if (!parentElement) throw new Error("the parent of the input is null.")
      expect(parentElement).toHaveStyle(`background-color: #e9fce9`)
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      expect(mockOnNext.mock.calls.length).toBe(1);
    })

    if (word.category.includes("vs")) {
      test("verify the note is shown", () => {
        expect(screen.getByText("* this word can be made into a verb with -する.")).toBeDefined();
      })
    }
  }
})