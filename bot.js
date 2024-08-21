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
