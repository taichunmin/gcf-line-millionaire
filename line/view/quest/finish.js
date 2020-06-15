const { color } = require('../common')

module.exports = () => ({
  altText: '您已經回答完所有題目，請點選「答題狀態」來查看大家的回答狀況。',
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
        text: '您已經回答完所有題目，請點選「答題狀態」來查看大家的回答狀況。',
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
            data: JSON.stringify(['about']),
            label: '關於程式',
            type: 'postback',
          },
        },
        {
          color: color.btn.success,
          style: 'primary',
          type: 'button',
          action: {
            label: '答題狀態',
            type: 'uri',
            uri: 'https://taichunmin.idv.tw',
          },
        },
      ],
    },
  },
})
