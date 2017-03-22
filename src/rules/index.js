const rule0 = (friendCount,selfValue)=>friendCount > 0 || selfValue;
const rule2 = (friendCount,selfValue)=>{
    if (friendCount === 1 || friendCount === 4) {
        return true;
    } else {
        return selfValue;
    }
};