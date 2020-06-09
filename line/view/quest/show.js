const _ = require('lodash')
const { color } = require('../common')

const EMOJIS = {
  1: '❶',
  2: '❷',
  3: '❸',
  4: '❹',
}

const renderOption = ({ quest, emoji, i }) => ({
  backgroundColor: color.btn.primary,
  cornerRadius: '10px',
  layout: 'vertical',
  paddingAll: '10px',
  paddingEnd: '20px',
  paddingStart: '20px',
  type: 'box',
  action: {
    data: JSON.stringify(['questAnswer', quest.id, i]),
    type: 'postback',
  },
  contents: [{
    color: color.text.white,
    text: `${emoji} ${_.get(quest, 'option' + i)}`,
    type: 'text',
    wrap: true,
  }],
})

module.exports = quest => ({
  type: 'flex',
  altText: `第 ${quest.id} 題`,
  contents: {
    size: 'giga',
    type: 'bubble',
    header: {
      layout: 'vertical',
      paddingAll: '0px',
      type: 'box',
      contents: [
        {
          aspectMode: 'cover',
          aspectRatio: '16:9',
          size: 'full',
          type: 'image',
          url: 'https://i.imgur.com/TMHwORd.jpg',
        },
        {
          backgroundColor: color.badge.warning.bg,
          cornerRadius: '13px',
          height: '26px',
          layout: 'horizontal',
          offsetStart: '12px',
          offsetTop: '12px',
          position: 'absolute',
          type: 'box',
          width: '75px',
          contents: [{
            align: 'center',
            color: color.badge.warning.text,
            gravity: 'center',
            size: 'sm',
            text: `第 ${quest.id} 題`,
            type: 'text',
            weight: 'bold',
          }],
        },
      ],
    },
    body: {
      backgroundColor: color.bg.black,
      layout: 'vertical',
      type: 'box',
      contents: [{
        color: color.text.white,
        text: quest.quest,
        type: 'text',
        wrap: true,
      }],
    },
    footer: {
      backgroundColor: color.bg.black,
      layout: 'vertical',
      spacing: 'md',
      type: 'box',
      contents: _.map(EMOJIS, (emoji, i) => renderOption({ quest, emoji, i })),
    },
  },
})
