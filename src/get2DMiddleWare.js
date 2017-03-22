const fs = require('fs');
const PNG = require('pngjs').PNG;
const Chance = require('chance');
// const chance = new require('chance')();

const cellsToSVG = (cells, steps)=>{
    const scale = 10;
    return `
<svg width=${(steps + 0.5) * 2 * scale} height=${(steps + 0.5) * 2 * scale}>
    ${cells.map(({x,y,value})=>(`
        <rect x=${x * scale} y=${y * scale} height=${scale} width=${scale} fill=${value ? "black" : "white"}></rect>
    `))};
</svg>
`
}
const get2DMiddleWare = ({steps=12} = {})=>{
    const cache = {};
    return (req,res)=>{
        const seed = req.params.key;
        if (cache[seed]) {
            return res.send(cache[seed]);
        }

        // const seed = undefined;
        const chance = new Chance(seed);
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

        let currentCells = [];
        currentCells.push({
            x: steps,
            y: steps,
            value: true
        });

        const rule0 = (friendCount,selfValue)=>friendCount > 0 || selfValue;
        const rule2 = (friendCount,selfValue)=>{
            if (friendCount === 1 || friendCount === 4) {
                return true;
            } else {
                return selfValue;
            }
        };
        //
        const rule3 = ()=>{
            const selfWhiteAllWhite = chance.bool();
            const selfBlackAllWhite = chance.bool();
            const black1 = chance.bool();
            const black2 = chance.bool();
            const black3 = chance.bool();
            const black4 = chance.bool();

            return (friendCount,selfValue)=>{

                if (friendCount === 0) {
                    // return selfValue;
                    if (selfValue) {
                        // return selfWhiteAllWhite;
                        return false;
                    } else {
                        return true;
                    }
                }
                if (friendCount === 1) {
                    // return black1;
                    return true;
                }
                if (friendCount === 2) {
                    return black2;
                }

                if (friendCount === 3) {
                    return black3;
                }

                if (friendCount === 4) {
                    return black4;
                }
                return true;
            };
        }

        // const rule = rule2;
        const rule = rule3();
        // const rule = rule2;
        for (let i = 0; i < steps; i++) {
            // debugger;
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
                    // value:rule(neighbourPreviousStates)
                });
            });
        }
        const svg = cellsToSVG(currentCells, steps);
        cache[seed] = svg;

        res.send(svg);
    };
}

module.exports = {
    get2DMiddleWare
};

// get2DMiddleWare()({},{send:()=>{}});