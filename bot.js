import * as dotenv from 'dotenv'
import eris,{ Constants, Collection, CommandInteraction } from 'eris'

import fs from 'fs'
dotenv.config()

// Create a Client instance with our bot token.
const bot = new eris(process.env.DISCORD_BOT_TOKEN);


bot.on('error', err => {
  console.warn(err);
});


bot.on('ready', async () => {
  console.info('Loading commands...');
  bot.commands = new Collection();

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
      const command = (await import(`./commands/${file}`)).default;
      bot.commands.set(command.name, command);

      bot.createCommand({
          name: command.name,
          description: command.description,
          options: command.options ?? [],
          type: Constants.ApplicationCommandTypes.CHAT_INPUT,
      });
  }
  console.info('Commands loaded!');
});

bot.on('interactionCreate', async (i) => {
  if (i instanceof CommandInteraction) {
      if (!bot.commands.has(i.data.name)) return i.createMessage('This command does not exist.');

      try {
          await bot.commands.get(i.data.name).execute(i);
      }
      catch (error) {
          console.error(error);
          await i.createMessage('There was an error while executing this command!');
      }
  }
});

bot.connect();



// const PREFIX = 'ftb!';
// const commandHandlerForCommandName = {};
// commandHandlerForCommandName['treasure'] = (msg, args) => {
//   const mention = args[0];
//   const treasureRoll = roll(1,20).toString()
//   // const treasureRoll = roll(6,7).toString()
  
//   let treasure = treasureTable["treasure"][treasureRoll]
//   let resp = ""
//   let diceRolls = treasureRoll 
//   if (treasure.gold){
//     let gold = treasure.gold
//     if (treasure.multiplier){
//       const goldRoll = roll(1,20)
//       gold = goldRoll * gold
//       diceRolls += `,${goldRoll}`
//     }
//     resp += `Gold: ${gold} \n`
//   }
  
  
//   if(treasure.type == "Potions"){
//     let potionsString = "Potions: "
//     for (let i = 0; i < treasure.amount; i++){
//       let rll = roll(0,19)
//       diceRolls += `,${rll}`
//       if (rll < 18){
//         potionsString += treasureTable["potions"][rll] + ", "
//       }else{
//         const rll2 = roll(0,9)
//         potionsString += treasureTable["greater_potions"][rll] + ", "
//         diceRolls += `,${rll2}`
//       }
//     }

//     resp += potionsString + '\n'
//   }
//   else if (treasure.type == "Scrolls" || treasure.type == "Grimoire"){
//     let string = `${treasure.type}: `
//     for (let i = 0; i < treasure.amount; i++){
//       let rll, rll2 
//       rll = roll(1,20)
//       diceRolls += `,${rll}`
//       if (rll <= 5){
//         rll2 = roll(1,19)
//         string += treasureTable["spells"]["5"][rll2] + ", "
//         diceRolls += `,${rll2+1}`
//       }
//       else if (rll <= 10){
//         rll2 = roll(1,19)
//         string += treasureTable["spells"]["10"][rll2] + ", "
//         diceRolls += `,${rll2+1}`
//       }
//       else if (rll <= 15){
//         rll2 = roll(1,19)
//         string += treasureTable["spells"]["15"][rll2] + ", "
//         diceRolls += `,${rll2+1}`
//       }
//       else if (rll <= 20){
//         rll2 = roll(1,19)
//         string += treasureTable["spells"]["20"][rll2] + ", "
//         diceRolls += `,${rll2+1}`
//       }
      
//     }

//     resp += string + '\n'
//   }
//   else if (treasure.type == "Magic Weapon/Armour"){
//     let string = `${treasure.type}: `
//     for (let i = 0; i < treasure.amount; i++){
//       let rll = roll(0,19)

//       string += treasureTable["weapon/armour"][rll]
//       diceRolls += `,${rll+1}`
      
//     }

//     resp += string + '\n'
//   }
//   else if (treasure.type == "Magic item"){
//     let string = `${treasure.type}: `
//     for (let i = 0; i < treasure.amount; i++){
//       let rll = roll(0,19)

//       string += treasureTable["items"][rll]
//       diceRolls += `,${rll+1}`
      
//     }

//     resp = `${string} \n`
//   }

  
//   resp = `Dice Rolls: (${diceRolls})\n${resp}`

//   // TODO: Handle invalid command arguments, such as:
//   // 1. No mention or invalid mention.
//   // 2. No amount or invalid amount.

//   return msg.channel.createMessage(resp);
// };



// bot.on('messageCreate', async (msg) => {
//   const content = msg.content;

//   // Ignore any messages sent as direct messages.
//   // The bot will only accept commands issued in
//   // a guild.
//   if (!msg.channel.guild) {
//     return;
//   }

//   // Ignore any message that doesn't start with the correct prefix.
//   if (!content.startsWith(PREFIX)) {
//       return;
//   }

//   // Extract the parts of the command and the command name
//   const parts = content.split(' ').map(s => s.trim()).filter(s => s);
//   const commandName = parts[0].substr(PREFIX.length);

//   // Get the appropriate handler for the command, if there is one.
//   const commandHandler = commandHandlerForCommandName[commandName];
//   if (!commandHandler) {
//       return;
//   }

//   // Separate the command arguments from the command prefix and command name.
//   const args = parts.slice(1);

//   try {
//       // Execute the command.
//       await commandHandler(msg, args);
//   } catch (err) {
//       console.warn('Error handling command');
//       console.warn(err);
//   }
// });

// function roll(min, max) { // min and max included 
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }