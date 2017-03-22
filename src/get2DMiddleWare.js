const fs = require('fs');
const PNG = require('pngjs').PNG;
const chance = new require('chance')();

const cellsToSVG = (cells)=>{
    const scale = 10;
    return `
<svg width="1000" height="1000">
    ${cells.map(({x,y,value})=>(`
        <rect x=${x * scale} y=${y * scale} height=${scale} width=${scale} fill=${value ? "black" : "white"}></rect>
    `))};
</svg>
`
}
const get2DMiddleWare = ()=>(req,res)=>{
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
                const newCell = {x,y,value:false};
                return newCell;
            }
        },
        mutate({x,y,value}){
            if (!this.findCell({x,y})) {
                return [...cells,{x,y,value}];
            } else {
                return cells.map(cell=>cellEquals(cell)({x,y}) ? {x,y,value} : cell);
            }
        },
        getNeighbourCells({x,y,value}){
            return [{x, y:y + 1},{x, y:y - 1},{x:x - 1, y},{x:x + 1, y}].map(coord=>this.getCell(coord));
        }
    });

    const steps = 22;
    let currentCells = [];
    currentCells.push({
        x: 50,
        y: 50,
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
                    return selfWhiteAllWhite;
                } else {
                    return selfBlackAllWhite;
                }
            }
            if (friendCount === 1) {
                return black1;
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

    res.send(cellsToSVG(currentCells));
};

module.exports = {
    get2DMiddleWare
};

// get2DMiddleWare()({},{send:()=>{}});