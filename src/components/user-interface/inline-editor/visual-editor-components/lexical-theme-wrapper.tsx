import React, { useEffect, useState } from 'react';
import { EditorThemeClasses } from 'lexical';
import {
  Text,
  Quote,
  Heading,
  ListItem,
  OrderedList,
  UnorderedList
} from 'spectacle';
import styled, {
  css,
  StyledComponent,
  createGlobalStyle
} from 'styled-components';

/**
 * @todo: Import prism theme directly from spectacle
 */
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/vs-dark';

const CODE_THEME = dark;
const CODE_HIGHLIGHT_CLASSES: Record<string, string> = Object.keys(
  CODE_THEME
).reduce((acc, cur) => ({ ...acc, [cur]: `editor-token-${cur}` }), {});

const Heading1 = styled(Heading).attrs({ fontSize: 'h1' })``;
const Heading2 = styled(Heading).attrs({ fontSize: 'h2' })``;
const Heading3 = styled(Heading).attrs({ fontSize: 'h3' })``;

/**
 * Object of styles to be preloaded to dynamically retrieve styled-component classNames.
 * If a styled-component is not in this object, it will not be consumed by the theme properly.
 */
const styles: { [key: string]: React.FC } = {
  text: Text,
  blockquote: Quote,
  'header-one': Heading1,
  'header-two': Heading2,
  'header-three': Heading3,
  'list-item': ListItem,
  'ordered-list': OrderedList,
  'unordered-list': UnorderedList
};

/**
 * Retrieves a styled-component className
 */
const getClassName = (component: unknown) =>
  (component as StyledComponent<any, any>).componentStyle?.lastClassName;

export const LexicalThemeWrapper = ({
  children
}: {
  children: (theme?: EditorThemeClasses) => React.ReactNode;
}) => {
  const [theme, setTheme] = useState<EditorThemeClasses>();

  /**
   * The visual editor is rendered after the theme has successfully retrieved all of its styles/classNames
   */
  useEffect(() => {
    setTheme({
      paragraph: getClassName(Text),
      quote: getClassName(Quote),
      heading: {
        h1: getClassName(Heading1),
        h2: getClassName(Heading2),
        h3: getClassName(Heading3)
      },
      list: {
        nested: {
          listitem: getClassName(ListItem)
        },
        ol: getClassName(OrderedList),
        ul: getClassName(UnorderedList),
        listitem: getClassName(ListItem)
      },
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        strikethrough: 'editor-text-strikethrough',
        code: 'editor-text-code'
      },
      code: 'editor-code',
      codeHighlight: CODE_HIGHLIGHT_CLASSES
    });
  }, []);

  return (
    <>
      <GlobalLexicalThemeStyles />
      <PreloadedStyles>
        {Object.keys(styles).map((key) => {
          const Elem = styles[key];
          return <Elem key={`preloaded-lexical-theme-style-${key}`} />;
        })}
      </PreloadedStyles>
      {children(theme)}
    </>
  );
};

/**
 * Global editor styles that are not associated with Spectacle styled-components
 */
const GlobalLexicalThemeStyles = createGlobalStyle`
    .editor-text-bold {
        font-weight: bold;
    }

    .editor-text-italic {
        font-style: italic;
    }
    
    .editor-text-strikethrough {
        text-decoration: line-through;
    }

    .editor-text-code {
        font-family: monospace;
        overflow-wrap: break-word;
    }

    .editor-input {
        height: 100%;
        outline: none;
    }

    .editor-code {
      ${css(CODE_THEME['pre[class*="language-"]'])}
      display: block;
      font-size: 20px;
      margin: 0;
      padding: 16px;
    }  
  
    .editor-code:before {
      content: attr(data-gutter);
      float: left;
      padding-right: 10px;
    }

    ${Object.keys(CODE_HIGHLIGHT_CLASSES).map(
      (key) => `
      .${CODE_HIGHLIGHT_CLASSES[key]} {
        ${css(CODE_THEME[key])}
      }
    `
    )}
`;

const PreloadedStyles = styled.div`
  display: none;
`;
