import fs from 'fs'
const treasureTable = JSON.parse(fs.readFileSync('./data/treasureTable.json'))


export default {
  name: 'treasure',
  description: 'Generates Frostgrave treasure.',
  execute: (msg, args) => {
      // const mention = args[0];
      const treasureRoll = roll(1,20).toString()
      // const treasureRoll = roll(6,7).toString()
      
      let treasure = treasureTable["treasure"][treasureRoll]
      let resp = ""
      let diceRolls = treasureRoll 
      if (treasure.gold){
        let gold = treasure.gold
        if (treasure.multiplier){
          const goldRoll = roll(1,20)
          gold = goldRoll * gold
          diceRolls += `,${goldRoll}`
        }
        resp += `Gold: ${gold} \n`
      }
      
      
      if(treasure.type == "Potions"){
        let potionsString = "Potions: "
        for (let i = 0; i < treasure.amount; i++){
          let rll = roll(0,19)
          diceRolls += `,${rll+1}`
          if (rll < 18){
            potionsString += treasureTable["potions"][rll] + ", "
          }else{
            const rll2 = roll(0,9)
            potionsString += treasureTable["greater_potions"][rll] + ", "
            diceRolls += `,${rll2 * 2}`
          }
        }
    
        resp += potionsString + '\n'
      }
      else if (treasure.type == "Scrolls" || treasure.type == "Grimoire"){
        let string = `${treasure.type}: `
        for (let i = 0; i < treasure.amount; i++){
          let rll, rll2 
          rll = roll(1,20)
          diceRolls += `,${rll}`
          if (rll <= 5){
            rll2 = roll(1,19)
            string += treasureTable["spells"]["5"][rll2] + ", "
            diceRolls += `,${rll2+1}`
          }
          else if (rll <= 10){
            rll2 = roll(1,19)
            string += treasureTable["spells"]["10"][rll2] + ", "
            diceRolls += `,${rll2+1}`
          }
          else if (rll <= 15){
            rll2 = roll(1,19)
            string += treasureTable["spells"]["15"][rll2] + ", "
            diceRolls += `,${rll2+1}`
          }
          else if (rll <= 20){
            rll2 = roll(1,19)
            string += treasureTable["spells"]["20"][rll2] + ", "
            diceRolls += `,${rll2+1}`
          }
          
        }
    
        resp += string + '\n'
      }
      else if (treasure.type == "Magic Weapon/Armour"){
        let string = `${treasure.type}: `
        for (let i = 0; i < treasure.amount; i++){
          let rll = roll(0,19)
    
          string += treasureTable["weapon/armour"][rll]
          diceRolls += `,${rll+1}`
          
        }
    
        resp += string + '\n'
      }
      else if (treasure.type == "Magic item"){
        let string = `${treasure.type}: `
        for (let i = 0; i < treasure.amount; i++){
          let rll = roll(0,19)
    
          string += treasureTable["items"][rll]
          diceRolls += `,${rll+1}`
          
        }
    
        resp = `${string} \n`
      }
    
      
      resp = `Dice Rolls: (${diceRolls})\n${resp}`

      return msg.createMessage(resp);
    }
  }

function roll(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
