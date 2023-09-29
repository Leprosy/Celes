const urlRegex =
  /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const httpRegex = /^https?:\/\//;

const getSecureUrl = (url: string) => {
  console.log('URL: securing', url);
  if (!httpRegex.test(url)) {
    url = `https://${url}`;
    console.log('URL: no http protocol. Added', url);
  }

  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
    console.log('URL: converted to https', url);
  }

  return url;
};

const getGoogleUrl = (url: string) => {
  url = encodeURI(url);
  console.log(
    'URL getting google search',
    `https://www.google.com/search?q=${url}`,
  );
  return `https://www.google.com/search?q=${url}`;
};

const getValidUrl = (url: string) => {
  console.log('URL: getting valid url info', url);

  if (urlRegex.test(url)) {
    console.log('URL: Valid, getting a secure url');
    return getSecureUrl(url);
  }

  const googleUrl = getGoogleUrl(url);
  console.log('URL: no valid URL, getting a google search instead', googleUrl);
  return googleUrl;
};

export const URLFetch = async (url: string) => {
  try {
    const finalUrl = getValidUrl(url);
    const res = await fetch(finalUrl);
    const txt = await res.text();

    // TODO: Return the right URL after redirections or other similar events
    return {txt, finalUrl};
  } catch (err) {
    console.error('URLFetch: error', err);
    throw err;
  }
};
