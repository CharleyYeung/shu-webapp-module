/**
 * Blackjack Animation Module
 * Handles table rendering, player hit animations, and micro-interactions.
 */

$(document).ready(function () {
    console.log("Blackjack Animation Module Loaded.");

    // Render Human Player (with hit animation)
    window.renderPlayer = function (playerHand, isHit = false) {
        $('#player-container').empty();
        let cards = playerHand;

        cards.forEach((card, index) => {
            let isNew = isHit && (index === cards.length - 1);
            let slotHtml = `
                <div class="card-slot ${isNew ? '' : 'flipped'}" style="${isNew ? 'opacity: 0;' : 'opacity: 1;'}">
                    <div class="card-inner" style="${isNew ? 'transition: transform 0.5s;' : ''}">
                        <div class="card-back-face"><img src="../week1/img/card-back.png" class="card-img" alt="Back"></div>
                        <div class="card-front"><img src="${window.getCardImagePath(card)}" class="card-img" alt="Card"></div>
                    </div>
                </div>`;
            $('#player-container').append(slotHtml);
        });

        $('#player-score').text(window.calculateHandScore(playerHand));

        if (isHit) {
            let $newSlot = $('#player-container .card-slot').last();

            $newSlot.animate({ opacity: 1 }, 300, function () {
                setTimeout(() => {
                    $newSlot.addClass('flipped');
                }, 500);
            });
        }
    }

    // Render Full Table (Dealer, CPU 1, CPU 2, Player)
    window.renderTable = function (hands, cpu1Chips, cpu2Chips, hideDealerHoleCard = true) {
        $('#dealer-container').empty();
        $('#cpu1-container').empty();
        $('#cpu2-container').empty();
        $('#player-container').empty();

        // 1. Render Dealer
        hands.dealer.forEach((card, index) => {
            let isHidden = (hideDealerHoleCard && index === 1);
            let imgSrc = isHidden ? '../week1/img/card-back.png' : window.getCardImagePath(card);
            let slotHtml = `
                <div class="card-slot ${isHidden ? '' : 'flipped'}" style="opacity: 1;">
                    <div class="card-inner">
                        <div class="card-back-face"><img src="../week1/img/card-back.png" class="card-img" alt="Back"></div>
                        <div class="card-front"><img src="${imgSrc}" class="card-img" alt="Card"></div>
                    </div>
                </div>`;
            $('#dealer-container').append(slotHtml);
        });

        // 2. Render CPU 1
        if (cpu1Chips <= 0) {
            $('#cpu1-container').html(`<img src="../week1/img/Cloudy-lose.jpeg" class="cloudy-lose-img" alt="CPU 1 Bankrupt">`);
            $('#cpu1-score').text('BANKRUPT');
        } else {
            hands.cpu1.forEach(card => {
                let slotHtml = `
                    <div class="card-slot flipped" style="opacity: 1;">
                        <div class="card-inner">
                            <div class="card-back-face"><img src="../week1/img/card-back.png" class="card-img" alt="Back"></div>
                            <div class="card-front"><img src="${window.getCardImagePath(card)}" class="card-img" alt="Card"></div>
                        </div>
                    </div>`;
                $('#cpu1-container').append(slotHtml);
            });
            $('#cpu1-score').text(window.calculateHandScore(hands.cpu1));
        }

        // 3. Render CPU 2
        if (cpu2Chips <= 0) {
            $('#cpu2-container').html(`<img src="../week1/img/Cloudy-lose.jpeg" class="cloudy-lose-img" alt="CPU 2 Bankrupt">`);
            $('#cpu2-score').text('BANKRUPT');
        } else {
            hands.cpu2.forEach(card => {
                let slotHtml = `
                    <div class="card-slot flipped" style="opacity: 1;">
                        <div class="card-inner">
                            <div class="card-back-face"><img src="../week1/img/card-back.png" class="card-img" alt="Back"></div>
                            <div class="card-front"><img src="${window.getCardImagePath(card)}" class="card-img" alt="Card"></div>
                        </div>
                    </div>`;
                $('#cpu2-container').append(slotHtml);
            });
            $('#cpu2-score').text(window.calculateHandScore(hands.cpu2));
        }

        // 4. Render Player
        hands.player.forEach(card => {
            let slotHtml = `
                <div class="card-slot flipped" style="opacity: 1;">
                    <div class="card-inner">
                        <div class="card-back-face"><img src="../week1/img/card-back.png" class="card-img" alt="Back"></div>
                        <div class="card-front"><img src="${window.getCardImagePath(card)}" class="card-img" alt="Card"></div>
                    </div>
                </div>`;
            $('#player-container').append(slotHtml);
        });

        // Scores Update
        $('#player-score').text(window.calculateHandScore(hands.player));
        $('#dealer-score').text(hideDealerHoleCard ? '?' : window.calculateHandScore(hands.dealer));
    }

    // Button micro-interactions
    $('.control-button').hover(
        function () {
            if (!$(this).prop('disabled')) {
                $(this).css({ 'transform': 'scale(1.05)', 'transition': 'transform 0.2s ease' });
            }
        },
        function () {
            $(this).css('transform', 'scale(1)');
        }
    );

    let lastScrollTop = 0;
    const delta = 5; 

    $(window).scroll(function() {
        let currentScroll = $(this).scrollTop();
    
        if (Math.abs(lastScrollTop - currentScroll) <= delta) {
            return;
        }
        if (currentScroll > lastScrollTop && currentScroll > 90) {
            $('.top-header').addClass('header-hidden');
        } else {
            $('.top-header').removeClass('header-hidden');
        }
    
        lastScrollTop = currentScroll;
    });
    
});
