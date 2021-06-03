import { Handler } from '@netlify/functions';

type ContentType = {
  props?: Record<string, any>;
  children?: ContentType[] | string | undefined;
  component: string;
};

const renderChildren = (
  content: ContentType['children']
): string | undefined => {
  if (Array.isArray(content)) {
    return `${content.reduce((sum, content) => {
      let props = '';

      if (content.props) {
        const propsFromJson = content.props;

        props = Object.keys(content.props).reduce((sum, propKey) => {
          if (typeof propsFromJson[propKey] === 'object') {
            return (
              sum + `${propKey}=\${${JSON.stringify(propsFromJson[propKey])}} `
            );
          } else if (typeof propsFromJson[propKey] === 'string') {
            return sum + `${propKey}="${propsFromJson[propKey]}" `;
          } else if (typeof propsFromJson[propKey] === 'number') {
            return sum + `${propKey}=\${${propsFromJson[propKey]}} `;
          }

          return '';
        }, ``);
      }

      return (
        sum +
        `<$\{${content.component}\} ${props} >${renderChildren(
          content.children
        )}</$\{${content.component}\}>`
      );
    }, ``)}`;
  } else if (typeof content === 'string') {
    return content;
  } else {
    return undefined;
  }
};

const createTemplate = (content: ContentType[]) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Spectacle One-Page Example</title>
  </head>
  <body>
    <div id="root"></div>

    <script src="https://unpkg.com/react@16.13.1/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/react-is@16.13.1/umd/react-is.production.min.js"></script>
    <script src="https://unpkg.com/prop-types@15.7.2/prop-types.min.js"></script>
    <script src="https://unpkg.com/spectacle@^8/dist/spectacle.min.js"></script>
    <!-- <script src="../dist/spectacle.js"></script> -->

    <script type="module">
      const {
        FlexBox,
        Heading,
        SpectacleLogo,
        UnorderedList,
        CodeSpan,
        OrderedList,
        ListItem,
        FullScreen,
        Progress,
        Appear,
        Slide,
        Deck,
        Text,
        Grid,
        Box,
        Image,
        CodePane,
        MarkdownSlide,
        MarkdownSlideSet,
        Notes,
        Markdown
      } = Spectacle;

      import htm from 'https://unpkg.com/htm@^3?module';
      const html = htm.bind(React.createElement);
      const formidableLogo = 'https://avatars2.githubusercontent.com/u/5078602?s=280&v=4';

      // SPECTACLE_CLI_THEME_START
      const theme = {
        fonts: {
          header: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
          text: '"Open Sans Condensed", Helvetica, Arial, sans-serif'
        }
      };
      // SPECTACLE_CLI_THEME_END

      // SPECTACLE_CLI_TEMPLATE_START
      const template = () => html\`
      <\${FlexBox} justifyContent="space-between" position="absolute" bottom=\${0} width=\${1}>
        <\${Box} padding="0 1em">
          <\${FullScreen} />
        </\${Box}>
        <$\{Box} padding="1em">
          <$\{Progress} />
        </$\{Box}>
      </$\{FlexBox}>
    \`;

      const Presentation = () => html\`<\${Deck} theme=\${theme} template=\${template}>${renderChildren(
        content
      )}</\${Deck}>\`
     
      ReactDOM.render(html\`<\${Presentation} />\`, document.getElementById('root'));
    </script>
  </body>
</html>`;

const handler: Handler = async (event) => {
  let deck: string;

  if (!event.body || (event.body && typeof event.body !== 'string')) {
    return {
      statusCode: 400,
      body: 'This method requires a json payload.'
    };
  }

  try {
    const slides = JSON.parse(event.body) as ContentType[];

    deck = createTemplate(slides);
  } catch {
    return {
      statusCode: 400,
      body: 'Invalid JSON payload.'
    };
  }

  return {
    statusCode: 200,
    body: deck,
    headers: {
      'content-type': 'text/html'
    }
  };
};

export { handler };
