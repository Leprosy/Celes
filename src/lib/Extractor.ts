import {parseHTML} from 'linkedom';
import {htmlize} from './html';
import {removeEnd, removeStart} from './helpers';
import {Element} from 'linkedom/types/interface/element';

const keepAttributes = ['href', 'id', 'src'];
const forbiddenTags = ['svg', 'script', 'nav'];
const allowedEmptyTags = ['img'];
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

const getBaseUrl = (path: string) => {
  let domain: any = path.replace(/^https?:\/\//, '').split('/');
  domain = domain[0];

  console.log('DOMAIN IS', path, `https://${domain}`);
  return `https://${domain}`;
};

const getUrl = (path: string, base: string) => {
  if (path.startsWith('//')) {
    path = 'https:' + path;
  }

  if (!/^(data|https?):\/\//.test(path)) {
    path = `${base}/${removeStart(removeEnd(path, '/'), '/')}`;
  }

  path = removeEnd(path, '/');
  return path;
};

const cleanNode = (elem: Element, baseUrl: string) => {
  // TODO: https://kotaku.com/cyberpunk-2077-update-2-0-patch-notes-skills-cyberware-1850861309 keeps getting empty <spans>
  if (
    elem.innerHTML === '' &&
    allowedEmptyTags.indexOf(elem.tagName.toLowerCase()) < 0
  ) {
    elem.remove();
  }

  if (forbiddenTags.indexOf(elem.tagName.toLowerCase()) >= 0) {
    elem.remove();
  }

  const attrs = elem.getAttributeNames();

  attrs.forEach((attr: string) => {
    if (keepAttributes.indexOf(attr) < 0) {
      elem.removeAttribute(attr);
    }
  });

  if (elem.tagName === 'IMG') {
    // TODO: get correct relative URLs (l3pro.netlify.app/html_test)
    console.log('IMG', elem.getAttribute('src'));
    const src = getUrl(elem.getAttribute('src'), baseUrl);
    console.log('IMG NOW', src);
    elem.setAttribute('style', 'max-width: 100%');
    elem.setAttribute('src', src);
  }

  if (elem.tagName === 'A') {
    console.log('A', elem, elem.getAttribute('href'));

    if (elem.getAttribute('href')) {
      const href = getUrl(elem.getAttribute('href'), baseUrl);
      console.log('A NOW', href);
      elem.setAttribute('href', '#');
      elem.setAttribute(
        'onClick',
        `window.ReactNativeWebView.postMessage('${href}')`,
      );
    }
  }

  elem.children.forEach(child => cleanNode(child, baseUrl));
};

const checkNode = (root: Element, baseUrl: string) => {
  // Text node
  if (root.tagName === undefined) {
    return ''; // TODO: We want to skip this?
  }

  // Content node
  if (contentTags.indexOf(root.tagName.toLowerCase()) >= 0) {
    // console.log('Content', root.tagName, root.outerHTML);
    cleanNode(root, baseUrl);
    return root.outerHTML; // TODO: cleanup. Find a way to filter empty innerText without affecting IMGs
  }

  // Keep looking
  let content = '';

  root.childNodes.forEach((elem: Element) => {
    content += checkNode(elem, baseUrl);
  });

  return content;
};

export const contentExtract = (
  html: string,
  url: string,
  isDarkTheme = false,
) => {
  try {
    const {document} = parseHTML(html);
    const baseUrl = getBaseUrl(url);
    let content = checkNode(document.body, baseUrl);
    console.log('FInal content', htmlize(content));
    return htmlize(content, isDarkTheme);
  } catch (err) {
    console.error('Extractor: error', err);
    throw err;
  }
};
