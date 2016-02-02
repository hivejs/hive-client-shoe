var shoe = require('shoe2')
  , dataplex = require('dataplex')
  , buildReconnect = require('reconnect-core')

var reconnect = buildReconnect(shoe)

module.exports = function(baseURL, access_token) {
  var plex = dataplex()

  return new Promise(function(resolve, reject) {
    var reconnector = reconnect({
      maxDelay: 30e3,
      type: 'fibonacci',
      immediate: false
    })
    .on('connect', function (stream) {
      stream.pipe(plex).pipe(stream)
      // Don't pass through the `end`!
      var listeners = stream.listeners('end')
      stream.removeListener('end', listeners[listeners.length-1])
      // clean up on end
      stream.on('end', () => {
        stream.unpipe()
        plex.unpipe(stream)
      })
      
      authenticate(er => {
        if(er) return reject(er)
        resolve(plex)
        plex.emit('connect')
      })
    })
    .on('disconnect', function (err) {
      plex.emit('disconnect')
    })
    .on('fail', function() {
      console.log('reconnect FAIL')
    })
    .on('error', function (err) {
      reject(err)
      setTimeout(() => {throw err}, 0)
    })

    reconnector.connect(baseURL+'/socket')
  })

  function authenticate(cb) {
    var authStream = plex.open('/authenticate')
    authStream.once('data', function(chunk){
      try {
        var auth = JSON.parse(chunk).authenticated
        if(auth) {
          cb()
        }else {
          cb(new Error('Authentication failed'))
        }
      }catch(e){
        cb(new Error('Authentication failed due to a connection problem'))
      }
    })
    authStream.write(access_token)
  }
}
