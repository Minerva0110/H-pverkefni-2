/**
 * Býr til element með nafni og bætir við öðrum elementum eða texta nóðum.
 * @param {string} name Nafn á elementi
 * @param {object} attributes Eiginleikar á elementi, strengir eða föll.
 * @param  {...string | HTMLElement} children Hugsanleg börn: önnur element eða strengir
 * @returns {HTMLElement} Elementi með gefnum börnum
 */
export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
  }
  children.forEach(child => {
      if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
      } else {
          element.appendChild(child);
      }
  });
  return element;
}
