(function(d, t, userId) {
    var BASE_URL = "https://whatsapp-bot-go3u.onrender.com";
    var isToggle = false;
    const BOT_WAITING = `Bot is processing your request. Please wait...`
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL + "/socket.io/socket.io.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function() {
        var socket = io(BASE_URL);

        var chatContainer = document.createElement('div');
        chatContainer.innerHTML = `
          <div class="body">
            <button class="chatbot-toggler" onclick="handleToggle()">
              <span class="toggle-icon">${isToggle ? '❌' : '💬'}</span>
              <span class="material-symbols-outlined">close</span>
            </button>
            <div id="chat-container" class=${isToggle ? 'chatbot show-chatbot' : 'chatbot'}>
              <header>
                <h2>Chatbot</h2>
                <span class="close-btn material-symbols-outlined" onclick="handleToggle()">
                  close
                </span>
              </header>
              <ul class="chatbox" id="messages"></ul>
              <div class="chat-input">
              <form id="form" action="">
              <input id="m" autocomplete="off" />
              <button onclick="handleSendMessage()">Send</button>
            </form>
              </div>
            </div>
          </div>
      `;
        var toggleChatButton = document.createElement('button');
        document.body.appendChild(toggleChatButton);
        document.body.appendChild(chatContainer);

        // Code to handle user input and display messages
        const form = document.getElementById('form');
        const input = document.getElementById('m');
        const messages = document.getElementById('messages');

        window.handleToggle = function() {
            const chatContainer = document.getElementById('chat-container');
            if (!chatContainer) {
                console.error("Chat container not found");
                return;
            }

            const isChatVisible = chatContainer.classList.contains('show-chatbot');

            if (isChatVisible) {
                chatContainer.classList.remove('show-chatbot');
            } else {
                chatContainer.classList.add('show-chatbot');

            }
        };

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = input.value.trim();

            if (message !== '') {
                const newMessage = {
                    user: '',
                    message: message,
                    isOwnMsg: true,
                };
                socket.emit('sendMessage', newMessage);
                input.value = '';
            }

            return false;
        });

        socket.on('chat-message', function(msg) {
            console.log(msg);
            const li = document.createElement('li');
            li.className = `${msg.isOwnMsg ? 'chat outgoing' : 'chat incoming'}`;

            const p = document.createElement('p');
            p.className = msg.message === BOT_WAITING ? "bg-success text-white" : "";

            p.appendChild(document.createTextNode(msg.message));

            li.appendChild(p);
            messages.appendChild(li);
        });


        socket.emit('setUserId', userId);


    };
})(document, "script", "uniqueUserId");