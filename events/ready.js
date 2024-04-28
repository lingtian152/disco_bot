/*
  print out if bot successful logged
*/

const { Events, ActivityType } = require('discord.js')

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute (client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
    client.user.setActivity('发呆Ing', { type: ActivityType.Playing })
  }
}
