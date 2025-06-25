// --- Global Elements ---
const sendButton = document.getElementById('send-button');
const inputBox = document.getElementById('user-input');
const outputBox = document.getElementById('chat-messages');
const charCounter = document.getElementById('char-counter');
const copyButton = document.getElementById('copy-button');
const modeButtons = document.querySelectorAll('.mode-button');

const backendBaseUrl = 'https://your-render-url-here.onrender.com';

let selectedMode = 'mood'; 

inputBox.addEventListener('input', () => {
    const len = inputBox.value.length;
    charCounter.textContent = `${len}/200`;
    if (len > 200) {
        inputBox.value = inputBox.value.substring(0, 200);
        charCounter.textContent = `200/200`;
    }
});

function displayMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message-bubble', sender);
    msg.textContent = text;
    outputBox.appendChild(msg);
    outputBox.scrollTop = outputBox.scrollHeight;
}

sendButton.addEventListener('click', async () => {
    const text = inputBox.value.trim();
    if (!text) return;

    displayMessage(text, 'user');
    inputBox.value = '';
    charCounter.textContent = `0/200`;

    displayMessage("Loading...", 'bot');

    let endpoint = '';
    if (selectedMode === 'mood') endpoint = '/analyze-mood';
    else if (selectedMode === 'crisis') endpoint = '/detect-crisis';
    else if (selectedMode === 'summary') endpoint = '/summarize';

    try {
        const response = await fetch(`${backendBaseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();

        outputBox.lastChild.remove(); 
        
        if (selectedMode === 'mood') displayMessage(`Detected Emotion: ${data.emotion}`, 'bot');
        else if (selectedMode === 'crisis') displayMessage(`Crisis Detected: ${data.crisis_detected}`, 'bot');
        else if (selectedMode === 'summary') displayMessage(`Summary: ${data.summary}`, 'bot');
    } catch (err) {
        outputBox.lastChild.remove();
        displayMessage('Error fetching response.', 'bot');
    }
});

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedMode = btn.dataset.mode;
        modeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        outputBox.innerHTML = '';
        displayMessage(`Mode changed to ${btn.textContent}`, 'bot');
    });
});
