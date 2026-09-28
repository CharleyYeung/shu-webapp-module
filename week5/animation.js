// Import Game Engine Module
import { getMarblePath } from './gameEngine.js';

// DOM Content Loaded Handler
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const statusDisplay = document.getElementById('status-display');
    const container = document.getElementById("container");

    let simulationTimer = null;
    let binCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Update Histogram Heights and Data Display
    function updateHistogram() {
        let maxCount = Math.max(...Object.values(binCounts));
        if (maxCount === 0) maxCount = 1;

        for (let i = 0; i < 6; i++) {
            let count = binCounts[i];
            let binElement = document.getElementById(`bin-${i}`);
            if (binElement) {
                let barHeight = (count / maxCount) * 50;
                binElement.style.height = barHeight + 'px';
                binElement.innerText = count > 0 ? count : '';
            }
        }
    }

    // Spawn and Animate Single Marble
    function dropSingleMarble() {
        if (!container) return;
        const { path, rightCount } = getMarblePath(5);

        // Create Marble Element
        const marble = document.createElement("div");
        marble.classList.add("marble");

        let currentX = 195;
        let currentY = 0;
        let levelIndex = 0;

        marble.style.top = currentY + 'px';
        marble.style.left = currentX + 'px';
        container.appendChild(marble);

        // Step-by-Step Fall Animation Loop
        let stepTimer = setInterval(() => {
            if (levelIndex >= path.length) {
                clearInterval(stepTimer);

                // Determine Target Bin using rightCount
                let targetBin = rightCount;
                if (targetBin > 5) targetBin = 5;
                if (targetBin < 0) targetBin = 0;

                // Remove Marble
                marble.remove();

                // Update Statistics and Histogram
                binCounts[targetBin]++;
                updateHistogram();
                return;
            }

            let direction = path[levelIndex];
            if (direction === 0) {
                currentX -= 20;
            } else {
                currentX += 20;
            }
            currentY += 38; 

            marble.style.left = currentX + 'px';
            marble.style.top = currentY + 'px';

            levelIndex++;
        }, 200);
    }

    // Setup Button Controls and Status Handling
    function setupControls() {
        if (!startBtn) return;

        startBtn.onclick = function () {
            statusDisplay.innerText = "Running...";
            if (simulationTimer) clearInterval(simulationTimer);

            dropSingleMarble();
            simulationTimer = setInterval(() => {
                dropSingleMarble();
            }, 1000);
        };

        stopBtn.onclick = function () {
            statusDisplay.innerText = "Stopped";
            clearInterval(simulationTimer);
            simulationTimer = null;
        };

        resetBtn.onclick = function () {
            statusDisplay.innerText = "Reset";
            clearInterval(simulationTimer);
            simulationTimer = null;

            // Clear Active Marbles
            const activeMarbles = container.querySelectorAll(".marble");
            activeMarbles.forEach(m => m.remove());

            // Reset Counters and Histogram
            binCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            updateHistogram();
        };

        [startBtn, stopBtn, resetBtn].forEach(btn => {
            btn.onmouseover = function () {
                if (!simulationTimer || btn !== startBtn) {
                    statusDisplay.innerText = `Ready: ${btn.innerText}`;
                }
            };
            btn.onmouseleave = function () {
                statusDisplay.innerText = simulationTimer ? "Running..." : "Idle";
            };
        });
    }

    setupControls();
});
