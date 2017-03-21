const navatar = require('./../src/navatar');
const Chance = require('chance');
const {generateTree, generateRandomTreeParameters, generateGlyph } = require('./tree');
const tinycolor = require("tinycolor2");
const math = require('mathjs');

const navatarMiddleware = (req,res)=>{

    // const seed = Math.random();
    // console.log("Generating...",seed);
    const seed = (req.params.key || Object.values(req.params)[0]) + new Date().getTime();
    const chance = new Chance(seed);
    const height = 100;
    const width = 100;

    // const color = chance.color();
    const colorMenu = tinycolor("blue").tetrad().reduce((array,color)=>{
        array = array.concat(tinycolor(color).monochromatic());
        return array;
    },[]).map(color=>color.toString("rgb"));
    // const complement = tinycolor(color).tetrad();
    //
    // const colorB = tinycolor
    // const colors = tinycolor(color).tetrad().map(color=>color.toString("rgb"));
    const colors = [chance.pick(colorMenu),chance.pick(colorMenu),chance.pick(colorMenu),chance.pick(colorMenu)];
    // const colors2 = complement.monochromatic().map(color=>color.toString("rgb"));

    const tree = generateTree(generateRandomTreeParameters(seed));
    // const nodes = generateTree(generateRandomTreeParameters(seed,{
    //     steps:2
    // }));
    const nodes = generateGlyph(seed);

    res.status(200).send(
        `
<svg width=${width} height="${height}">
    <rect width="100" height="100" x="0" y="0" fill="${colors[0]}"></rect>
     <!--<rect width=${100 / math.phi} height=${100 / math.phi} x=${(100 - 100 / math.phi) / 2} y=${(100 - 100 / math.phi) / 2} fill="white"></rect>-->
    ${tree.map((element)=>(`
        <!--<rect x=${element.x} y=${element.y} height="1" width="1"></rect>-->
        <line x1=${element.prevX} y1=${element.prevY} x2=${element.x} y2=${element.y} stroke-width=${0.1 * element.distance} stroke="${colors[2]}"></line>
    `))}
    ${nodes.map((element,i)=>(`
       <circle cx=${element.x} cy=${element.y} r=${(element.distance === 0) ? (math.phi * 4) : element.distance / 2 / math.phi / math.phi } fill="${colors[3]}" stroke="${colors[4]}" stroke-width="${element.distance * 0.1}"></circle>
    `))}
    
</svg>
`)
}

const express = require(`express`);
const app = new express();

app.use('/avatar/:key.svg',navatarMiddleware);

app.listen(7777);
//<!--<circle cx=${element.x} cy=${element.y} r=${0.1 * element.distance} fill="${colors2[3]}" stroke="${colors2[1]}" stroke-width="${element.distance * 0.01}"></circle>-->