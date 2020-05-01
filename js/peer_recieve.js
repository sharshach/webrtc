(function() {
    var peer = null
    var peerId = null
    var destId=null
    var conn = null
    var call=null
    var extraid="harsha"

const mediaStreamConstraints = {
  video: true,
  audio:true,
  noiseSuppression: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');
// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.


    function initialize() {
        peer = new Peer(
                {
                    host:"arteegee.herokuapp.com",
                    port:location.port || (location.protocol === 'https:' ? 443 : 80),
                    path: '/peerjs',
                    debug: 3
                }
            )
        peer.on('open', function(id) {
            peerId = id
            console.log(peerId)
        })
        peer.on('error', function(err) {
            alert(''+err)
        })
    }
    function run(){
        console.log("hi")
        conn.send("hi i am here")
        conn.on('close', function() {
            alert("connection closed")
            console.log("connection closed")
        })
        function gotLocalMediaStream(mediaStream) {
            localStream = mediaStream;
            call = peer.call(destId,localStream);
            call.on('stream', function(stream) {
                // `stream` is the MediaStream of the remote peer.
                // Here you'd add it to an HTML video/canvas element.
                localVideo.srcObject = stream;
            });
        }

        // Handles error by logging a message to the console with the error message.
        function handleLocalMediaStreamError(error) {
          console.log('navigator.getUserMedia error: ', error);
        }

        // Initializes media stream.
        navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
          .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);



    }
    function join() {
        initialize()
        peer.on('open', function() {
            destId = prompt("passcode:")
            destId=extraid+destId
            conn = peer.connect(destId, {
                reliable: true
            })
            conn.on('open', function() {
                console.log("connecting to ")
                console.log(destId)
                run()
            })
        })
    }
    join()
})()