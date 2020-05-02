(function() {
    var peer = null
    var peerId = null
    var conn = null
    var myname=null
    var passcode=null
    var oppname=null
    var extraid="harsha"

const mediaStreamConstraints = {
  video: true,
  audio: true,
  noiseSuppression: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');
// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.



    function initialize() {
        peer = new Peer(
            extraid+passcode,
            {
                host:"csh-peerjs-server.herokuapp.com",
                port:location.port || (location.protocol === 'https:' ? 443 : 80),
                debug: 3,
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
        conn.on('data', function(data) {
            console.log('Received', data);
        });
        conn.on('close', function() {
            
            alert("connection closed")
            console.log("connection closed")
        })
        peer.on('error', function(err) {
            alert(''+err)
            turn = false
        })
        peer.on('call', function(call) {
            function gotLocalMediaStream(mediaStream) {
                localStream = mediaStream;
                call.answer(localStream);
                call.on('stream', function(stream) {
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
        });
                 

    }
    function start() {
        passcode=prompt("passcode: (in small letters)")
        initialize()
        peer.on('open', function() {
            console.log("searching to connect"+peerId)
        })
        peer.on('connection', function(c) {
            if(conn) {
                c.close()
                return
            }
            conn = c
            console.log("connected")
            console.log(conn.id)
            run()
        })
    }
    start()
})()