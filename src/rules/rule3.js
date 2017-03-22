const Chance = require('chance');

module.exports = {
    rule3(seed){
        const chance = new Chance(seed);
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
}