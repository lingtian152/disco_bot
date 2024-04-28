/*
    load commands and events
*/

const path = require('path')
const fs = require('fs')

async function registerCommands (client, commandPath) {
  // 注册指令
  const commandFolders = fs.readdirSync(commandPath)

  for (const folder of commandFolders) {
    const commandsPath = path.join(commandPath, folder)

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'))
    try {
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
          console.log(
            new Date().toISOString() +
              ` [INFO] Registered command: ${command.data.name}`
          )
          client.commands.set(command.data.name, command)
        } else {
          console.log(
            new Date().toISOString() +
              ` [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          )
        }
      }
    } catch (err) {
      console.error(
        new Date().toISOString() +
          ` [ERROR] An error occurred while registering commands: ${err}`
      )
    }
  }
}

async function loadEvent (client, eventsPath) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'))
  for (const file of eventFiles) {
    // 加载event文件夹
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    try {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
        console.log(
          new Date().toISOString() + ` [INFO] Events ${event.name} has loaded`
        )
      } else {
        client.on(event.name, (...args) => event.execute(...args))
        console.log(
          new Date().toISOString() + ` [INFO] Events ${event.name} has loaded`
        )
      }
    } catch (err) {
      console.error(
        new Date().toISOString() +
          ` [ERROR] An error occurred while loading event ${file}: ${err}`
      )
    }
  }
}

module.exports = {
  registerCommands,
  loadEvent
}
