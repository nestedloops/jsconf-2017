export default {
  settings: {
    gain: 1,
    bpm: 100
  },
  pads: {
    pad1: {
      buttons: [
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
      selectedButtonId: '2316526c-ec07-4153-a47a-d831b2aaf18e'
    }
  },
  buttons: {
    '2316526c-ec07-4153-a47a-d831b2aaf18e': {
      id: '2316526c-ec07-4153-a47a-d831b2aaf18e',
      type: 'audiosample',
      behavior: 'schedulable',
      file: '2a86e9ee-b409-4e2b-91e0-bcc051ec2168',
      gain: 1,
      loop: false
    },
    '762e04a0-b651-4560-bad1-31011b7b27e5': {
      id: '762e04a0-b651-4560-bad1-31011b7b27e5',
      type: 'audiosample',
      behavior: 'single',
      file: '36c1262c-608c-41db-a12c-7a2fad9d4c14',
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
    // buttonId : fileId
    scheduled: {
      '762e04a0-b651-4560-bad1-31011b7b27e5': '2a86e9ee-b409-4e2b-91e0-bcc051ec2168'
    },
    // buttonId : audioNode
    playing: {},
    // buttonId : audioNode
    toStop: {}
  }
};
