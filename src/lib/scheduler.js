import BeatClock from './beatclock';
import context from './audio/context';
import audioGraph from './audio-graph';

import {
  addPlaying,
  addScheduled,
  scheduleStop,
  mediaEnded,
  flushScheduled,
  playingId,
  isPlaying
} from '../data/scheduler';

import {
  AUDIO_BEHAVIOR_SINGLE,
  AUDIO_BEHAVIOR_SCHEDULABLE,
  CLIP_TYPE_AUDIO_AND_VIDEO,
  CLIP_TYPE_AUDIO_SAMPLE,
  CLIP_TYPE_VIDEO
} from '../data/clips';

export default {
  store: null,
  beatClock: null,

  init(storeObject) {
    const { settings: { bpm }} = storeObject.getState();
    this.store = storeObject;
    this.beatClock = new BeatClock();
    this.beatClock.on('bar', this.onBar.bind(this));
    this.beatClock.setBpm(bpm);
    this.beatClock.start();

    this.handleManualSchedule = this.handleManualSchedule.bind(this);
    this.scheduleRow = this.scheduleRow.bind(this);

    this.previouseBpm = bpm;
    this.store.subscribe(() => {
      const newBpm = storeObject.getState().settings.bpm;
      if (newBpm !== this.previouseBpm) {
        this.beatClock.setBpm(newBpm);
        this.previouseBpm = newBpm;
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        this.handleManualStop();
      }
    });
  },

  onBar() {
    const { clips, fileLoader, scheduler: { scheduled, toStop } } = this.store.getState();

    Object.keys(scheduled).forEach((clipId) => {
      const clip = clips[clipId];
      const buffer = fileLoader[clip.file];

      // file has not loaded
      if (!buffer) { return false; }

      switch (clip.type) {
        case CLIP_TYPE_AUDIO_SAMPLE:
          return this.playAudioNode(clip);
        case CLIP_TYPE_VIDEO:
          return this.playVideo(clip);
        case CLIP_TYPE_AUDIO_AND_VIDEO:
          this.playAudioNode(clip);
          this.playVideo(clip);
          return;
        default:
          return;
      }

    });

    Object.keys(toStop).forEach((clipId) => {
      const clip = clips[clipId];
      this.stopClip(clip);
    });

    this.store.dispatch(flushScheduled());
  },

  stopClip(clip) {
    switch (clip.type) {
      case CLIP_TYPE_AUDIO_SAMPLE:
        return this.stopAudioNode(clip);
      case CLIP_TYPE_VIDEO:
        return this.stopVideo(clip);
      case CLIP_TYPE_AUDIO_AND_VIDEO:
        this.stopVideo(clip);
        this.stopAudioNode(clip);
        return;
      default:
        return;
    }
  },

  handleManualSchedule(clipId, pad, x, y) {
    if (clipId) {
      this.handleClip(clipId);
    } else {
      // schedule a stop of all clips in the column
      this.stopVerticalClipsFromPosition(undefined, { pad, x }, 'schedule');
    }
  },

  handleManualStop() {
    const { clips, scheduler: { scheduled, playing } } = this.store.getState();
    Object.keys(scheduled).forEach((clipId) => this.store.dispatch(scheduleStop(clipId)));
    Object.keys(playing).forEach((playingId) => this.stopClip(clips[playing[playingId].clipId]));
  },

  handleClip(clipId) {
    const { clips, scheduler: { scheduled, playing } } = this.store.getState();
    const clip = clips[clipId];
    const { behavior, id, loop } = clip;
    const clipIsPlaying = isPlaying(playing, clip);
    const isScheduled = scheduled[id];

    if (clip.type === CLIP_TYPE_AUDIO_SAMPLE) {
      // immediately play / stop the audio node
      if (behavior === AUDIO_BEHAVIOR_SINGLE) {
        if (!clipIsPlaying) {
          this.playAudioNode(clip);
        } else {
          if (loop) {
            this.stopAudioNode(clip);
          } else {
            this.stopAudioNode(clip);
            this.playAudioNode(clip);
          }
        }
      } else if (behavior === AUDIO_BEHAVIOR_SCHEDULABLE) {
        // trigger a play or a stop
        if (clipIsPlaying) {
          this.scheduleStopClip(id);
        } else {
          if (!isScheduled) {
            this.scheduleClip(id);
          }
        }
      }
    } else if (clip.type === CLIP_TYPE_AUDIO_AND_VIDEO) {
      // trigger a play or a stop
      if (clipIsPlaying) {
        this.scheduleStopClip(id);
      } else {
        if (!isScheduled) {
          this.scheduleClip(id);
        }
      }
    } else if (clip.type === CLIP_TYPE_VIDEO) {
      if (!clipIsPlaying) {
        this.playVideo(clip);
      } else {
        this.stopVideo(clip);
        this.playVideo(clip);
      }
    }
  },

  scheduleRow(pad, rowY) {
    const rowClipIds = pad.clips[rowY];
    const { scheduler: { playing } } = this.store.getState();

    // remove all scheduled clips
    this.store.dispatch(flushScheduled());

    // schedule a stop of all playing clips
    Object
      .keys(playing)
      .forEach((playingFileId) => {
        const { clipId } = playing[playingFileId];
          this.scheduleStopClip(clipId);
        }
      );

    if (rowClipIds) {
      rowClipIds.forEach((clipId, x) => {
        this.stopVerticalClipsFromPosition(clipId, { pad, x }, 'schedule');
        if (clipId) {
          this.handleClip(clipId);
        }
      });
    }
  },

  scheduleClip(id) {
    this.store.dispatch(addScheduled(id));
  },

  scheduleStopClip(id) {
    this.store.dispatch(scheduleStop(id));
  },

  playAudioNode(clip = {}) {
    const { file, loop, gain, id, track } = clip;
    const { fileLoader } = this.store.getState();
    const buffer = fileLoader[file];
    const tracks = audioGraph.getTracks();
    const trackNode = tracks[track] || tracks['master'];

    // file has not loaded
    if (!buffer) { return false; }

    // stop all clips that are on the same vertical axis as this track
    const position = this.getPadPosition(id);
    this.stopVerticalClipsFromPosition(id, position);

    const audioNode = context.createBufferSource();
    const gainNode = context.createGain();
    audioNode.buffer = buffer;
    audioNode.loop = loop;
    gainNode.gain.value = gain;
    audioNode.connect(gainNode);
    gainNode.connect(trackNode);
    audioNode.start();
    audioNode.onended = () => this.stopAudioNode(clip);
    this.store.dispatch(addPlaying(file, audioNode, id));
  },

  stopAudioNode({ id, file }) {
    const { scheduler: { playing } } = this.store.getState();
    const playingObj = playing[playingId(id, file)]
    const audioNode = playingObj && playingObj.payload
    safeAudioStop(audioNode);
    this.store.dispatch(mediaEnded(file, id));
  },

  playVideo(clip) {
    const { videoFile, loop, id } = clip;
    const { fileLoader } = this.store.getState();
    const videoElement = fileLoader[videoFile];
    // TODO: router audio through web audio graph -> const trackNode = tracks[track] || tracks['master'];

    // file has not loaded
    if (!videoElement) { return false; }

    videoElement.loop = loop;
    videoElement.pause();
    videoElement.play();
    videoElement.onended = () => this.stopVideo(clip);

    this.store.dispatch(addPlaying(videoFile, {videoElement}, id));
  },

  stopVideo({ videoFile, id }) {
    const { fileLoader } = this.store.getState();
    const videoElement = fileLoader[videoFile];

    videoElement.pause();
    videoElement.onended = null;
    videoElement.currentTime = 0;
    this.store.dispatch(mediaEnded(videoFile, id))
  },

  getPadPosition(id) {
    const { pads } = this.store.getState();
    let position = null;
    Object.keys(pads).some((padId) =>
      pads[padId].clips.some((row) => {
        const x = row.indexOf(id);
        if (x !== -1) {
          position = {
            pad: pads[padId],
            x
          };
          return true;
        }
        return false;
      })
    );
    return position;
  },

  getVerticalClipsFromPosition(position, clipId) {
    if (!position) { return []; }
    return position.pad.clips
      .map((row) =>
        row
          .map((currId, x) => x === position.x && clipId !== currId ? currId : undefined)
          .filter(Boolean)
      )
      .map((rowMatches) => rowMatches.length ? rowMatches[0] : undefined)
      .filter(Boolean);
  },

  stopVerticalClipsFromPosition(clipId, position, mode) {
    const { clips, scheduler: { playing } } = this.store.getState();
    const verticalClips = this.getVerticalClipsFromPosition(position, clipId);
    // stop all playing clips from the same vertical position
    Object
      .keys(playing)
      .forEach((playingFileId) => {
        const { clipId } = playing[playingFileId];
        if (verticalClips.indexOf(clipId) !== -1) {
          if (mode === 'schedule') {
            this.scheduleStopClip(clipId);
          } else {
            const clip = clips[clipId];
            this.stopClip(clip);
          }
        }
      });
  }

};

function safeAudioStop(audioNode) {
  try {
    audioNode.stop();
    audioNode.disconnect();
  } catch(e) {}
}
