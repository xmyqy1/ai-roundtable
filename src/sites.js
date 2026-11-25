// 各个 AI 网站的页面结构（网站改版后可在“网站设置 → 高级”里修改，不用改代码）
// input: 输入框  send: 发送按钮  response: 每条 AI 回答的容器  stop: 生成中才出现的“停止”按钮
// 留空的项会用通用规则自动猜测。
const DEFAULT_SITES = {
  dola: {
    name: 'Dola', url: 'https://www.dola.com/chat/',
    input: 'textarea[data-testid="chat_input_input"], textarea',
    send: 'button[data-testid="chat_input_send_button"], #flow-end-msg-send',
    response: '[data-testid="receive_message"] [data-testid="message_text_content"], [data-testid="receive_message"]',
    stop: '[data-testid="chat_input_local_break_button"]',
  },
  doubao: {
    name: '豆包', url: 'https://www.doubao.com/chat/',
    input: 'textarea[data-testid="chat_input_input"], textarea',
    send: 'button[data-testid="chat_input_send_button"], #flow-end-msg-send',
    response: '[data-testid="receive_message"] [data-testid="message_text_content"], [data-testid="receive_message"]',
    stop: '[data-testid="chat_input_local_break_button"]',
  },
  chatgpt: {
    name: 'ChatGPT', url: 'https://chatgpt.com/',
    input: '#prompt-textarea',
    send: 'button[data-testid="send-button"], #composer-submit-button',
    response: '[data-message-author-role="assistant"]',
    stop: 'button[data-testid="stop-button"]',
  },
  claude: {
    name: 'Claude', url: 'https://claude.ai/new',
    input: 'div[contenteditable="true"].ProseMirror, div[contenteditable="true"]',
    send: 'button[aria-label="Send message"], button[aria-label="Send Message"], button[aria-label="发送消息"]',
    response: '.font-claude-response, .font-claude-message, [data-testid="assistant-message"]',
    stop: 'button[aria-label="Stop response"], button[aria-label="停止响应"]',
    streaming: '[data-is-streaming="true"]',
  },
  gemini: {
    name: 'Gemini', url: 'https://gemini.google.com/app',
    input: 'rich-textarea .ql-editor, div.ql-editor[contenteditable="true"]',
    send: 'button.send-button, button[aria-label="Send message"], button[aria-label="发送"]',
    response: 'model-response message-content, model-response .model-response-text',
    stop: 'button.stop, button[aria-label="Stop response"], button[aria-label="停止回答"]',
  },
  deepseek: {
    name: 'DeepSeek', url: 'https://chat.deepseek.com/',
    input: 'textarea#chat-input, textarea',
    send: '',
    response: '.ds-markdown:not(.ds-think-content .ds-markdown)',
    stop: '',
  },
  kimi: {
    name: 'Kimi', url: 'https://www.kimi.com/',
    input: '.chat-input-editor[contenteditable="true"], div[contenteditable="true"], textarea',
    send: '.send-button-container, .send-button',
    response: '.segment-assistant .markdown, .chat-content-item-assistant .markdown',
    stop: '',
  },
  qwen: {
    name: '通义千问', url: 'https://tongyi.aliyun.com/qianwen/',
    input: 'textarea', send: '', response: '[class*="answerItem"] [class*="markdown"], .markdown-body', stop: '',
  },
  yuanbao: {
    name: '腾讯元宝', url: 'https://yuanbao.tencent.com/chat',
    input: '.ql-editor[contenteditable="true"], div[contenteditable="true"], textarea',
    send: '#yuanbao-send-btn, a[class*="send-btn"]',
    response: '.agent-chat__bubble--ai .hyc-content-md, .hyc-common-markdown',
    stop: '',
  },
  qwenchat: {
    name: 'Qwen Chat（国际版）', url: 'https://chat.qwen.ai/',
    input: 'textarea#chat-input, textarea', send: 'button#send-message-button',
    response: '.response-message-content, .markdown-content-container', stop: '',
  },
  grok: {
    name: 'Grok', url: 'https://grok.com/',
    input: 'div[contenteditable="true"], textarea', send: 'button[type="submit"][aria-label], button[aria-label="Submit"], button[aria-label="提交"]',
    response: '[class*="response-content-markdown"], .message-bubble .markdown', stop: '',
  },
  perplexity: {
    name: 'Perplexity', url: 'https://www.perplexity.ai/',
    input: '#ask-input, div[contenteditable="true"], textarea', send: 'button[aria-label="Submit"], button[data-testid="submit-button"]',
    response: '[id^="markdown-content"], .prose', stop: '',
  },
  copilot: {
    name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/',
    input: 'textarea#userInput, textarea', send: 'button[data-testid="submit-button"], button[aria-label="Submit message"]',
    response: '[data-content="ai-message"]', stop: '',
  },
  lechat: {
    name: 'Mistral Le Chat', url: 'https://chat.mistral.ai/chat',
    input: 'div[contenteditable="true"], textarea', send: 'button[type="submit"]',
    response: '[data-message-author-role="assistant"] [data-message-part-type="answer"], [data-message-author-role="assistant"]', stop: '',
  },
  poe: {
    name: 'Poe', url: 'https://poe.com/',
    input: 'textarea', send: 'button[data-button-send="true"], button[aria-label="Send message"]',
    response: '[class*="Message_leftSideMessageBubble"] [class*="Markdown"], [class*="Message_botMessageBubble"]', stop: '',
  },
  chatglm: {
    name: '智谱清言', url: 'https://chatglm.cn/main/alltoolsdetail',
    input: 'textarea', send: '.enter-icon-container, .enter',
    response: '.answer-content-wrap .markdown-body, .answer .markdown-body', stop: '',
  },
  yiyan: {
    name: '文心一言', url: 'https://yiyan.baidu.com/',
    input: 'div[contenteditable="true"], textarea', send: '#sendBtn, [class*="send"]',
    response: '[class*="answerBox"] .custom-html, [class*="markdown"]', stop: '',
  },
  hailuo: {
    name: '海螺 AI（MiniMax）', url: 'https://chat.minimaxi.com/',
    input: 'textarea, div[contenteditable="true"]', send: '#input-send-icon, [class*="send"]',
    response: '.message.system .markdown, [class*="markdown"]', stop: '',
  },
  xinghuo: {
    name: '讯飞星火', url: 'https://xinghuo.xfyun.cn/desk',
    input: 'textarea', send: '[class*="send"]',
    response: '[class*="markdown"]', stop: '',
  },
  metaso: {
    name: '秘塔 AI 搜索', url: 'https://metaso.cn/',
    input: 'textarea', send: 'button.send-arrow-button, button[aria-label*="发送"]',
    response: '[class*="markdown"]', stop: '',
  },
};
