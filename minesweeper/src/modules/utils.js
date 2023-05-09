export function convertTextToId(text) {
  return text.toLowerCase().split(' ').join('-');
}

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
