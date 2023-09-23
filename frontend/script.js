async function getFortune() {
    try {
        const userInput = document.getElementById('user-input').value;

        if (!userInput.trim()) {
            alert('메시지를 입력해주세요.');
            return;
        }

        const chatBox = document.getElementById('chat-box');

        // User message display
        chatBox.innerHTML += `<div>User: ${userInput}</div>`;

        const response = await fetch('http://localhost:3000/fortuneTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });
        const data = await response.json();

            if(data && data.assistant) {
                chatBox.innerHTML += `<div>챗도지: ${data.assistant}</div>`;
            } else {
                chatBox.innerHTML += `<div>챗도지: 죄송합니다. 문제가 발생했습니다. 다시 시도해주세요.</div>`;
            }

         // Clear input after sending
        document.getElementById('user-input').value = '';

        // Scroll chat to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error(error);
    }
}