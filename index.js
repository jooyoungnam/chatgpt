const apiKey = "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";
const OpenAI = require('openai');
const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 'frontend' 폴더에 있는 정적 파일을 제공합니다.
app.use(express.static('frontend'));


const openai = new OpenAI({
    apiKey: apiKey,
});

app.post('/fortuneTell', async function (req, res) {
    // 사용자로부터의 질문을 받아옵니다.
    const userQuestion = req.body.message;

    // GPT-3에 전달할 메시지 배열을 구성합니다.
    const messages = [
        { role: "system", content: "당신은 세계 최고의 명문대 출신이고 아이큐가 200인 천재입니다. 모든 질문에 정확하게 답할 수 있습니다." },
        { role: "user", content: userQuestion }
    ];

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        // GPT-3의 응답을 추출합니다.
        let fortune = chatCompletion.choices[0].message.content;

        res.json({ "assistant": fortune });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/', (req, res) => {
    res.send("Welcome to ChatDoge!");
});


app.listen(3000);
