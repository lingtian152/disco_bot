/*
  name: 白丝
*/

const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const axios = require('axios')
const { readData } = require('../../modules/apiConfig')

const header = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
  'Cache-Control': 'no-store, no-cache',
  encoding: 'utf-8'
}

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('white_silk')
    .setDescription('white silk'),
  async execute (interaction) {
    try {
      await interaction.deferReply()

      const baseUrl = await readData('white_silk')

      const imageResponse = await axios.get(baseUrl, { responseType: 'arraybuffer', headers: header })
      const imageData = Buffer.from(imageResponse.data, 'binary')

      const files = [
        new AttachmentBuilder(imageData, {
          name: 'image.png'
        })
      ]

      await interaction.editReply({ files })
    } catch (error) {
      await interaction.editReply(`${error}`)
    }
  }
}
