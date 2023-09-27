import {parseHTML} from 'linkedom';
import {htmlize} from './html';

const keepAttributes = ['href', 'id', 'src'];
const contentTags = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'ul',
  'a',
  'img',
  'table',
  'span',
];

const getUrl = (path: string, base: string) => {
  if (!/^[https?:\/\/|data:]/.test(path)) {
    return `${base}/${path}`;
  }

  return path;
};

const cleanNode = (elem: any) => {
  const attrs = elem.getAttributeNames();

  attrs.forEach((attr: string) => {
    if (keepAttributes.indexOf(attr) < 0) {
      elem.removeAttribute(attr);
    }
  });

  if (elem.tagName === 'IMG') {
    console.log('IMG', elem.getAttribute('src'));
    elem.setAttribute('style', 'max-width: 100%');
  }

  if (elem.tagName === 'A') {
    const href = elem.getAttribute('href');
    elem.setAttribute('href', '#');
    elem.setAttribute(
      'onClick',
      'window.ReactNativeWebView.postMessage("' + href + '")',
    );
  }

  elem.children.forEach(child => cleanNode(child));
};

const checkNode = (root: any) => {
  //TODO: annotate root and elem types(using any for now)

  // Text node
  if (root.tagName === undefined) {
    return ''; // TODO: We want to skip this?
  }

  // Content node
  if (contentTags.indexOf(root.tagName.toLowerCase()) >= 0) {
    // console.log('Content', root.tagName, root.outerHTML);
    cleanNode(root);
    return root.outerHTML; // TODO: cleanup. Find a way to filter empty innerText without affecting IMGs
  }

  // Keep looking
  let content = '';

  root.childNodes.forEach((elem: any) => {
    content += checkNode(elem);
  });

  return content;
};

export const contentExtract = (html: string, url: string) => {
  try {
    const {document} = parseHTML(html);
    let content = checkNode(document.body);
    console.log('FInal content', htmlize(content));
    return htmlize(content);
  } catch (err) {
    console.error('Extractor: error', err);
    throw err;
  }
};
