import React from 'react';
import Pixel from './pixel';
import './field.css';

export default ({ field }) =>
  <div className="field">
    { [...Array(field.height)].map((_, y) =>
      <div className="field__row" key={`field-row-${y}`}>
        { [...Array(field.width)].map((_, x) => renderPixel(x, y, field)) }
      </div>
    )}
  </div>
;

function renderPixel(x, y, field) {
  const row = field.pixelArrangement[y];
  const pixelId = row ? row[x] : undefined;
  const isEmpty = !pixelId;
  const key = `field-pixel-${x}-${y}`;
  if (isEmpty) { return <Pixel key={key} />; }

  const pixel = field.pixels[pixelId];
  return <Pixel key={key} pixel={pixel} onClick={ () => onPixelClick(x, y, pixel)} />
}

function onPixelClick(x, y, pixel) {
  console.log('clicked', x, y, pixel);
}
