const { rule3 } = require('./rules/rule3');
const Chance = require('chance');
const d3 = require('d3');

const cellsToSVG = (cells, steps, seed, width, height)=>{
    const colors = d3.schemeCategory20;
    const chance = new Chance(seed);
    const color1 = chance.pick(colors);
    const color2 = "white";
    const scale = (width / 250) * 10;
    return `
<svg width=${(steps + 0.5) * 2 * scale} height=${(steps + 0.5) * 2 * scale}>
    ${cells.map(({x,y,value})=>(`
        <rect x=${x * scale} y=${y * scale} height=${scale} width=${scale} fill=${value ? color1 : color2}></rect>
    `))};
</svg>
`
}

const cellEquals = (cell)=>({x,y})=>cell.x===x&&cell.y===y;
const Data = (cells)=>({
    findCell({x,y}){
        return cells.find(cell=>cell.x === x && cell.y===y);
    },
    getCell({x,y}){
        const cell = this.findCell({x,y});
        if (cell) {
            return cell;
        } else {
            return {x,y,value:false};
        }
    },
    mutate({x,y,value}){
        if (!this.findCell({x,y})) {
            return [...cells,{x,y,value}];
        } else {
            return cells.map(cell=>cellEquals(cell)({x,y}) ? {x,y,value} : cell);
        }
    },
    getNeighbourCells({x,y}){
        return [{x, y:y + 1},{x, y:y - 1},{x:x - 1, y},{x:x + 1, y}].map(coord=>this.getCell(coord));
    }
});

const get2DMiddleWare = ({steps=12} = {})=>{
    const cache = {};
    return (req,res)=>{
        const width = req.query.width || 100;
        const height = req.query.height || 100;
        const seed = req.params.key;
        if (cache[seed]) {
            return res.send(cache[seed]);
        }

        let currentCells = [{
            x: steps,
            y: steps,
            value: true
        }];

        const rule = rule3(seed);
        for (let i = 0; i < steps; i++) {
            const prevData = Data(currentCells);
            currentCells.forEach(cell=>{
                const neighbours = prevData.getNeighbourCells(cell);

                const newVal = rule(neighbours.filter(n=>n.value).length,cell.value);

                neighbours.forEach(neighbour=>{
                    if (!Data(currentCells).findCell(neighbour)) {
                        currentCells = Data(currentCells).mutate(neighbour);
                    }
                });

                currentCells = Data(currentCells).mutate({
                    x:cell.x,
                    y:cell.y,
                    value:newVal
                });
            });
        }
        const svg = cellsToSVG(currentCells, steps, seed, width, height);
        cache[seed] = svg;

        res.send(svg);
    };
};

module.exports = {
    get2DMiddleWare
};