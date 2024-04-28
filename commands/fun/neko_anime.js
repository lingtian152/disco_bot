/*
  name: neko anime commands
*/

const { SlashCommandBuilder } = require('discord.js')
const { Client } = require('nekos-best.js')

const nekosBest = new Client()

const tag = [
  'husbando',
  'kitsune',
  'neko',
  'waifu',
  'baka',
  'bite',
  'blush',
  'bored',
  'cry',
  'cuddle',
  'dance',
  'facepalm',
  'feed',
  'handhold',
  'handshake',
  'happy',
  'highfive',
  'hug',
  'kick',
  'kiss',
  'laugh',
  'lurk',
  'nod',
  'nom',
  'nope',
  'pat',
  'peck',
  'poke',
  'pout',
  'punch',
  'shoot',
  'shrug',
  'slap',
  'sleep',
  'smile',
  'smug',
  'stare',
  'think',
  'thumbsup',
  'tickle',
  'wave',
  'wink',
  'yawn',
  'yeet'
]

async function RandomTag () { // Random tag
  const randomIndex = Math.floor(Math.random() * tag.length)
  const result = tag[randomIndex]

  return Promise.resolve(result)
}

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('neko')
    .setDescription('Neko anime'),
  async execute (interaction) {
    try {
      await interaction.deferReply()

      // Fetch a random neko image using a random tag
      const picResponse = await nekosBest.fetch(await RandomTag(), 1)
      const picUrl = picResponse.results[0].url

      // Reply with the fetched image
      await interaction.editReply({ content: picUrl })
    } catch (error) {
      console.error('Error fetching neko image:', error)
      await interaction.editReply('Failed to fetch neko image.')
    }
  }
}
