/*
  name: ping commands
*/

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  category: 'until',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute (interaction) {
    await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`)
  }
}
