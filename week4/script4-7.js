const diceImages = [
    "../Week1/My First Web App/img/one.svg",
    "../Week1/My First Web App/img/two.svg",
    "../Week1/My First Web App/img/three.svg",
    "../Week1/My First Web App/img/four.svg",
    "../Week1/My First Web App/img/five.svg",
    "../Week1/My First Web App/img/six.svg"
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
        resultViewer.style.backgroundImage = "url('../Week1/My First Web App/img/Cloudy-wait.JPG')";
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
                resultBox.innerHTML = `You (${playerRoll}) vs Computer (${computerRoll}) 👉 <strong>You Win! 🎉</strong>`;
                resultViewer.style.backgroundImage = "url('../Week1/My First Web App/img/Cloudy-win.JPG')";
            } else if (playerRoll < computerRoll) {
                resultBox.innerHTML = `You (${playerRoll}) vs Computer (${computerRoll}) 👉 <strong>Computer Wins! 😢</strong>`;
                resultViewer.style.backgroundImage = "url('../Week1/My First Web App/img/Cloudy-lose.JPG')";
            } else {
                resultBox.innerHTML = `Both rolled ${playerRoll} 👉 <strong>It's a Draw! 🤝</strong>`;
                resultViewer.style.backgroundImage = "url('../Week1/My First Web App/img/Cloudy-draw.JPG')";
            }

            rollBtn.innerHTML = "Reset Game";
            rollBtn.disabled = false;
            isGameFinished = true;
        }, 1000);

    }, 500);
});