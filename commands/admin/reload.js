/*
  name: reload commands
*/

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  category: 'admin',
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('The command to reload.')
        .setRequired(true)
    ),
  async execute (interaction) {
    await interaction.deferReply()
    try {
      const commandName = interaction.options
        .getString('command', true)
        .toLowerCase()
      const command = interaction.client.commands.get(commandName)

      if (!command) {
        await interaction.editReply({
          content: `There is no command with name \`${commandName}\`!`,
          ephemeral: true
        })
        setTimeout(async () => {
          await interaction.deleteReply()
        }, 2500)
      }

      delete require.cache[
        require.resolve(`../${command.category}/${command.data.name}.js`)
      ]

      try {
        interaction.client.commands.delete(command.data.name)
        const newCommand = require(`../${command.category}/${command.data.name}.js`)
        interaction.client.commands.set(newCommand.data.name, newCommand)
        await interaction.editReply({
          content: `Command \`${newCommand.data.name}\` was reloaded!`,
          ephemeral: true
        })
        setTimeout(async () => {
          await interaction.deleteReply()
        }, 2500)
      } catch (error) {
        console.error(error)
        await interaction.editReply({
          content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
          ephemeral: true
        })
        setTimeout(async () => {
          await interaction.deleteReply()
        }, 2500)
      }
    } catch (err) {
      console.log(new Date().toISOString() + ' ' + err)
    }
  }
}
