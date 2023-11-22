// chat-library.js

var SimpleChat = (function() {
    var chatOutput, messageInput;
    var userBackgroundColor = '#ffffff';

    function appendMessage(message) {
        var messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.style.backgroundColor = userBackgroundColor; // Set background color
        chatOutput.appendChild(messageElement);

        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    return {
        initialize: function(outputId, inputId) {
            chatOutput = document.getElementById(outputId);
            messageInput = document.getElementById(inputId);
        },

        setChatBackgroundColor: function(color) {
            userBackgroundColor = color;
        },

        sendMessage: function() {
            var message = messageInput.value;

            if (message.trim() !== "") {
                appendMessage("You: " + message);

                setTimeout(function() {
                    var response = "Bot: Thanks for your message!";
                    appendMessage(response);
                }, 500);

                messageInput.value = "";
            }
        },
    };
})();