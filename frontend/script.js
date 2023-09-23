async function typeMessage(message, element) {
    return new Promise((resolve) => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                if (message[index] === '<') {
                    // Find the closing '>'
                    const closingTagIndex = message.indexOf('>', index);
                    if (closingTagIndex === -1) {
                        clearInterval(typingInterval);
                        throw new Error('Invalid HTML provided');
                    }

                    const htmlTag = message.substring(index, closingTagIndex + 1);
                    const tagElement = document.createElement('span');
                    tagElement.innerHTML = htmlTag;
                    element.appendChild(tagElement);
                    index = closingTagIndex + 1;
                } else {
                    const char = message[index];
                    const charElement = document.createElement('span');
                    charElement.textContent = char;
                    element.appendChild(charElement);
                    index++;
                }
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
    const userInputValue = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');
    const sendButton = document.querySelector('button');

    const isMobile = window.innerWidth <= 800; // 800px 이하의 너비를 가진 디바이스를 모바일로 가정합니다.
    const baseURL = isMobile ? 
    'https://port-0-chatgpt-iciy2almvw8tfs.sel5.cloudtype.app/fortuneTell' : 
    'http://localhost:3000/fortuneTell';


    if (!userInputValue.trim()) {
        alert('메시지를 입력해주세요.');
        return;
    }

    // 사용자의 질문을 추가하고 입력란과 버튼을 비활성화합니다.
    chatBox.innerHTML += `<div class="user-message">${userInputValue}</div>`;
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').disabled = true;  // 입력란 비활성화
    sendButton.disabled = true;  // 버튼 비활성화

    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInputValue })
        });

        const data = await response.json();

        const replyDiv = document.createElement('div');
        replyDiv.classList.add('jubis-message');
        chatBox.appendChild(replyDiv);

        // "주비스:" 라는 부분에 따로 스타일을 적용하기 위해 span 태그를 추가합니다.
        await typeMessage(`${data.assistant || "죄송합니다. 문제가 발생했습니다. 다시 시도해주세요."}`, replyDiv);

        // 메시지가 타이핑되면 채팅창을 스크롤하여 최근 메시지가 보이도록 합니다.
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        const replyDiv = document.createElement('div');
        replyDiv.classList.add('jubis-message');
        chatBox.appendChild(replyDiv);

        await typeMessage("<span class='jubis-label'>주비스:</span> 오류가 발생했습니다. 다시 시도해주세요.", replyDiv);
        console.error(error);
    } finally {
        document.getElementById('user-input').disabled = false;  // 입력란 활성화
        sendButton.disabled = false;  // 버튼 활성화
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user-input').focus();
});
