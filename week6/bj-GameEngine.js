/**
 * Blackjack Game Engine
 * Handles game control logic, state management, deck creation, card mapping, and win/loss/bankruptcy checks.
 */

$(document).ready(function () {

    // --- State Variables & LocalStorage Loading ---
    let playerWallet = localStorage.getItem('bj_wallet') ? parseInt(localStorage.getItem('bj_wallet')) : 1000;
    let dealerChips = localStorage.getItem('bj_dealer') ? parseInt(localStorage.getItem('bj_dealer')) : 500;
    let cpu1Chips = localStorage.getItem('bj_cpu1') ? parseInt(localStorage.getItem('bj_cpu1')) : 500;
    let cpu2Chips = localStorage.getItem('bj_cpu2') ? parseInt(localStorage.getItem('bj_cpu2')) : 500;

    let hasDoubleReturn = localStorage.getItem('bj_double') === 'true';
    let hasPeekPlayer = localStorage.getItem('bj_peekP') === 'true';
    let hasPeekDealer = localStorage.getItem('bj_peekD') === 'true';

    let deck = [];
    let currentBet = 50;

    let hands = {
        dealer: [],
        cpu1: [],
        cpu2: [],
        player: []
    };

    updateWalletUI();
    updateShopUI();

    function saveGameProgress() {
        localStorage.setItem('bj_wallet', playerWallet);
        localStorage.setItem('bj_dealer', dealerChips);
        localStorage.setItem('bj_cpu1', cpu1Chips);
        localStorage.setItem('bj_cpu2', cpu2Chips);
        localStorage.setItem('bj_double', hasDoubleReturn);
        localStorage.setItem('bj_peekP', hasPeekPlayer);
        localStorage.setItem('bj_peekD', hasPeekDealer);
    }

    function updateWalletUI() {
        $('#player-wallet').text(playerWallet);
        $('#dealer-chips').text(dealerChips);
        $('#cpu1-chips').text(cpu1Chips);
        $('#cpu2-chips').text(cpu2Chips);
        updateShopUI();
    }

    // --- Shop UI State ---
    function updateShopUI() {
        if (hasDoubleReturn || playerWallet < 200) {
            $('#buy-double-btn').prop('disabled', true).css({ 'opacity': '0.5', 'cursor': 'not-allowed' });
        } else {
            $('#buy-double-btn').prop('disabled', false).css({ 'opacity': '1', 'cursor': 'pointer' });
        }

        if (hasPeekPlayer || playerWallet < 100) {
            $('#buy-peek-player-btn').prop('disabled', true).css({ 'opacity': '0.5', 'cursor': 'not-allowed' });
        } else {
            $('#buy-peek-player-btn').prop('disabled', false).css({ 'opacity': '1', 'cursor': 'pointer' });
        }

        if (hasPeekDealer || playerWallet < 150) {
            $('#buy-peek-dealer-btn').prop('disabled', true).css({ 'opacity': '0.5', 'cursor': 'not-allowed' });
        } else {
            $('#buy-peek-dealer-btn').prop('disabled', false).css({ 'opacity': '1', 'cursor': 'pointer' });
        }
    }

    // --- Card Mapping ---
    window.getCardImagePath = function (card) {
        let prefix = '';
        let folder = '../week1/img/';

        if (card.suit === 'spades') prefix = 's-';
        else if (card.suit === 'clubs') prefix = 'c-';
        else if (card.suit === 'diamonds') prefix = 'd-';
        else if (card.suit === 'hearts') prefix = '';

        let valName = '';
        switch (card.value) {
            case 'A': valName = 'ace'; break;
            case '2': valName = 'two'; break;
            case '3': valName = 'three'; break;
            case '4': valName = 'four'; break;
            case '5': valName = 'five'; break;
            case '6': valName = 'six'; break;
            case '7': valName = 'seven'; break;
            case '8': valName = 'eight'; break;
            case '9': valName = 'nine'; break;
            case '10': valName = 'ten'; break;
            case 'J': valName = 'jack'; break;
            case 'Q': valName = 'queen'; break;
            case 'K': valName = 'king'; break;
        }

        return `${folder}${prefix}${valName}.png`;
    }

    function createDeck() {
        const suits = ['hearts', 'spades', 'clubs', 'diamonds'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        deck = [];

        suits.forEach(suit => {
            values.forEach(val => {
                deck.push({ suit: suit, value: val });
            });
        });
        deck.sort(() => Math.random() - 0.5);
    }

    window.calculateHandScore = function (hand) {
        if (hand.length === 0) return 0;
        let score = 0;
        let aceCount = 0;

        hand.forEach(card => {
            if (card.value === 'A') {
                aceCount += 1;
                score += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        });

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }
        return score;
    }

    // --- Deal Action ---
    $('#deal-btn').click(function () {
        currentBet = parseInt($('#bet-input').val());
        if (isNaN(currentBet) || currentBet <= 0 || currentBet > playerWallet) {
            $('#result-message').text('Invalid bet amount! Check your wallet.');
            return;
        }

        playerWallet -= currentBet;
        dealerChips += currentBet;
        updateWalletUI();
        saveGameProgress();

        createDeck();

        hands.dealer = [deck.pop(), deck.pop()];
        hands.cpu1 = (cpu1Chips > 0) ? [deck.pop(), deck.pop()] : [];
        hands.cpu2 = (cpu2Chips > 0) ? [deck.pop(), deck.pop()] : [];
        hands.player = [deck.pop(), deck.pop()];

        if (window.renderTable) {
            window.renderTable(hands, cpu1Chips, cpu2Chips, true);
        }

        $('#bet-input').prop('disabled', true);
        $('#deal-btn').prop('disabled', true);
        $('#hit-btn').prop('disabled', false);
        $('#stand-btn').prop('disabled', false);
        $('#result-message').text('Your turn: Hit or Stand.');
    });

    // --- Hit Action with Bust Settlement & CPU Status ---
    $('#hit-btn').click(function () {
        hands.player.push(deck.pop());
        if (window.renderPlayer) {
            window.renderPlayer(hands.player, true);
        }

        if (calculateHandScore(hands.player) > 21) {
            $('#hit-btn').prop('disabled', true);
            $('#stand-btn').prop('disabled', true);

            setTimeout(() => {
                let message = 'You busted. Dealer wins!';
                dealerChips += currentBet;

                let dealerScore = calculateHandScore(hands.dealer);
                let cpuBet = 50;

                if (cpu1Chips > 0) {
                    cpu1Chips -= cpuBet;
                    dealerChips += cpuBet;
                    let cpu1Score = calculateHandScore(hands.cpu1);
                    if (cpu1Score > 21) {
                        $('#cpu1-score').text(cpu1Score + ' (Lose)');
                    } else if (dealerScore > 21 || cpu1Score > dealerScore) {
                        cpu1Chips += cpuBet * 2;
                        dealerChips -= cpuBet;
                        $('#cpu1-score').text(cpu1Score + ' (Win)');
                    } else if (cpu1Score === dealerScore) {
                        cpu1Chips += cpuBet;
                        $('#cpu1-score').text(cpu1Score + ' (Push)');
                    } else {
                        $('#cpu1-score').text(cpu1Score + ' (Lose)');
                    }
                }

                if (cpu2Chips > 0) {
                    cpu2Chips -= cpuBet;
                    dealerChips += cpuBet;
                    let cpu2Score = calculateHandScore(hands.cpu2);
                    if (cpu2Score > 21) {
                        $('#cpu2-score').text(cpu2Score + ' (Lose)');
                    } else if (dealerScore > 21 || cpu2Score > dealerScore) {
                        cpu2Chips += cpuBet * 2;
                        dealerChips -= cpuBet;
                        $('#cpu2-score').text(cpu2Score + ' (Win)');
                    } else if (cpu2Score === dealerScore) {
                        cpu2Chips += cpuBet;
                        $('#cpu2-score').text(cpu2Score + ' (Push)');
                    } else {
                        $('#cpu2-score').text(cpu2Score + ' (Lose)');
                    }
                }

                updateWalletUI();
                saveGameProgress();
                $('#result-message').text(message);

                if (playerWallet < 1) {
                    $('#next-btn').prop('disabled', true);
                    setTimeout(() => {
                        alert('You lose! Game Over.');
                        localStorage.clear();
                        location.reload();
                    }, 800);
                } else {
                    $('#next-btn').prop('disabled', false);
                }
            }, 900);
        }
    });

    // --- Stand Action ---
    $('#stand-btn').click(function () {
        $('#hit-btn').prop('disabled', true);
        $('#stand-btn').prop('disabled', true);
        executeCPUTurns();
    });

    function executeCPUTurns() {
        if (cpu1Chips > 0) {
            while (calculateHandScore(hands.cpu1) < 17) hands.cpu1.push(deck.pop());
        }
        if (cpu2Chips > 0) {
            while (calculateHandScore(hands.cpu2) < 17) hands.cpu2.push(deck.pop());
        }
        if (window.renderTable) {
            window.renderTable(hands, cpu1Chips, cpu2Chips, true);
        }
        executeDealerTurn();
    }

    function executeDealerTurn() {
        if (window.renderTable) {
            window.renderTable(hands, cpu1Chips, cpu2Chips, false);
        }
        while (calculateHandScore(hands.dealer) < 17) {
            hands.dealer.push(deck.pop());
            if (window.renderTable) {
                window.renderTable(hands, cpu1Chips, cpu2Chips, false);
            }
        }
        determineWinners();
    }

    // --- Chip Settlement and Status Update ---
    function determineWinners() {
        let dealerScore = calculateHandScore(hands.dealer);
        let playerScore = calculateHandScore(hands.player);
        let message = '';
        let profitMultiplier = hasDoubleReturn ? 2 : 1;

        if (playerScore > 21) {
            message = 'You busted. Dealer wins!';
        } else if (dealerScore > 21) {
            let payout = currentBet + (currentBet * profitMultiplier);
            playerWallet += payout;
            dealerChips -= (currentBet * profitMultiplier);
            message = hasDoubleReturn ? 'Dealer busted! You win! (Double Return!)' : 'Dealer busted! You win!';
        } else if (playerScore > dealerScore) {
            let payout = currentBet + (currentBet * profitMultiplier);
            playerWallet += payout;
            dealerChips -= (currentBet * profitMultiplier);
            message = hasDoubleReturn ? 'You beat the dealer! You win! (Double Return!)' : 'You beat the dealer! You win!';
        } else if (playerScore < dealerScore) {
            message = 'Dealer wins with a higher score.';
        } else {
            playerWallet += currentBet;
            message = 'It is a Tie (Push)! Bet refunded.';
        }

        let cpuBet = 50;

        if (cpu1Chips > 0) {
            cpu1Chips -= cpuBet;
            dealerChips += cpuBet;
            let cpu1Score = calculateHandScore(hands.cpu1);
            if (cpu1Score > 21) {
                $('#cpu1-score').text(cpu1Score + ' (Lose)');
            } else if (dealerScore > 21 || cpu1Score > dealerScore) {
                cpu1Chips += cpuBet * 2;
                dealerChips -= cpuBet;
                $('#cpu1-score').text(cpu1Score + ' (Win)');
            } else if (cpu1Score === dealerScore) {
                cpu1Chips += cpuBet;
                $('#cpu1-score').text(cpu1Score + ' (Push)');
            } else {
                $('#cpu1-score').text(cpu1Score + ' (Lose)');
            }
        }

        if (cpu2Chips > 0) {
            cpu2Chips -= cpuBet;
            dealerChips += cpuBet;
            let cpu2Score = calculateHandScore(hands.cpu2);
            if (cpu2Score > 21) {
                $('#cpu2-score').text(cpu2Score + ' (Lose)');
            } else if (dealerScore > 21 || cpu2Score > dealerScore) {
                cpu2Chips += cpuBet * 2;
                dealerChips -= cpuBet;
                $('#cpu2-score').text(cpu2Score + ' (Win)');
            } else if (cpu2Score === dealerScore) {
                cpu2Chips += cpuBet;
                $('#cpu2-score').text(cpu2Score + ' (Push)');
            } else {
                $('#cpu2-score').text(cpu2Score + ' (Lose)');
            }
        }

        if (hasDoubleReturn) hasDoubleReturn = false;

        updateWalletUI();
        saveGameProgress();
        $('#result-message').text(message);

        if (dealerChips <= 0) {
            $('main').prepend(`<div id="win-banner" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); z-index:3000; background:rgba(0,0,0,0.8); padding:20px; border-radius:15px;"><p style="color:gold; font-size:3rem; font-weight:bold; margin:0;">YOU WIN!</p></div>`);

            $('#deal-btn').prop('disabled', true);
            $('#hit-btn').prop('disabled', true);
            $('#stand-btn').prop('disabled', true);
            $('#next-btn').prop('disabled', true);
            $('#shop-btn').prop('disabled', true);

            return;
        }

        if (playerWallet < 1) {
            $('#next-btn').prop('disabled', true);
            setTimeout(() => {
                alert('You lose! Game Over.');
                localStorage.clear();
                location.reload();
            }, 800);
        } else {
            $('#next-btn').prop('disabled', false);
        }
    }

    // --- Next Round ---
    $('#next-btn').click(function () {
        $('#win-banner').remove();
        $('#bet-input').prop('disabled', false);
        $('#deal-btn').prop('disabled', false);
        $('#next-btn').prop('disabled', true);
        $('#result-message').text('Place your bet for the next round.');
        $('.card-container').empty(); $('#player-score').text('0');
        $('#dealer-score').text('-');
        if (cpu1Chips > 0) $('#cpu1-score').text('-');
        if (cpu2Chips > 0) $('#cpu2-score').text('-');
    });

    // --- Skill Shop ---
    $('#shop-btn').click(() => {
        $('#shop-modal').show();
        updateShopUI();
    });

    $('#close-shop-btn').click(() => $('#shop-modal').hide());

    $('#shop-modal').click(function (event) {
        if ($(event.target).is('#shop-modal')) {
            $('#shop-modal').hide();
        }
    });

    $('#buy-double-btn').click(function () {
        if (playerWallet >= 200 && !hasDoubleReturn) {
            playerWallet -= 200;
            hasDoubleReturn = true;
            updateWalletUI();
            saveGameProgress();
        }
    });

    $('#buy-peek-player-btn').click(function () {
        if (playerWallet >= 100 && !hasPeekPlayer) {
            if (deck.length > 0) {
                playerWallet -= 100;
                hasPeekPlayer = true;
                updateWalletUI();
                saveGameProgress();
                alert(`Your next card in deck will be: ${deck[deck.length - 1].value} of ${deck[deck.length - 1].suit}`);
            }
        }
    });

    $('#buy-peek-dealer-btn').click(function () {
        if (playerWallet >= 150 && !hasPeekDealer) {
            if (hands.dealer.length > 1) {
                playerWallet -= 150;
                hasPeekDealer = true;
                updateWalletUI();
                saveGameProgress();
                alert(`Dealer hole card is: ${hands.dealer[1].value} of ${hands.dealer[1].suit}`);
            }
        }
    });

    // --- Completely Reset Game ---
    $('#reset-btn').click(function () {
        if (confirm('Are you sure you want to reset all progress and wallet?')) {
            localStorage.clear();
            location.reload();
        }
    });

    $('#instruction-toggle').click(() => $('#game-instructions').slideToggle());
});
