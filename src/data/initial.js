export default {
  settings: {
    gain: 1,
    bpm: 100
  },
  tracks: {
    master: {
      name: 'master',
      id: 'master',
      gain: 1,
      filters: ['239786428374t928374628934728347']
    },
    secondChannel: {
      name: 'master2',
      id: 'secondChannel',
      gain: 1,
      filters: []
    }
  },
  filters: {
    '239786428374t928374628934728347': {
      type: 'lowpass'
    }
  },
  pads: {
    pad1: {
      clips: [
        [null,null,null,null,null,null,null,null],
        [
          '2316526c-ec07-4153-a47a-d831b2aaf18e',
          '762e04a0-b651-4560-bad1-31011b7b27e5',
          null, null, null, null, null, null
        ],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null]
      ],
      controller: '',
      selectedClipId: '2316526c-ec07-4153-a47a-d831b2aaf18e'
    },
    pad2: {
      clips: [
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [
          '2316526c-ec07-4153-a47a-d831b2aaf18e',
          '762e04a0-b651-4560-bad1-31011b7b27e5',
          null, null, null, null, null, null
        ],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null]
      ],
      controller: '',
      selectedClipId: '2316526c-ec07-4153-a47a-d831b2aaf18e'
    }
  },
  clips: {
    '2316526c-ec07-4153-a47a-d831b2aaf18e': {
      id: '2316526c-ec07-4153-a47a-d831b2aaf18e',
      type: 'audiosample',
      behavior: 'schedulable',
      file: '2a86e9ee-b409-4e2b-91e0-bcc051ec2168',
      track: 'master',
      gain: 1,
      loop: false
    },
    '762e04a0-b651-4560-bad1-31011b7b27e5': {
      id: '762e04a0-b651-4560-bad1-31011b7b27e5',
      type: 'audiosample',
      behavior: 'single',
      file: '36c1262c-608c-41db-a12c-7a2fad9d4c14',
      track: 'master',
      gain: 0.3,
      loop: false
    }
  },
  files: {
    '2a86e9ee-b409-4e2b-91e0-bcc051ec2168': {
      location: 'mysound.mp3',
      name: 'mysound'
    },
    '36c1262c-608c-41db-a12c-7a2fad9d4c14': {
      location: 'mysound2.mp3',
      name: 'mysound2'
    }
  },
  scheduler: {
    // clipId : fileId
    scheduled: {
      '762e04a0-b651-4560-bad1-31011b7b27e5': '2a86e9ee-b409-4e2b-91e0-bcc051ec2168'
    },
    // clipId : audioNode
    playing: {},
    // clipId : audioNode
    toStop: {}
  }
};
