/*
  name: anime commands
*/

const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const { readData } = require('../../modules/apiConfig')

const header = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
  'Cache-Control': 'no-store, no-cache',
  'Content-Type': 'application/json',
  encoding: 'utf-8'
}

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('send anime image.')
    .addStringOption((option) =>
      option.setName('tag').setDescription('image tag').setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName('nsfw').setDescription('nsfw').setRequired(true)
    ),
  async execute (interaction) {
    const tag = interaction.options.getString('tag')
    const nsfw = interaction.options.getBoolean('nsfw')
    const channel = interaction.channel

    if (!tag || tag === null || tag === '') {
      await interaction.editReply('Please provide a tag.')
      return
    }

    try {
      await interaction.deferReply()

      const baseURLNsfw = await readData('anime_nsfw')
      const baseURLNonNsfw = await readData('anime_none_nsfw')

      const nsfwUrl = `${baseURLNsfw.replace(/\${tag}/g, tag)}`
      const nonNsfwUrl = `${baseURLNonNsfw.replace(/\${tag}/g, tag)}`

      const apiUrl = nsfw ? nsfwUrl : nonNsfwUrl

      if (!channel.nsfw && nsfw) {
        await interaction.editReply('This channel is not NSFW.')
        return
      }

      const response = await axios.get(apiUrl, { headers: header })
      const ret = response.data

      if (!ret.data || ret.data.length === 0) {
        await interaction.editReply(`No image found for tag: ${tag}.`)
        return
      }

      const imageUrl = ret.data[0].urls.original
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageData = Buffer.from(imageResponse.data, 'binary')

      const files = [
        new AttachmentBuilder(imageData, { name: `${tag}.png` })
      ]

      await interaction.editReply({ files })
    } catch (error) {
      console.error('Error:', error)
      await interaction.editReply('An error occurred while fetching the anime image.')
    }
  }
}
