const { color } = require('./common')

module.exports = ({ event }) => [{
  altText: '請按「開始答題」開始回答題目。',
  type: 'flex',
  contents: {
    type: 'bubble',
    hero: {
      aspectMode: 'cover',
      aspectRatio: '16:9',
      size: 'full',
      type: 'image',
      url: 'https://i.imgur.com/BkLfPfq.png',
    },
    body: {
      backgroundColor: color.bg.black,
      layout: 'vertical',
      type: 'box',
      contents: [{
        color: color.text.white,
        text: '這個是「在 LINE Chatbot 中串接 Google Analytics 的經驗分享」的範例程式。\n\n請按「開始答題」開始回答以下有關 LINE Message API 以及 chatbot.tw 相關的題目。',
        type: 'text',
        wrap: true,
      }],
    },
    footer: {
      backgroundColor: color.bg.black,
      layout: 'horizontal',
      spacing: 'md',
      type: 'box',
      contents: [
        {
          color: color.btn.secondary,
          style: 'primary',
          type: 'button',
          action: {
            data: JSON.stringify(['contributors']),
            label: '貢獻者',
            type: 'postback',
          },
        },
        {
          color: color.btn.success,
          style: 'primary',
          type: 'button',
          action: {
            data: JSON.stringify(['questShow']),
            label: '開始答題',
            type: 'postback',
          },
        },
      ],
    },
  },
}]
