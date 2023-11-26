(function(d, t, userId) {
        var BASE_URL = 'https://whatsapp-bot-go3u.onrender.com';

        const BOT_WAITING = `Bot is processing your request. Please wait...`;
        var g = d.createElement(t),
            s = d.getElementsByTagName(t)[0];
        g.src = BASE_URL + '/socket.io/socket.io.js';
        g.defer = true;
        g.async = true;
        s.parentNode.insertBefore(g, s);

        var isToggle = false;
        g.onload = function() {
                var socket = io(BASE_URL);

                var chatContainer = document.createElement('div');
                chatContainer.innerHTML = `
          <div class="body">
            <button class="chatbot-toggler" onclick="handleToggle()">
              <span class="toggle-icon">${isToggle ? '❌' : '<i class="bi bi-chat-fill"></i>'}</span>
              <span class="material-symbols-outlined">close</span>
            </button>
            <div id="chat-container" class=${isToggle ? 'chatbot show-chatbot' : 'chatbot'}>
              <header>
                <h2>JerryBot</h2>
                <span class="close-btn material-symbols-outlined" onclick="handleToggle()">
                  close
                </span>
              </header>
              <ul class="chatbox" id="messages"></ul>
              <div class="chat-input">
              <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
                <span id="send-btn" class="material-symbols-rounded">send</span>
              </div>
            </div>
          </div>
      `;

                console.log(isToggle);
                var toggleChatButton = document.createElement('button');
                document.body.appendChild(toggleChatButton);
                document.body.appendChild(chatContainer);

                // Code to handle user input and display messages
                const chatbox = document.querySelector('.chatbox');
                const chatInput = document.querySelector('.chat-input textarea');
                const sendChatBtn = document.querySelector('.chat-input span');
                const inputInitHeight = chatInput.scrollHeight;

                window.handleToggle = function() {
                    const chatContainer = document.getElementById('chat-container');
                    if (!chatContainer) {
                        console.error('Chat container not found');
                        return;
                    }
                    const isChatVisible = chatContainer.classList.contains('show-chatbot');
                    if (isChatVisible) {
                        chatContainer.classList.remove('show-chatbot');
                        isToggle = false;
                    } else {
                        chatContainer.classList.add('show-chatbot');
                        isToggle = true;
                    }
                };

                function handleChat() {
                    const message = chatInput.value.trim();
                    if (message !== '') {
                        const newMessage = {
                            user: '',
                            message: message,
                            isOwnMsg: true,
                        };

                        chatInput.style.height = `${inputInitHeight}px`;
                        chatbox.appendChild(createChatLi(message, 'outgoing'));
                        chatbox.scrollTo(0, chatbox.scrollHeight);
                        setTimeout(() => {
                            chatbox.scrollTo(0, chatbox.scrollHeight);
                        }, 0);
                        socket.emit('sendMessage', newMessage);
                        chatInput.value = '';


                        setTimeout(() => {
                            chatbox.appendChild(createChatLi("BOT_WAITING", 'incoming'));
                        }, 1000);


                    }

                    return false;
                }

                sendChatBtn.addEventListener('click', handleChat);

                chatInput.addEventListener('input', () => {
                    chatInput.style.height = `${inputInitHeight}px`;
                    chatInput.style.height = `${chatInput.scrollHeight}px`;
                });

                chatInput.addEventListener('keydown', e => {
                    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
                        e.preventDefault();
                        handleChat();
                    }
                });

                const createChatLi = (message, className) => {
                        const chatLi = document.createElement('li');
                        chatLi.classList.add('chat', `${className}`);
                        let chatContent =
                            className === 'outgoing' ?
                            `<p></p>` :
                            `<span class="material-symbols-outlined"><i class="bi bi-person-circle"></i></span>
          <p '${message === `${BOT_WAITING}` ? 'big-success' : ''}'></p>`;
      chatLi.innerHTML = chatContent;
      chatLi.querySelector('p').textContent = message;
      return chatLi;
    };

    socket.on('chat-message', function (msg) {
      chatbox.appendChild(createChatLi(msg.message, 'incoming'));

      const waitPlsLi = Array.from(chatbox.querySelectorAll('li.incoming')).find(li =>
        li.textContent.includes("BOT_WAITING"),
    );
    if (waitPlsLi) {
        console.log('Yes');
        waitPlsLi.remove();
    }

      chatbox.scrollTo(0, chatbox.scrollHeight);

      setTimeout(() => {
        chatbox.scrollTo(0, chatbox.scrollHeight);
      }, 0);
    });

    socket.emit('setUserId', userId);
  };
})(document, 'script', 'uniqueUserId');