const Chance = require('chance');
const math = require('mathjs');
const d3 = require('d3');

function rotate(cx, cy, x, y, angle) {
    const radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

const generateRandomTreeParameters = (seed)=>{
    const chance = new Chance(seed);
    // console.log("Generate..",seed);
    // const steps = chance.integer({min:2,max:6});
    return {
        angleChange: chance.integer({min:10, max:135}),
        steps: chance.integer({min:2,max:4}),
        branches: chance.integer({min:2,max:6}),
        variants:chance.integer({min:2,max:4}),
        // spiralness: chance.integer({min:-8,max:8}),
        spiralness: 0,
    }
};

const generateGlyph = (seed)=>{
    const chance = new Chance(seed);
    const width = 100;
    const height = 100;

    const nodeCount = chance.integer({min:1,max:6});
    const initialDistance = (nodeCount === 1) ? 0 : chance.integer({min:10,max:40});
    const nodes = [];
    const nodeAngle = 360 / nodeCount;
    const centerPoint = {
        x: width / 2,
        y: height / 2
    };

    for (let i = 0; i < nodeCount; i++) {
        const angle = nodeAngle * i;
        const [x,y] = rotate(centerPoint.x,centerPoint.y,centerPoint.x,centerPoint.y + initialDistance, angle);
        let newPoint = {
            x,
            y,
            prevX:x,
            prevY:y,
            distance:initialDistance
        };
        nodes.push(newPoint);
    }

    return nodes;

};

const generateTree = ({steps,angleChange,branches,variants, spiralness})=>{
    const width = 100;
    const height = 100;
    const initialDistance = height / math.phi / math.phi / steps * 4;

    let allBranches = [];
    for (let i = 0; i <= branches; i++) {
    // for (let i = 0; i <= 0; i++) {
        let angle = 180 + 360 / branches * i;
        // console.log("Angle?",angle);
        const startingPoint = {
            x: width / 2,
            y: height / 2,
            prevX: width / 2,
            prevY: height / 2,
            angle,
            distance:initialDistance
        };

        let branchesLastStep = [startingPoint];

        for (let i = 0; i < steps; i++) {
            const branchesThisStep = [];
            branchesLastStep.forEach(branch=>{
                let variantCases = [];
                // const minAngle = branch.angle - angleChange - spiralness;
                // const minAngle = branch.angle - angleChange / variants;
                const minAngle = branch.angle - angleChange + spiralness;
                const maxAngle = branch.angle + angleChange + spiralness;
                const angleIncrement = (maxAngle - minAngle) / variants;

                for (let j = 0; j <= variants; j++) {
                // for (let j = 0; j < 1; j++) {
                    const angle = minAngle + angleIncrement * j;
                    variantCases.push(angle);

                    // const maxAngle = branch.angle - angleChange / 4;
                    // const scale = d3.scaleLinear()
                    //     .domain(minAngle,maxAngle)
                    //     .range()
                }

                // [branch.angle + angleChange, branch.angle - angleChange, branch.angle].forEach(newAngle=>{
                variantCases.forEach(newAngle=>{
                    const distance = branch.distance / math.phi;
                    const [x,y] = rotate(branch.x,branch.y, branch.x, branch.y + distance, newAngle);

                    branchesThisStep.push({
                        prevX:branch.x,
                        prevY:branch.y,
                        x,
                        y,
                        angle: newAngle,
                        distance
                    })
                })
            });
            allBranches = [...allBranches, ...branchesLastStep];
            branchesLastStep = branchesThisStep;
        }
    }



    return allBranches;

}

module.exports = {
    generateTree,
    generateRandomTreeParameters,
    generateGlyph
}