/*
  Bot main file
*/

const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials
} = require('discord.js')

const path = require('path')
const fs = require('fs')

const client = new Client({
  // bot client配置
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
})

const logo = fs.readFileSync('./logo.txt', 'ascii') // logo文件

console.log(logo) // 打印logo

const { deployCommands } = require('./deploy-commands') // 部署指令
const { registerCommands, loadEvent } = require('./modules/setup') // 指令和事件模块

const eventsPath = path.join(__dirname, 'events') // 事件路径
const commandsPath = path.join(__dirname, 'commands') // 指令路径

// 解密登录token
const config = require('./config.json') // 配置文件

client.commands = new Collection()

loadEvent(client, eventsPath) // 加载事件

deployCommands() // 部署指令

// 登录
client.login(Buffer.from(config.token, 'base64').toString('utf-8'))
  .then(() => {
    registerCommands(client, commandsPath) // 部署指令
  })
  .catch((error) => {
    console.error('Login Failure:', error)
  })
