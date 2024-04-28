/*
  name: 骚话
*/

const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const { readData } = require('../../modules/apiConfig')

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('sexy')
    .setDescription('sexy sentence'),
  async execute (interaction) {
    await interaction.deferReply()

    const url = await readData('sexy')

    const response = await axios.get(url)

    if (response.status === 200) {
      const data = response.data
      await interaction.editReply(data)
    } else {
      console.log(`Status Code: ${response.status}`)
    }
  }
}
