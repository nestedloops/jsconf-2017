import React from 'react';
import { shouldUpdate } from 'recompose';

const File = ({ file }) =>
  <div className="fileName" onClick={() => play(file.url)}>{file.name}</div>
;

export default shouldUpdate(
  (props, nextProps) => props.file !== nextProps.file
)(File);

function play(url) {
  console.log('play', 'isAudio?', isAudio(url), 'isVideo', isVideo(url));
}

const isAudioRegex = /(mp3|wav|ogg)/;
function isAudio(url) {
  return isAudioRegex.test(url);
}

const isVideoRegex = /(mp4|mpg)/;
function isVideo(url) {
  return isVideoRegex.test(url);
}
