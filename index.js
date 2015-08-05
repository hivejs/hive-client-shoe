var shoe = require('shoe-bin')
  , dataplex = require('dataplex')

module.exports = function(baseURL, access_token, cb) {
  var plex = dataplex()
    , stream = shoe(baseURL+'/socket')
  stream.pipe(plex).pipe(stream)

  var authStream = plex.open('/authenticate')
  authStream.once('data', function(chunk){
    try {
      cb(null, JSON.parse(chunk))
    }catch(e){
      cb(new Error('Authentication failed'))
    }
  })
  authStream.write(access_token)
  return plex
}
