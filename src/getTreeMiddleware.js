const Chance = require('chance');
const {generateTree, generateRandomTreeParameters, generateGlyph } = require('./../src/tree');

const tinycolor = require("tinycolor2");
const math = require('mathjs');

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

const getTreeMIddleware = ()=>{
    const cache = {};
    return (req,res)=>{

        const seed = (req.params.key || Object.values(req.params)[0]);
        if (cache[seed]) {
            return res.status(200).send(cache[seed])
        }
        const chance = new Chance(seed);
        const height = req.query.height || 100;
        const width = req.query.width || 100;
        const colorMenu = formulateColorMenu();
        const colors = chance.pick(colorMenu,6);
        const params = generateRandomTreeParameters(seed);
        params.width = width;
        params.height = height;
        params.seed = seed;
        const tree = generateTree(params);
        const nodes = generateGlyph(params);
        const svg = `
<svg width=${width} height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="400" height="180">
    <rect width="${width}" height="${height}" x="0" y="0" fill="${colors[0]}"></rect>
     <rect width=${width / math.phi} height=${height / math.phi} x=${(width - width / math.phi) / 2} y=${(height - height / math.phi) / 2} fill="white"></rect>
    ${tree.map((element)=>(`
        <line x1=${element.prevX} y1=${element.prevY} x2=${element.x} y2=${element.y} stroke-width=${0.1 * element.distance} stroke="${colors[2]}"></line>
    `))}
    ${nodes.map((element,i)=>(`
       <circle cx=${element.x} cy=${element.y} r=${(element.distance === 0) ? (math.phi * 4) : element.distance / 2 / math.phi / math.phi } fill="${colors[3]}" stroke="${colors[4]}" stroke-width="${element.distance * 0.04}"></circle>
    `))}
</svg>
`;
        cache[seed] = svg;

        res
            .status(200)
            .send(svg)
    };
}


const getNavatarMiddleware = ()=>{
    return getTreeMIddleware();
}

module.exports = {
    getNavatarMiddleware
}