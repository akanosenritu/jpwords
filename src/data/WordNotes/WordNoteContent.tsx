import React, {lazy, Suspense} from 'react'
import {MDXProvider} from "@mdx-js/react";
import {Ruby} from "../../General/Components/Ruby";
import {EnglishTranslation, SpanishTranslation} from "../../General/Components/Translation";

type WordNoteContentErrorBoundaryState = {
  hasError: boolean
}

class WordNoteContentErrorBoundary extends React.Component<{}, WordNoteContentErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

type WordNoteContentProps = {
  uuid: string
}

export const WordNoteContent: React.FC<WordNoteContentProps> = (props) => {
  if (!props.uuid) return <p>DOES NOT EXIST</p>
  const Content = lazy(()=> import(`./Contents/${props.uuid}.mdx`))
  return <WordNoteContentErrorBoundary>
    <Suspense fallback={<div>...loading</div>} >
      <WordNoteContentMDXProvider>
        <Content />
      </WordNoteContentMDXProvider>
    </Suspense>
  </WordNoteContentErrorBoundary>
}

export const wordNoteContentMDXComponents = {
  Ruby: (props: any) => <Ruby {...props} />,
  script: () => <p>SCRIPT TAG IS NOT ALLOWED</p>,
  ENG: (props: any) => <EnglishTranslation {...props} />,
  ESP: (props: any) => <SpanishTranslation {...props} />
}

export const WordNoteContentMDXProvider: React.FC = props => {
  return <MDXProvider components={wordNoteContentMDXComponents}>
    {props.children}
  </MDXProvider>
}