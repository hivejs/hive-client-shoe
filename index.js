var reconnect = require('shoe-bin')
  , dataplex = require('dataplex')

module.exports = function(baseURL, access_token, cb) {
  var plex = dataplex()
    , stream = shoe(baseURL+'/socket')
  stream.pipe(plex).pipe(stream)

  var authStream = plex.open('/authenticate')
  authStream.write(access_token)
  authStream.once('data', function(chunk){
    try {
      cb(null, JSON.parse(chunk))
    }catch(e){
      cb(new Error('Authentication failed'))
    }
  })
  return plex
}
