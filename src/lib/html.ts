export const htmlize = (content: string, isDarkTheme = false) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
    body { font-size: 16px; color: ${
      isDarkTheme ? '#fff' : '#000'
    }; background-color: ${isDarkTheme ? '#000' : '#fff'} } 
    p, li, span { line-height: 25px }
    span, a { display: inline-block }
    a { color: ${isDarkTheme ? '#66f' : '#00f'}}
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
