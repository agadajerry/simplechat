(function(d, t, userId) {
    var BASE_URL = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"; // Replace with the actual URL of your Socket.IO server
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL;
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function() {
        var socket = io("https://whatsapp-bot-go3u.onrender.com");

        var chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.innerHTML = `
            <ul id="messages"></ul>
            <form id="form" action="">
                <input id="m" autocomplete="off" />
                <button>Send</button>
            </form>
        `;


        var toggleChatButton = document.createElement('button');
        toggleChatButton.id = 'toggleChat';
        toggleChatButton.textContent = 'Toggle Chat';

        document.body.appendChild(toggleChatButton);
        document.body.appendChild(chatContainer);

        // Code to handle user input and display messages
        const form = document.getElementById('form');
        const input = document.getElementById('m');
        const messages = document.getElementById('messages');

        toggleChatButton.addEventListener('click', function() {
            const isChatVisible = chatContainer.style.display !== 'none';

            // Toggle the visibility of the chat container
            chatContainer.style.display = isChatVisible ? 'none' : 'block';
        });


        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = input.value.trim();

            if (message !== '') {
                // Send the message to the server
                socket.emit('sendMessage', message);

                // Clear the input field
                input.value = '';
            }

            return false;
        });

        socket.on('chat-message', function(msg) {
            // Display incoming messages in the chat
            console.log(msg)
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(msg.message));
            messages.appendChild(li);
        });


        // Your additional code to interact with the socket and use the userId
        socket.emit('setUserId', userId);

        // Rest of your code remains the same...
    };

})(document, "script", "uniqueUserId");