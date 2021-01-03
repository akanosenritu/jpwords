import {renderToStaticMarkup} from "react-dom/server";
import MDX from "@mdx-js/runtime";
import React from "react";
import {Language, LanguageProvider} from "../data/Language";

export const getCode = (content: string, components: any, language: Language) => {
  try {
    return renderToStaticMarkup(
      <div>
        <LanguageProvider language={language}>
          <MDX components={components}>
            {content}
          </MDX>
        </LanguageProvider>
      </div>
    )
  } catch(err) {
    console.error(err)
    return renderToStaticMarkup(
      <div>
        <h1>{err.name}</h1>
      </div>
    )
  }
}