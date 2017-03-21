const navatar = require('./../src/navatar');
const Chance = require('chance');
const {generateTree, generateRandomTreeParameters, generateGlyph } = require('./tree');
const tinycolor = require("tinycolor2");
const math = require('mathjs');
const svg2png = require("svg2png");


const formulateColorMenu = ()=>{
    const colorMenu = tinycolor("blue")
        .tetrad()
        .reduce((array,color)=>{
            array = array.concat(tinycolor(color).analogous());
            return array;
        },[])
        .reduce((array,color)=>{
            array = array.concat(tinycolor(color).monochromatic());
            return array;
        },[])
        .map(color=>color.toString("rgb"));

    return colorMenu;
}

const getNavatarMiddleware = ({encoding = 'svg'} = {})=>{
    return (req,res)=>{
        console.log("navatar...",encoding);

        const seed = (req.params.key || Object.values(req.params)[0]);
        const chance = new Chance(seed);
        const height = 100;
        const width = 100;
        const colorMenu = formulateColorMenu();
        const colors = chance.pick(colorMenu,6);
        const tree = generateTree(generateRandomTreeParameters(seed));
        const nodes = generateGlyph(seed);
        const svg = `
<svg width=${width} height="${height}">
    <rect width="100" height="100" x="0" y="0" fill="${colors[0]}"></rect>
     <rect width=${100 / math.phi} height=${100 / math.phi} x=${(100 - 100 / math.phi) / 2} y=${(100 - 100 / math.phi) / 2} fill="white"></rect>
    ${tree.map((element)=>(`
        <line x1=${element.prevX} y1=${element.prevY} x2=${element.x} y2=${element.y} stroke-width=${0.1 * element.distance} stroke="${colors[2]}"></line>
    `))}
    ${nodes.map((element,i)=>(`
       <circle cx=${element.x} cy=${element.y} r=${(element.distance === 0) ? (math.phi * 4) : element.distance / 2 / math.phi / math.phi } fill="${colors[3]}" stroke="${colors[4]}" stroke-width="${element.distance * 0.1}"></circle>
    `))}
</svg>
`;
        if (encoding === 'png') {
            console.log("Sending png data...");
            const png = svg2png(svg)
                .then(buffer=>{
                    res
                        // .header(`AddType`,`image/png`)
                        .contentType('image/png')
                        .status(200)
                        .send(buffer);
                })

        } else {
            res
                .status(200)
                .send(svg)
        }



    };
}


const express = require(`express`);
const app = new express();

app.use('/avatar/:key.svg',getNavatarMiddleware({encoding:'svg'}));
app.use('/avatar/:key.png',getNavatarMiddleware({encoding:'png'}));
app.use('/',express.static('demo/public'));

const port = 7777;
app.listen(port,()=>{
    console.info(`Navatar demo is listening on Port ${port}.`);
});
