export function fixedHeight(el) {
  let style = el.getAttribute('style');
  el.setAttribute('style', `${style ? style : ''}; height: ${el.offsetHeight}px !important`)
}