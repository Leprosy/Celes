export const URLFetch = async (url: string) => {
  try {
    const res = await fetch(url);
    const txt = await res.text();

    return txt;
  } catch (err) {
    console.error('URLFetch: error', err);
    throw err;
  }
};
