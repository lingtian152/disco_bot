/*
  Name: ChatGPT module
*/

const axios = require('axios')
const { Events } = require('discord.js')

module.exports = {
  name: Events.MessageCreate,
  async execute (message) {
    if (!message || typeof message.author !== 'object' || !message.author.id) {
      console.error('Message object is undefined or missing author or author id property')
      return
    }

    if (message.author.bot) return

    const requestData = {
      messages: [
        {
          role: 'user',
          content: message.content
        }
      ],
      stream: true
    }
    if (message.content.startsWith('ChatGPT') || message.mentions.has(message.client.user)) {
      try {
        const response = await axios.post('https://aurora-nine-mu.vercel.app/v1/chat/completions?Authorization=lt114514', requestData)

        console.log(response)

        if (response.status === 200) {
          const messageData = JSON.stringify(response.message)
          await message.reply(messageData)
        } else {
          console.error('Error: ' + response.status)
          await message.reply('Error: ' + response.status)
        }
      } catch (error) {
        console.log('Error: ' + error)
      }
    }
  }
}

// https://aurora-nine-mu.vercel.app/v1/chat/completions?Authorization=lt114514
// https://aurora-hazel-psi.vercel.app/v1/chat/completions?AUTH_TOKEN=lt114514

/*

我写寄吧，api没啥问题，却要改，但这部署到服务端后就出了问题，跑本地端就没问题，我写尼玛，不如不写，速速跑路
没啥好写的，这写了也是浪费时间，真有人会想在discord上玩chatGPT啊🤣😅😅，用官方的他不香？

他妈的，代码没问题，返回的不是5开头的服务端问题，就是4开头的客户端问题，那不如不写，没啥好玩的，我真他妈超了

我他妈去做点正经的项目他不香？捏麻麻的

I write the this code is a mother fuck, api is no any problem, but deploy into sever will have problem
running in local anything is fine
why I should need kept coding this, why not drop this off.

nothing is good for writen, writen this also losing my time, who is really want using ChatGPT in discord?🤣😅😅
why not is going using offical's ChatGPT?

the fuck, the code anything is okay, but why server returrn code is start at 5, is the server problem?
or return code is start at 4, is the client problem?
nothing is good for written, The fuck.

why not I am not going make a good project, make a good project is not good? fuck.
*/
