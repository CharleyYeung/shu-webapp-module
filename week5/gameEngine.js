export function getMarblePath(totalLevels = 5) {
    let path = [];
    let rightCount = 0;

    for (let i = 0; i < totalLevels; i++) {
        let move = Math.random() < 0.5 ? 0 : 1; // 0=left, 1=right
        path.push(move);
        rightCount += move;
    }

    return { path, rightCount };
}