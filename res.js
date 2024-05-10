let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;
const config = {
    iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
};

// Создаем WebSocket соединение
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = async message => {
    const data = JSON.parse(message.data);
    //console.log(message)
    await handleSignalingData(data);
};

async function start() {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    //localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);

    // Добавляем треки локального потока в peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    remoteVideo.srcObject = localStream
    // Устанавливаем удаленный поток, как только он приходит
    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };

    // Обработка кандидатов ICE
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            ws.send(JSON.stringify({'ice': event.candidate}));
        }
    };

    // Создаем предложение и отправляем его через WebSocket
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // console.log(offer)
    //ws.send(JSON.stringify({ type: 'offer', offer: offer }));
}

async function handleSignalingData(data) {
    await console.log(data)

    if (data.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        ws.send(JSON.stringify({'answer': answer}));
    } else if (data.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.ice) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
    }
}

// Вызываем start при загрузке страницы
start();
