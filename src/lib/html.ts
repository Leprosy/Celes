//const celes = require('../assets/img/celes.png');

export const htmlize = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
    body { font-size: 16px } 
    p, li, span { line-height: 25px }
    span, a { display: inline-block }
    li { margin-bottom: 5px }
    h1 { font-size: 22px }
    h2 { font-size: 20px }
    h3 { font-size: 18px }
    </style>
    <meta name="viewport" content="width=device-width">
  </head>
  <body>
  ${content}
  </body>
</html>
`;

export const getStartTpl = () => {
  return htmlize(`<H1>Hello there!</h1>
    <h3>This is Celestino, an experimental article reader. Enter a URL or a search string to start!</h3>
    <img src="https://l3pro.netlify.app/html_test/celes.jpeg" width="200" style="display:block;margin-left:auto;margin-right:auto" />`);
};

export const getLoadingTpl = () => {
  return htmlize('<h1>Loading...</h1>');
};

export const getErrorTpl = (error: string) => {
  return htmlize(`<h1>Oops :(</h1><p>${error}</p>`);
};
