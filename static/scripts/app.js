class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            inputField: document.querySelector('#chat-input'),
            languageSelect: document.querySelector('#language-select')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton, inputField } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        inputField.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        chatbox.classList.toggle('chatbox--active', this.state);
    }

    onSendButton(chatbox) {
        const { inputField, languageSelect } = this.args;
        const userMessage = inputField.value.trim();

        if (userMessage === "") return;

        // Push user message
        this.messages.push({ name: "User", message: userMessage });
        this.updateChatText(chatbox);

        fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                lang: languageSelect.value
            }),
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            const botReply = data.reply || "Sorry, I didn't understand that.";
            this.messages.push({ name: "Bot", message: botReply });
            this.updateChatText(chatbox);
            inputField.value = '';
        })
        .catch(error => {
            console.error("Chat error:", error);
            this.messages.push({ name: "Bot", message: "Sorry, something went wrong." });
            this.updateChatText(chatbox);
            inputField.value = '';
        });
    }

    updateChatText(chatbox) {
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = this.messages.slice().reverse().map(item => {
            const className = item.name === "Bot"
                ? "messages__item messages__item--visitor"
                : "messages__item messages__item--operator";
            return `<div class="${className}">${item.message}</div>`;
        }).join('');

        // Scroll to bottom
        chatmessage.scrollTop = chatmessage.scrollHeight;
    }
}

const chatbox = new Chatbox();
chatbox.display();
