/*
  name: pixiv commands
*/

const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const { readData } = require('../modules/apiConfig')

const header = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
  'Cache-Control': 'no-store, no-cache',
  encoding: 'utf-8'
}

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('pixiv')
    .setDescription('Send Pixiv image')
    .addStringOption((option) =>
      option.setName('tag').setDescription('image tag').setRequired(true)
    ),
  async execute (interaction) {
    const tag = interaction.options.getString('tag')

    if (!tag || tag === '') {
      await interaction.reply('Please provide a tag.')
      return
    }

    try {
      const baseurl = await readData('pixiv') // get api url from config file

      const url =
        baseurl.replace(/\${tag}/g, tag) +
        getRandomNumber(1, 5) +
        '&s_mode=s_tag'

      console.log(url)

      try {
        // 发起 HTTP GET 请求
        const response = await axios.get(url, { headers: header })
        const jsonData = response.data

        if (!jsonData || jsonData.length === 0) {
          await interaction.reply('Something went wrong.')
        } else {
          const data = jsonData.body.illustManga.data

          if (!data || data.length === 0) {
            await interaction.reply(`No image found for ${tag}.`)
            return
          }

          // 随机选择一幅作品
          const artwork = data[getRandomNumber(0, data.length - 1)]
          const picId = artwork.id
          console.log(picId)

          // 构造下载 URL
          const downloadURL = `https://pixiv.shojo.cn/${picId}`
          console.log(downloadURL)

          // 发起 HTTP GET 请求，下载图片
          const imageResponse = await axios.get(downloadURL, { headers: header, responseType: 'arraybuffer' })
          const imageData = Buffer.from(imageResponse.data, 'binary')

          // 创建附件并回复用户
          const files = [
            new AttachmentBuilder(imageData, {
              name: `${tag}.png`
            })
          ]

          await interaction.reply({ files })
        }
      } catch (error) {
        // 捕获并处理错误
        await interaction.reply(`${error}`)
        console.error(error)
      }
    } catch (error) {
      await interaction.reply(`${error}`)
      console.error(error)
    }
  }
}

function getRandomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/*
const tag = interaction.options.getString('tag')

    try {
      const url = `https://www.pixiv.net/ajax/search/artworks/${tag}?word=${tag}&order=date_d&mode=all&p=${getRandomNumber(
        0,
        5
      )}&s_mode=s_tag`

      const response = await axios.get(url, { headers: header })
      const jsonData = response.data

      if (!jsonData || jsonData.length === 0) {
        await interaction.reply('Something went wrong.')
      } else {
        const data = jsonData.body.illustManga.data

        if (!data || data.length === 0) {
          await interaction.reply(`No image found for ${tag}.`)
          return
        }

        try {
          await interaction.deferReply()

          const artwork = data[getRandomNumber(0, data.length - 1)]
          const picId = artwork.id
          console.log(picId)
          const downloadURL = `https://pixiv.lingtian.workers.dev/${picId}.png`
          const imageResponse = await axios.get(downloadURL, {
            responseType: 'arraybuffer'
          })
          const imageData = Buffer.from(imageResponse.data, 'binary')

          const files = [
            new AttachmentBuilder(imageData, {
              name: `${tag}.png`
            })
          ]

          await interaction.editReply({ files })
        } catch (error) {
          await interaction.editReply(`${error}`)
          console.error(error)
        }
      }
    } catch (error) {
      await interaction.reply(`${error}`)
      console.error(error)
    }
  }

  */
