const socket = io('/')
// peer 서버와 연결
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
})
// 연결된 유저 추적용 딕셔너리
const peers = {}

// 유저에서 비디오 스트리밍 가져옴
// 카메라 연결이 안 되어 있으면 에러 발생
const getUserVideoStream = () =>
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })

getUserVideoStream().then((myStream) => {
  const myVideo = document.createElement('video')
  myVideo.muted = true
  addVideoStream(myVideo, myStream)

  // p2p 연결 시 상대에게 비디오 스트림 전송
  myPeer.on('call', (call) => {
    call.answer(myStream)
    acceptVideoStream(call)
  })

  // 새로 연결된 유저에게 내 비디오 스트림을 보냄
  socket.on('user-connected', (userId) => connectToNewUser(userId, myStream))
})

// 유저 퇴장 시 연결 끊기
socket.on('user-disconnected', (userId) => {
  peers[userId]?.close() // 비디오 제거 훅 발생
  delete peers[userId]
})

// peerjs에서 발급 받은 아이디를 방에 전달
myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id)
})

// 비디오 요소에 스트림 추가 후 화면에 띄움
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => video.play())
  document.getElementById('video-grid').append(video)
}

function connectToNewUser(userId, myStream) {
  const call = myPeer.call(userId, myStream)
  acceptVideoStream(call)
}

// peer의 call에서 비디오 스트림을 받아서 화면에 띄웁니다.
function acceptVideoStream(call) {
  const video = document.createElement('video')
  call.on('stream', (stream) => addVideoStream(video, stream))
  call.on('close', () => video.remove())
  peers[call.peer] = call
}
