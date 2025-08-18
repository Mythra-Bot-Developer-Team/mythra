const { Client, Collection, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
    intents: [    
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates, // SES ETKİNLİKLERİ İÇİN GEREKLİ
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents
    ] 
});

// Komutları yükle
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[UYARI] ${file} komutunda "data" veya "execute" eksik!`);
    }
}

// Slash komutları kaydetme
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Global komutlar (tüm sunucularda görünür, 1 saatte bir güncellenir)
        // await rest.put(Routes.applicationCommands(clientId), { body: commands });
        
        // Sadece belirli bir sunucu için (anında güncelleme)
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

// Eventleri yükleme
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Deploy Commands İçin
require('./deploy-commands.js');

// Oto Mesajlar
client.on('messageCreate', message => {
  if (message.content.toLowerCase() === 'sa') {
    message.reply('Aleyküm selam hoş geldin! <:mythra_wave:1405894813970337893>');
  }
});

client.on('messageCreate', message => {
  if (message.content.toLowerCase() === '<@1401962002515103845>') {
    message.reply('<:mythra:1404425661120122971> </help:1404028368508424295> **ile komut listesini görünteleyebilirsin.** Ayrıca destek için </invite:1403871782930219092> komutunu kullanıp discord sunucumuza katılabilirsin.');
  }
});

client.on('messageCreate', message => {
  if (message.content.toLowerCase() === 'versiyon') {
    message.reply('<:mythra:1404425661120122971> </uptime:1403871783324749846> komutu ile öğrenebilirsin. İyi kullanımlar! `🤍`');
  }
});


client.login(token);
