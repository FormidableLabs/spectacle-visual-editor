import { Handler } from '@netlify/functions';

const createTemplate = (templateJson: string) => `<!DOCTYPE html>
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
        Notes
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
      

      const Presentation = () => html\`<div>noice</div>\`
     
      ReactDOM.render(html\`<\${Presentation}/>\`, document.getElementById('root'));
    </script>
  </body>
</html>`;

const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Body is required for this process.'
    };
  }

  const json = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: createTemplate(json)
  };
};

export { handler };
