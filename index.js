var reconnect = require('shoe-bin')
  , dataplex = require('dataplex')

module.exports = function(baseURL, access_token) {
  var plex = dataplex()
    , stream = shoe(baseURL+'/socket')
  stream.pipe(plex).pipe(stream)

  var authStream = plex.open('/authenticate')
  authStream.write(access_token)
  return plex
}