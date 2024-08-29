import {roll} from '../utils.js'

export default {
  name: 'injury',
  description: 'Rolls for injury for [Soldier/Spellcaster]',
  argsRequires: true,
  execute: (msg, args) => {
    console.log(msg)
    // console.log(args)
    const injuryRoll = roll(1,20)
    msg.createMessage(injuryRoll)
  }
}