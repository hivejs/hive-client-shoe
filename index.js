var shoe = require('shoe-bin')
  , dataplex = require('dataplex')

module.exports = function(baseURL, access_token) {
  var plex = dataplex()
    , stream = shoe(baseURL+'/socket')
  stream.pipe(plex).pipe(stream)

  var authStream = plex.open('/authenticate')
  return new Promise(function(resolve, reject) {
    authStream.once('data', function(chunk){
      try {
        var auth = JSON.parse(chunk).authenticated
        if(auth) {
          resolve(plex)
        }else {
          reject(new Error('Authentication failed'))
        }
      }catch(e){
        reject(new Error('Authentication failed due to a connection problem'))
      }
    })
    authStream.write(access_token)
  })
}
