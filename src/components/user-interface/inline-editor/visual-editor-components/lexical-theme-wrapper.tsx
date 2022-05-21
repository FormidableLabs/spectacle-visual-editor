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
import styled, { StyledComponent, createGlobalStyle } from 'styled-components';

const Heading1 = styled(Heading).attrs({ fontSize: 'h1' })``;
const Heading2 = styled(Heading).attrs({ fontSize: 'h2' })``;
const Heading3 = styled(Heading).attrs({ fontSize: 'h3' })``;

const styles = [
  Text,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  ListItem,
  OrderedList,
  UnorderedList
];

const getClassName = (component: StyledComponent<any, any>) =>
  (component as any).componentStyle?.lastClassName;

export const LexicalThemeWrapper = ({
  children
}: {
  children: (theme?: EditorThemeClasses) => React.ReactNode;
}) => {
  const [theme, setTheme] = useState<EditorThemeClasses>();

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
      }
    });
  }, []);
  return (
    <>
      <GlobalLexicalThemeStyles />
      <PreloadedStyles>
        {styles.map((Elem, i) => (
          <Elem key={`preloaded-lexical-theme-styles-${i}`} />
        ))}
      </PreloadedStyles>
      {children(theme)}
    </>
  );
};

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
`;

const PreloadedStyles = styled.div`
  display: none;
`;
