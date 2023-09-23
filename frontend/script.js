async function typeMessage(message, element) {
    return new Promise((resolve) => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                const char = message[index];
                const charElement = document.createElement('span');
                charElement.textContent = char; // innerHTML 대신 textContent를 사용합니다.
                element.appendChild(charElement);
                index++;
            } else {
                clearInterval(typingInterval);
                resolve();
            }
        }, 50);
    });
}

const userInput = document.getElementById('user-input');
userInput.setAttribute('lang', 'ko');

async function getFortune() {
    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');
    const sendButton = document.querySelector('button');

    if (!userInput.trim()) {
        alert('메시지를 입력해주세요.');
        return;
    }

    // 사용자의 질문을 추가합니다.
    chatBox.innerHTML += `<div class="user-message">${userInput}</div>`;

    document.getElementById('user-input').disabled = true;
    sendButton.disabled = true;

    const replyDiv = document.createElement('div');
    replyDiv.classList.add('jubis-message');
    chatBox.appendChild(replyDiv);

    try {
        const response = await fetch('http://localhost:3000/fortuneTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();

        // 타이핑 애니메이션을 실행합니다.
        await typeMessage(`주비스: ${data.assistant || "죄송합니다. 문제가 발생했습니다. 다시 시도해주세요."}`, replyDiv);

        // 메시지가 타이핑되면 채팅창을 스크롤하여 최근 메시지가 보이도록 합니다.
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        await typeMessage("주비스: 오류가 발생했습니다. 다시 시도해주세요.", replyDiv);
        console.error(error);
    } finally {
        document.getElementById('user-input').disabled = false;
        sendButton.disabled = false;
    }
}
