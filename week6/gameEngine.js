const GameEngine = (function () {
    let dealerChips = 1000;
    let playerWallet = 100;
    let leftCard = 0;
    let rightCard = 0;
    let currentBet = 0;

    const cardFiles = {
        1: 'ace.png', 2: 'two.png', 3: 'three.png', 4: 'four.png',
        5: 'five.png', 6: 'six.png', 7: 'seven.png', 8: 'eight.png',
        9: 'nine.png', 10: 'ten.png', 11: 'jack.png', 12: 'queen.png', 13: 'king.png'
    };

    function getCardImagePath(val) {
        return `/img/${cardFiles[val]}`;
    }

    function resetGame() {
        dealerChips = 1000;
        playerWallet = 100;
        leftCard = 0;
        rightCard = 0;
        currentBet = 0;
    }

    function getRandomCard() {
        return Math.floor(Math.random() * 13) + 1;
    }

    function generatePosts() {
        leftCard = getRandomCard();
        rightCard = getRandomCard();

        if (leftCard > rightCard) {
            let temp = leftCard;
            leftCard = rightCard;
            rightCard = temp;
        }

        return {
            leftVal: leftCard,
            rightVal: rightCard,
            leftImg: getCardImagePath(leftCard),
            rightImg: getCardImagePath(rightCard),
            isTooClose: Math.abs(leftCard - rightCard) <= 1
        };
    }

    function evaluateShoot(shootVal) {
        let min = Math.min(leftCard, rightCard);
        let max = Math.max(leftCard, rightCard);
        let resultMsg = "";

        if (shootVal > min && shootVal < max) {
            playerWallet += currentBet * 2;
            dealerChips -= currentBet * 2;
            resultMsg = `Inside the gate! You won $${currentBet * 2}!`;
        } else if (shootVal === min || shootVal === max) {
            playerWallet -= currentBet * 2;
            dealerChips += currentBet * 2;
            resultMsg = `Hit the post! Lost double -$${currentBet * 2}!`;
        } else {
            playerWallet -= currentBet;
            dealerChips += currentBet;
            resultMsg = `Outside the gate! Lost bet -$${currentBet}!`;
        }

        return {
            msg: resultMsg,
            dealer: dealerChips,
            wallet: playerWallet,
            isGameOver: playerWallet < 1 || dealerChips < 1
        };
    }

    return {
        reset: resetGame,
        generatePosts: generatePosts,
        evaluate: evaluateShoot,
        setBet: function (bet) { currentBet = bet; },
        getWallet: function () { return playerWallet; },
        getDealer: function () { return dealerChips; },
        getImagePath: getCardImagePath
    };
})();