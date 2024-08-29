const { SlashCommandBuilder } = require('discord.js');
const treasureTable = require('../../data/treasureTable.json')
const soldierTable = require('../../data/soldiers.json')
const injuryTable = require('../../data/injuryTable.json')
const {roll} = require("../../utils.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('injury')
		.setDescription('Rolls for injury for [Soldier/Spellcaster]')
    .addStringOption(option =>
      option.setName('fightertype')
        .setDescription('Spellcaster or Soldier?')
        .setRequired(true)
        .addChoices(
          { name: 'Soldier', value: 'soldier' },
          { name: 'Spellcaster', value: 'spellcaster' },
        ))
    .addStringOption(option =>
      option.setName('fightername')
        .setDescription('The name or class of the fighter.')
        .setRequired(true)
        .setAutocomplete(true)),
    async execute(interaction) {
      const fightertype = interaction.options.getString('fightertype')
      const fighterName = interaction.options.getString('fightername')
      const injuryRoll = roll(1,20)
      let rollString = `Dice Rolls: (${injuryRoll}`
      let responseString = ""

      if (fightertype == 'spellcaster'){
        if (injuryRoll <= 2){
          responseString += `${fighterName} is Dead.`
        }
        else if (injuryRoll <= 4){
          //Pemananent Injury
          const permInjuryRoll = roll(1,20)
          const injury = rollForPermanentInjury(permInjuryRoll)
          responseString += `${fighterName} is Permanently Injured: ${injury.injury}`
          rollString += `,${permInjuryRoll}`
        }
        else if (injuryRoll <= 6){
          responseString += `${fighterName} was Badly Wounded. (Miss next game)`
        }
        else if (injuryRoll <= 8){
          responseString += `${fighterName} had a Close Call. (Lost carried Items)`
        }else{
          responseString += `${fighterName} has made a Full Recovery`
        }
      }
      else{
        if (injuryRoll <= 4){
          responseString += `${fighterName} is Dead.`
        }
        else if (injuryRoll <= 8){
          responseString += `${fighterName} was Badly Wounded. (Miss next game)`
        }
        else {
          responseString += `${fighterName} has made a Full Recovery`
        }
      }
      
      responseString += `\n${rollString})`
      console.log(responseString)
      await interaction.reply(responseString);
    },
    async autocomplete(interaction) {
      const focusedValue = interaction.options.getFocused();
      const filtered = soldierTable.filter(choice => choice.startsWith(focusedValue));
      await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
      );
    },
}

function rollForPermanentInjury(r){
  let injuryRoll = r.toString()
  for ([key,obj] of Object.entries(injuryTable)){
    const results = key.split(',')
    for (let res of results){
      if (injuryRoll == res){
        return injuryTable[key]
      }
    }
  }
}