const DEFAULT_SITES = {
  dola: {
    name: "Dola",
    url: "https://www.dola.com/chat/",
    input: 'textarea[data-testid="chat_input_input"], textarea',
    send: 'button[data-testid="chat_input_send_button"], #flow-end-msg-send',
    response: '[data-testid="receive_message"] [data-testid="message_text_content"], [data-testid="receive_message"]',
    stop: '[data-testid="chat_input_local_break_button"]'
  },
  doubao: {
    name: "\u8C46\u5305",
    url: "https://www.doubao.com/chat/",
    input: 'textarea[data-testid="chat_input_input"], textarea',
    send: 'button[data-testid="chat_input_send_button"], #flow-end-msg-send',
    response: '[data-testid="receive_message"] [data-testid="message_text_content"], [data-testid="receive_message"]',
    stop: '[data-testid="chat_input_local_break_button"]'
  },
  chatgpt: {
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    input: '#prompt-textarea, form div.ProseMirror[contenteditable="true"]',
    send: 'button[data-testid="send-button"], #composer-submit-button, form button[type="submit"]',
    response: '[data-dil-response], [data-message-author-role="assistant"]',
    stop: 'button[data-testid="stop-button"]',
    streaming: '[data-talvt-turn-state="in_progress"]'
  },
  claude: {
    name: "Claude",
    url: "https://claude.ai/new",
    input: 'div[contenteditable="true"].ProseMirror, div[contenteditable="true"]',
    send: 'button[aria-label="Send message"], button[aria-label="Send Message"], button[aria-label="\u53D1\u9001\u6D88\u606F"]',
    response: '.font-claude-response, .font-claude-message, [data-testid="assistant-message"]',
    stop: 'button[aria-label="Stop response"], button[aria-label="\u505C\u6B62\u54CD\u5E94"]',
    streaming: '[data-is-streaming="true"]'
  },
  gemini: {
    name: "Gemini",
    url: "https://gemini.google.com/app",
    input: 'rich-textarea .ql-editor, div.ql-editor[contenteditable="true"]',
    send: 'button.send-button, button[aria-label="Send message"], button[aria-label="\u53D1\u9001"]',
    response: "model-response message-content, model-response .model-response-text",
    stop: 'button.stop, button[aria-label="Stop response"], button[aria-label="\u505C\u6B62\u56DE\u7B54"]'
  },
  deepseek: {
    name: "DeepSeek",
    url: "https://chat.deepseek.com/",
    input: "textarea#chat-input, textarea",
    send: "",
    response: ".ds-markdown:not(.ds-think-content .ds-markdown)",
    stop: ""
  },
  kimi: {
    name: "Kimi",
    url: "https://www.kimi.com/",
    input: '.chat-input-editor[contenteditable="true"], div[contenteditable="true"], textarea',
    send: ".send-button-container, .send-button",
    response: ".segment-assistant .markdown, .chat-content-item-assistant .markdown",
    stop: ""
  },
  qwen: {
    name: "\u901A\u4E49\u5343\u95EE",
    url: "https://tongyi.aliyun.com/qianwen/",
    input: "textarea",
    send: "",
    response: '[class*="answerItem"] [class*="markdown"], .markdown-body',
    stop: ""
  },
  yuanbao: {
    name: "\u817E\u8BAF\u5143\u5B9D",
    url: "https://yuanbao.tencent.com/chat",
    input: '.ql-editor[contenteditable="true"], div[contenteditable="true"], textarea',
    send: '#yuanbao-send-btn, a[class*="send-btn"]',
    response: ".agent-chat__bubble--ai .hyc-content-md, .hyc-common-markdown",
    stop: ""
  },
  qwenchat: {
    name: "Qwen Chat\uFF08\u56FD\u9645\u7248\uFF09",
    url: "https://chat.qwen.ai/",
    input: "textarea#chat-input, textarea",
    send: "button#send-message-button",
    response: ".response-message-content, .markdown-content-container",
    stop: ""
  },
  grok: {
    name: "Grok",
    url: "https://grok.com/",
    input: 'div[contenteditable="true"], textarea',
    send: 'button[type="submit"][aria-label], button[aria-label="Submit"], button[aria-label="\u63D0\u4EA4"]',
    response: '[class*="response-content-markdown"], .message-bubble .markdown',
    stop: ""
  },
  perplexity: {
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    input: '#ask-input, div[contenteditable="true"], textarea',
    send: 'button[aria-label="Submit"], button[data-testid="submit-button"]',
    response: '[id^="markdown-content"], .prose',
    stop: ""
  },
  copilot: {
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com/",
    input: "textarea#userInput, textarea",
    send: 'button[data-testid="submit-button"], button[aria-label="Submit message"]',
    response: '[data-content="ai-message"]',
    stop: ""
  },
  lechat: {
    name: "Mistral Le Chat",
    url: "https://chat.mistral.ai/chat",
    input: 'div[contenteditable="true"], textarea',
    send: 'button[type="submit"]',
    response: '[data-message-author-role="assistant"] [data-message-part-type="answer"], [data-message-author-role="assistant"]',
    stop: ""
  },
  poe: {
    name: "Poe",
    url: "https://poe.com/",
    input: "textarea",
    send: 'button[data-button-send="true"], button[aria-label="Send message"]',
    response: '[class*="Message_leftSideMessageBubble"] [class*="Markdown"], [class*="Message_botMessageBubble"]',
    stop: ""
  },
  chatglm: {
    name: "\u667A\u8C31\u6E05\u8A00",
    url: "https://chatglm.cn/main/alltoolsdetail",
    input: "textarea",
    send: ".enter-icon-container, .enter",
    response: ".answer-content-wrap .markdown-body, .answer .markdown-body",
    stop: ""
  },
  yiyan: {
    name: "\u6587\u5FC3\u4E00\u8A00",
    url: "https://yiyan.baidu.com/",
    input: 'div[contenteditable="true"], textarea',
    send: '#sendBtn, [class*="send"]',
    response: '[class*="answerBox"] .custom-html, [class*="markdown"]',
    stop: ""
  },
  hailuo: {
    name: "\u6D77\u87BA AI\uFF08MiniMax\uFF09",
    url: "https://chat.minimaxi.com/",
    input: 'textarea, div[contenteditable="true"]',
    send: '#input-send-icon, [class*="send"]',
    response: '.message.system .markdown, [class*="markdown"]',
    stop: ""
  },
  xinghuo: {
    name: "\u8BAF\u98DE\u661F\u706B",
    url: "https://xinghuo.xfyun.cn/desk",
    input: "textarea",
    send: '[class*="send"]',
    response: '[class*="markdown"]',
    stop: ""
  },
  metaso: {
    name: "\u79D8\u5854 AI \u641C\u7D22",
    url: "https://metaso.cn/",
    input: "textarea",
    send: 'button.send-arrow-button, button[aria-label*="\u53D1\u9001"]',
    response: '[class*="markdown"]',
    stop: ""
  }
};
