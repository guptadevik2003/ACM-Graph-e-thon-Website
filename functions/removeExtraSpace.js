module.exports = (str) => {
  var newStr = new String(str).replace(/\s+/g, ' ').trim();
  return newStr;
}
