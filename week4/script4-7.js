const diceImages = [
    "../week1/img/one.svg",
    "../week1/img/two.svg",
    "../week1/img/three.svg",
    "../week1/img/four.svg",
    "../week1/img/five.svg",
    "../week1/img/six.svg"
];

const rollBtn = document.getElementById("roll-btn");
const playerCard = document.getElementById("player-card");
const computerCard = document.getElementById("computer-card");
const playerImg = document.getElementById("player-img");
const computerImg = document.getElementById("computer-img");
const resultBox = document.getElementById("result-box");
const resultViewer = document.getElementById("result-viewer");


let isGameFinished = false;

rollBtn.addEventListener("click", function () {

    if (isGameFinished) {
        playerCard.classList.remove("is-flipped");
        computerCard.classList.remove("is-flipped");
        resultViewer.style.backgroundImage = "url('../week1/img/Cloudy-wait.jpg')";
        resultBox.innerHTML = "Click the button to start!";
        rollBtn.innerHTML = "Click to Roll";
        isGameFinished = false;
        return;
    }

    // Game Logic
    rollBtn.disabled = true;
    playerCard.classList.remove("is-flipped");
    computerCard.classList.remove("is-flipped");
    resultBox.innerHTML = "You are rolling your dice...";

    let playerIndex = Math.floor(Math.random() * 6);
    let computerIndex = Math.floor(Math.random() * 6);
    let playerRoll = playerIndex + 1;
    let computerRoll = computerIndex + 1;

    // Player rolls first, then computer rolls after a short delay
    setTimeout(function () {
        playerImg.src = diceImages[playerIndex];
        playerCard.classList.add("is-flipped");
        resultBox.innerHTML = `You rolled <strong>${playerRoll}</strong>. Computer is rolling...`;

        // Computer rolls after a short delay to simulate suspense
        setTimeout(function () {
            computerImg.src = diceImages[computerIndex];
            computerCard.classList.add("is-flipped");

            // View the result after both have rolled
            if (playerRoll > computerRoll) {
                resultBox.innerHTML = `You (${playerRoll}) vs Computer (${computerRoll})  <strong>You Win! </strong>`;
                resultViewer.style.backgroundImage = "url('../week1/img/Cloudy-win.jpeg')";
            } else if (playerRoll < computerRoll) {
                resultBox.innerHTML = `You (${playerRoll}) vs Computer (${computerRoll})  <strong>Computer Wins! </strong>`;
                resultViewer.style.backgroundImage = "url('../week1/img/Cloudy-lose.jpeg')";
            } else {
                resultBox.innerHTML = `Both rolled ${playerRoll}  <strong>It's a Draw! </strong>`;
                resultViewer.style.backgroundImage = "url('../week1/img/Cloudy-draw.jpeg')";
            }

            rollBtn.innerHTML = "Reset Game";
            rollBtn.disabled = false;
            isGameFinished = true;
        }, 1000);

    }, 500);
});
