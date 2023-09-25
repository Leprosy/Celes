import {parseHTML} from 'linkedom';
import {htmlize} from './html';

//const isHidden = el => el.offsetParent === null;
const cleanStyle = (elem: string) => elem.replace(/style="[^\"]*"/, '');

export const contentExtract = (html: string) => {
  try {
    const {document} = parseHTML(html);
    let content = '';

    document
      .querySelectorAll('h1, h2, h3, p, p ul, p+ul, img, a')
      .forEach((elem: any) => {
        const tagName = elem.tagName.toLowerCase();
        let adding = '';

        // TODO: text elements sometimes have innerTXT blank
        switch (tagName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'p':
            adding = `<${tagName}>${cleanStyle(elem.innerHTML)}</${tagName}>`;
            break;
          case 'img':
            adding = `<img src="${elem.src}" style="max-width: 100%" />`;
            break;
          case 'ul':
            adding = `<${tagName}>${cleanStyle(elem.innerHTML)}</${tagName}>`;
            break;
          //TODO: we need a heavy treatment for A HREFS
          case 'a':
            adding = `<p><a href="#" onClick="window.ReactNativeWebView.postMessage('${elem.href}')">${elem.innerText}</a></p>`;
            break;
        }

        console.log('New line', {
          tagName,
          adding: adding,
        });

        content += '\n' + adding;
      });

    return htmlize(content);
  } catch (err) {
    console.error('Extractor: error', err);
    throw err;
  }
};
