const navatar = require('./../src/navatar');
const Chance = require('chance');

const getRandomRule = (seed = undefined, count = 3)=>{
    const chance = new Chance(seed);
    const rule = [];
    for (var i =0; i < count; i++) {
        rule.push(chance.bool());
    }
    return rule;
}

const getLinearMachine = ({height,width})=>(seed)=>{

    const rule = getRandomRule(seed, 3);
    const chance = new Chance(seed);

    // const rule = [chance.bool(),chance.bool(),chance.bool()];

    const levels = [];

    for (let i = 0; i < height; i++) {
        const newLevel = [];
        levels.push(newLevel);
        for (let j = 0; j < width; j++) {
            if (i === 0) {
                newLevel.push(chance.bool());
            }
            else {
                let previousLevel = levels[i - 1];
                let previousSet = [(j === 0) ? false : previousLevel[j - 1], previousLevel[j], (j === width - 1) ? false : previousLevel[j + 1]];
                const value = rule.every((r,i)=>r===previousSet[i]);
                newLevel.push(value);
            }
        }
    }
    return levels;
};


// const getNextLevel = (prevLevel,rule)=>{
//
// };

const navatarMiddleware = (req,res)=>{
    const seed = req.params.key || Object.values(req.params)[0];
    const chance = new Chance(seed);
    const height = 100;
    const width = 100;
    const levels = getLinearMachine({height,width})(seed);
    const colorA = chance.color();
    const colorB = `rgb(240,240,240)`;
    const colorC = chance.color();
    const colorD = chance.color();

    res.status(200).send(
        `
<svg width=${width * 10} height="${height * 10}">
    ${levels.map((level,i)=>(`
        ${level.map((element,j)=>(`
            <rect y=${10*i} x=${10*j} width="10" height="10" fill="${element ? colorA : colorB}"></rect>
        `))}
    `))}
</svg>
`)
}

const express = require(`express`);
const app = new express();

app.use('/avatar/:key.svg',navatarMiddleware);

app.listen(7777);