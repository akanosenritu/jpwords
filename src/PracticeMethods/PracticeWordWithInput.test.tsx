import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {PracticeWordWithInput} from "./PracticeWordWithInput";
import {availableWords, WordType} from "../data/Word";
import {wordTypeExamples} from "../data/Word.test";

describe("test inputs2", () => {
  test.each(wordTypeExamples)("no answer, enter pressed once", (word: WordType) => {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    const parentElement = screen.getByRole("textbox").parentElement;
    if (!parentElement) throw new Error("the parent of the input is null.")
    expect(parentElement).toHaveStyle(`background-color: #fffaf2`)
    expect(mockOnNext.mock.calls.length).toBe(0);
  })

  test.each(wordTypeExamples)("no answer, enter pressed twice", (word: WordType) => {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    const parentElement = screen.getByRole("textbox").parentElement;
    if (!parentElement) throw new Error("the parent of the input is null.")
    expect(parentElement).toHaveStyle(`background-color: #fffaf2`)
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    expect(mockOnNext.mock.calls.length).toBe(1);
    expect(mockOnNext.mock.calls[0][0]).toBe(false);
  })

  test.each(wordTypeExamples)("wrong answer input, enter pressed once, answer correctly, enter pressed.", (word: WordType) => {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    userEvent.type(screen.getByRole("textbox"), "WRONG ANSWER");
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    const parentElement = screen.getByRole("textbox").parentElement;
    if (!parentElement) throw new Error("the parent of the input is null.")
    expect(parentElement).toHaveStyle(`background-color: #fffaf2`)
    userEvent.clear(screen.getByRole("textbox"));
    userEvent.type(screen.getByRole("textbox"), word.kana);
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    expect(mockOnNext.mock.calls.length).toBe(1);
    expect(mockOnNext.mock.calls[0][0]).toBe(false);
  })

  test.each(wordTypeExamples)("correct answer with kana, enter pressed once", (word: WordType) => {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    userEvent.type(screen.getByRole("textbox"), word.kana);
    const parentElement = screen.getByRole("textbox").parentElement;
    if (!parentElement) throw new Error("the parent of the input is null.")
    expect(parentElement).toHaveStyle(`background-color: #e9fce9`)
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    expect(mockOnNext.mock.calls.length).toBe(1);
    expect(mockOnNext.mock.calls[0][0]).toBe(true);
  })

  test.each(wordTypeExamples)("correct answer with kanji, enter pressed once", (word: WordType) => {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    userEvent.type(screen.getByRole("textbox"), word.kanji);
    const parentElement = screen.getByRole("textbox").parentElement;
    if (!parentElement) throw new Error("the parent of the input is null.")
    expect(parentElement).toHaveStyle(`background-color: #e9fce9`)
    userEvent.type(screen.getByRole("textbox"), "{enter}");
    expect(mockOnNext.mock.calls.length).toBe(1);
    expect(mockOnNext.mock.calls[0][0]).toBe(true);
  })

  test.each(wordTypeExamples)("similar answer with kana, pressed enter once, correct answer input, pressed enter once", (word: WordType)=> {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    if (word.similarWordUUIDs) {
      const similarWord = availableWords[word.similarWordUUIDs[0]];
      userEvent.type(screen.getByRole("textbox"), similarWord.kana);
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      const parentElement = screen.getByRole("textbox").parentElement;
      expect(parentElement).toHaveStyle(`background-color: #ccffff`)
      userEvent.clear(screen.getByRole("textbox"));
      userEvent.type(screen.getByRole("textbox"), word.kana);
      userEvent.type(screen.getByRole("textbox"), "{enter}");
      expect(mockOnNext.mock.calls.length).toBe(1);
      expect(mockOnNext.mock.calls[0][0]).toBe(true);
    }
  })

  test.each(wordTypeExamples)("verify the note is shown", (word: WordType) => {
    let mockOnNext = jest.fn();
    render(<PracticeWordWithInput word={word} onNext={mockOnNext}/>);
    if (word.category.includes("vs")) {
      expect(screen.queryByText("* this word can be made into a verb with -する.")).toBeDefined();
    }
  })
})
