const Chance = require('chance');
const math = require('mathjs');

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
    return {
        angleChange: chance.integer({min:10, max:135}),
        steps: chance.integer({min:2,max:4}),
        branches: chance.integer({min:2,max:6}),
        variants:chance.integer({min:2,max:4}),
        spiralness: 0,
    }
};

const generateGlyph = ({seed,width = 100,height = 100})=>{
    const chance = new Chance(seed);
    const nodeCount = chance.integer({min:1,max:6});
    const initialDistance = (nodeCount === 1) ? 0 : chance.floating({min:height * 0.1,max:height * 0.4});
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

const generateTree = ({steps,angleChange,branches,variants, spiralness,width = 100,height = 100})=>{
    const initialDistance = height / math.phi / math.phi / steps * 4;

    let allBranches = [];
    for (let i = 0; i <= branches; i++) {
        let angle = 180 + 360 / branches * i;
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
                const minAngle = branch.angle - angleChange + spiralness;
                const maxAngle = branch.angle + angleChange + spiralness;
                const angleIncrement = (maxAngle - minAngle) / variants;

                for (let j = 0; j <= variants; j++) {
                    const angle = minAngle + angleIncrement * j;
                    variantCases.push(angle);
                }

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