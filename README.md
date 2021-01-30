# Simple WebRTC Video Chat

- `socket.io`로 유저 간 연결
- `peer.js`로 P2P WebRTC 비디오 교환

## 실행

1. 서버 실행 (3000번 포트)

```
yarn start
```

2. PeerJS 서버 실행 (3001번 포트)

```
npx peer --port=3001
```

3. localhost:3000 접속

## 참고

[How To Create A Video Chat App With WebRTC](https://www.youtube.com/watch?v=DvlyzDZDEq4)
