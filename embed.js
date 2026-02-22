// This is what your clients embed on their site
(function() {
    // Load configuration
    const config = window.ChatBotConfig || {};
    const clientId = config.clientId;
    
    if (!clientId) {
        console.error('ChatBot: No client ID provided');
        return;
    }

    // Create chat widget HTML
    const widgetHTML = `
        <div id="chatbot-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: system-ui, -apple-system, sans-serif;">
            <!-- Chat Button -->
            <div id="chatbot-button" style="width: 60px; height: 60px; background-color: ${config.primaryColor || '#3b82f6'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            
            <!-- Chat Window (Hidden by default) -->
            <div id="chatbot-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; border: 1px solid #e5e7eb;">
                <!-- Header -->
                <div style="background-color: ${config.primaryColor || '#3b82f6'}; color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${config.businessName || 'Chat Assistant'}</h3>
                        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">Online • Usually replies instantly</p>
                    </div>
                    <button id="close-chat" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">×</button>
                </div>
                
                <!-- Messages -->
                <div id="chat-messages" style="height: 360px; overflow-y: auto; padding: 16px; background: #f9fafb;">
                    <div style="background: white; padding: 12px; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        Hi! How can I help you today?
                    </div>
                </div>
                
                <!-- Input -->
                <div style="padding: 12px; border-top: 1px solid #e5e7eb; background: white;">
                    <div style="display: flex; gap: 8px;">
                        <input id="chat-input" type="text" placeholder="Type your message..." 
                               style="flex: 1; padding: 10px; border: 1px solid #e5e7eb; border-radius: 20px; outline: none; font-size: 14px;">
                        <button id="send-message" style="background-color: ${config.primaryColor || '#3b82f6'}; color: white; border: none; border-radius: 20px; padding: 10px 16px; cursor: pointer; font-size: 14px;">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add widget to page
    const div = document.createElement('div');
    div.innerHTML = widgetHTML;
    document.body.appendChild(div.firstChild);

    // Get elements
    const button = document.getElementById('chatbot-button');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('close-chat');
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');

    // Toggle chat window
    button.addEventListener('click', () => {
        chatWindow.style.display = 'block';
        button.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        button.style.display = 'flex';
    });

    // Send message
    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        // Add user message
        messages.innerHTML += `
            <div style="background: ${config.primaryColor || '#3b82f6'}; color: white; padding: 12px; border-radius: 12px; margin-bottom: 8px; max-width: 80%; margin-left: auto;">
                ${message}
            </div>
        `;
        
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        // Show typing indicator
        messages.innerHTML += `
            <div id="typing-indicator" style="background: #e5e7eb; color: #374151; padding: 12px; border-radius: 12px; margin-bottom: 8px; max-width: 80%;">
                Typing...
            </div>
        `;

        try {
            const response = await fetch(`https://yourdomain.com/api/chat/${clientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Remove typing indicator
            document.getElementById('typing-indicator')?.remove();

            // Add bot response
            messages.innerHTML += `
                <div style="background: white; padding: 12px; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    ${data.response}
                </div>
            `;

            messages.scrollTop = messages.scrollHeight;

        } catch (error) {
            document.getElementById('typing-indicator')?.remove();
            messages.innerHTML += `
                <div style="background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 12px; margin-bottom: 8px;">
                    Sorry, I'm having trouble connecting. Please try again.
                </div>
            `;
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();