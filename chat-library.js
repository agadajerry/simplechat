const socket = io();

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const message = document.getElementById('m').value;
    socket.emit('chat message', message);
    document.getElementById('m').value = '';
    return false;
});

socket.on('chat message', function(msg) {
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(msg));
    messages.appendChild(li);
});