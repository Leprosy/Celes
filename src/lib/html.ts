//const celes = require('../assets/img/celes.png');

export const htmlize = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
    body { font-size: 16px } 
    p, li { line-height: 25px }
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
  return htmlize("<H1>Enter a URL</H1><img src='./celes.png' />");
};

export const getLoadingTpl = () => {
  return htmlize('<h1>Loading...</h1>');
};

export const getErrorTpl = (error: string) => {
  return htmlize(`<h1>Oops :(</h1><p>${error}</p>`);
};
