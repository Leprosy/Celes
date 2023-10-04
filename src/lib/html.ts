const theme = {
  dark: {
    bg: '#121212',
    text: '#fff',
    a: '#66f',
    quote: '#222',
  },
  light: {
    bg: '#fff',
    text: '#000',
    a: '#00f',
    quote: '#ccc',
  },
};

export const htmlize = (content: string, isDarkTheme = false) => {
  const colors = isDarkTheme ? theme.dark : theme.light;
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
    body { font-size: 16px; color: ${colors.text}; background-color: ${colors.bg} } 
    p, li, blockquote, span { line-height: 25px }
    blockquote { border-left: 5px ${colors.quote} solid; margin-left: 10px; padding-left: 20px }
    span, a { display: inline-block }
    a { color: ${colors.a}}
    li { margin-bottom: 5px }
    h1 { font-size: 22px }
    h2 { font-size: 20px }
    h3 { font-size: 18px }
    th, td { padding: 5px; border: 1px solid #ddd }
    table { border-spacing: unset }
    </style>
    <meta name="viewport" content="width=device-width">
  </head>
  <body>
  ${content}
  </body>
</html>
`;
};

export const getStartTpl = (isDarkTheme = false) => {
  return htmlize(
    `<H1>Hello there!</h1>
    <h3>This is Celestino, an experimental article reader. Enter a URL or a search string to start!</h3>
    <img src="https://l3pro.netlify.app/html_test/celes.jpeg" width="200" style="display:block;margin-left:auto;margin-right:auto" />`,
    isDarkTheme,
  );
};

export const getLoadingTpl = (isDarkTheme = false) => {
  return htmlize('<h3>Loading...</h3>', isDarkTheme);
};

export const getErrorTpl = (error: string, isDarkTheme = false) => {
  return htmlize(`<h3>Oops :(</h3><p>${error}</p>`, isDarkTheme);
};
