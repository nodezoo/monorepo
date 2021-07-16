const ChangesStream = require('changes-stream')

const db = 'https://replicate.npmjs.com'

var changes = new ChangesStream({
  db: db,
  since: 'now',
})

changes.on('data', function(change) {
  console.log(change)
  // seneca.act('...need:info...')
})

