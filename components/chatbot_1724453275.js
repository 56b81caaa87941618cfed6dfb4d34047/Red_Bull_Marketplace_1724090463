// To add this component to the user's app, you must follow all three of these steps: 
// 1. In the user app html file, include `<chatbot_1724453275></chatbot>` in the place where the chart needs to be inserted.
// 2. In the user app the html file's <head> section, import the JS file for this component `./components/chatbot.js`. You are strictly required to **NOT** remove anything else.
// 3. The chatbot sends the user's message along with a "system prompt" to an LLM to get the response. If the user writes about the kind of chatbot they want, include that context in the `system_prompt`, by replacing `PLACEHOLDER_LLM_SYSTEM_PROMPT` with your own written system prompt.

Vue.component('chatbot', {
  template: `
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <div>
        <div v-if="showChatBot" class="z-100 fixed bottom-0 left-0 mb-4 ml-4 mr-6 bg-white py-1 px-1 rounded-full cursor-pointer" @click="toggleChat">
            <button class="text-white py-3 pl-3 pr-3 transition duration-300 flex items-center rounded-full"><img src="./images/chat_icon.png" alt="chatbot-icon" class="src w-12 h-12 rounded-full"></button>
        </div>
        <div id="main-chat-container" ref="chatContainer" class="flex fixed bottom-16 left-2 px-8 bg-gray-200 bg-opacity-50 blur-lg rounded-lg overflow-y-auto" v-show="showChat">
            <div class="rounded-lg p-4 flex-grow-1">
                <div class="flex flex-row justify-between">
                    <h2 class="pl-3 mt-2 pr-5 text-black">Chatbot</h2>
                    <button @click="closeChat" class="flex items-center bg-white text-xs text-black px-3 py-2.5 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15"><path d="M12 15.41l-4.59-4.59L6 11l6 6 6-6-1.41-1.41L12 15.41z"></path></svg></button>
                </div>
                <div class="bg-white h-px w-full mt-1"></div>
                <div class="p-4 text-white rounded-t-lg flex justify-around items-center" id="close-chat"></div>
                <div id="chatbox" class="p-4 h-80 break-words overflow-auto">
                    <div v-for="(message, index) in messages" :key="index" class="flex justify-between w-full">
                        <div v-if="message.role === 'user'" class="flex justify-end mb-2 w-full"><div class="bg-blue-500 text-white px-4 py-2 rounded-lg self-start" style="max-width: 70%;">{ message.content }</div></div>
                        <div v-else-if="message.role === 'assistant'" class="flex justify-start mb-2 w-full"><div class="bg-gray-500 text-white px-4 py-2 rounded-lg self-end" style="max-width: 70%;">{ message.content }</div></div>
                    </div>
                </div>
                <div id="main-input-box-field" class="p-4 pb-10 flex w-full">
                <input v-model="message" @keyup.enter="sendMessage" type="text" placeholder="Type prompt here..." class="italic flex-grow px-3 py-2 bg-gray-100 text-black rounded-l-md outline-none border-none focus:border-transparent focus:ring-0">
                    <button @click="sendMessage" class="text-white px-4 py-2 rounded-r-md transition duration-300 bg-white"><img src="./images/send.png" alt="Send-button" class="src w-16px h-16px"></button>
                </div>
            </div>
        </div>            
    </div>
    </div>
    `,
  delimiters: ['{', '}'],
  data() {
    return {
      showChat: false,
      showChatBot: true,
      message: '',
      messages: [
        { "role": "user", "content": "hi" },
        { "role": "assistant", "content": "Hello! How can I assist you?" }
      ],
      system_prompt: "PLACEHOLDER_LLM_SYSTEM_PROMPT"
    };
  },

  methods: {
    // start sendMessage() method 
    sendMessage: function () {
      if (this.message.trim() !== '') {
        this.messages.push({
          role: "user",
          content: this.message.trim()
        });
        this.generateMessages();
        this.message = '';
      }
    },
    //end sendMessage() method

    // start closeChat() method
    closeChat: function () {
      this.showChat = false;
      this.showChatBot = true;
    },
    //end closeChat() method

    // start toggleChat() method
    toggleChat: function () {
      this.showChatBot = !this.showChatBot;
      this.showChat = !this.showChat;
    },
    //end toggleChat() method

    // start generateMessages() method
    generateMessages: function () {
      let systemMessage = { "role": "system", content: this.system_prompt };
      this.messages.unshift(systemMessage);

      axios.post('https://makeinfinite-mentat-dev.azurewebsites.net/generate_message', {
        messages: this.messages
      })
        .then(response => {
          this.messages.push({
            role: 'assistant',
            content: response.data.generated_messages.trim()
          });
        });
    },
    // end generateMessages() method
  },
},
);