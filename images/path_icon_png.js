/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
