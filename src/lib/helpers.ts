export const removeEnd = (txt: string, char: string, replacement = '') => {
  if (txt.endsWith(char)) {
    const reg = new RegExp(`${char}+$`);
    return txt.replace(reg, replacement);
  }

  return txt;
};

export const removeStart = (txt: string, char: string, replacement = '') => {
  if (txt.startsWith(char)) {
    const reg = new RegExp(`^${char}+`);
    return txt.replace(reg, replacement);
  }

  return txt;
};
