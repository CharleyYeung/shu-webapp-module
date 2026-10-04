$(document).ready(function () {
    const backImg = "../week1/img/card-back.png";
    let postData = null;
    let isBetPlaced = false;

    function updateStatus() {
        $("#dealer-chips").text(GameEngine.getDealer());
        $("#player-wallet").text(GameEngine.getWallet());
    }

    // Instruction Toggle with slideToggle
    $("#instruction-toggle").click(function () {
        $("#game-instructions").stop(true, true).slideToggle("fast");
    });

    // Step 1: Pillar Button Click
    $("#pillar-btn").click(function () {
        $(this).prop("disabled", true);
        $("#img-left").attr("src", backImg);
        $("#img-right").attr("src", backImg);
        $("#img-shoot").attr("src", backImg);
        $("#result-message").text("Dealing pillars...");

        postData = GameEngine.generatePosts();

        // Left pillar flip animation
        $("#img-left").fadeOut(200, function () {
            $(this).attr("src", postData.leftImg).fadeIn(200, function () {

                // Right pillar flip animation
                $("#img-right").fadeOut(200, function () {
                    $(this).attr("src", postData.rightImg).fadeIn(200, function () {

                        // Check validation after both animations complete
                        if (postData.isTooClose) {
                            alert("The two pillars are too close or identical. Redraw game!");
                            $("#img-left").attr("src", backImg);
                            $("#img-right").attr("src", backImg);
                            $("#pillar-btn").prop("disabled", false);
                            $("#result-message").text("Step 1: Click 'Pillar' to retry.");
                        } else {
                            // Step 2: Enable Bet input & confirm button
                            $("#bet-input").prop("disabled", false);
                            $("#bet-btn").prop("disabled", false);
                            $("#result-message").text("Step 2: Enter bet and click 'Place Bet'.");
                        }
                    });
                });
            });
        });
    });

    // Step 2: Place Bet Button Click
$("#bet-btn").click(function () {
        let bet = parseInt($("#bet-input").val());
        let wallet = GameEngine.getWallet();

        if (!isBetPlaced) {
            if (isNaN(bet) || bet < 1) {
                alert("Minimum investment is 1!");
                return;
            }
            if (bet > wallet) {
                alert("Bet cannot exceed your wallet asset!");
                return;
            }

            GameEngine.setBet(bet);
            isBetPlaced = true;
            $(this).text("Undo Bet"); 
            $("#bet-input").prop("disabled", true); 
            
            // Step 3: Enable Deal button
            $("#deal-btn").prop("disabled", false);
            $("#result-message").text("Bet placed. Click 'Deal' or click 'Undo Bet' to modify.");
        } else {
            isBetPlaced = false;
            $(this).text("Place Bet");
            $("#bet-input").prop("disabled", false); 
            
            $("#deal-btn").prop("disabled", true);
            $("#result-message").text("Step 2: Modify bet and click 'Place Bet'.");
        }
    });
    
    // Step 3: Deal Button Click
    $("#deal-btn").click(function () {
        $(this).prop("disabled", true);
        $("#bet-btn").prop("disabled", true);
        let shootVal = Math.floor(Math.random() * 13) + 1;
        let shootImg = GameEngine.getImagePath(shootVal);

        $("#img-shoot").attr("src", backImg);
        $("#img-shoot").fadeOut(200, function () {
            $(this).attr("src", shootImg).fadeIn(300, function () {
                let res = GameEngine.evaluate(shootVal);
                updateStatus();
                $("#result-message").text(res.msg);

                if (res.isGameOver) {
                    if (res.wallet < 1) {
                        alert("Wallet is empty! Game Over.");
                    } else {
                        alert("Dealer has no chips left! You win!");
                    }
                    disableAll();
                } else {
                    // Step 4: Enable Next Game button
                    $("#next-btn").prop("disabled", false);
                }
            });
        });
    });

    // Step 4: Next Game Button Click
    $("#next-btn").click(function () {
        $(this).prop("disabled", true);
        isBetPlaced = false; 
        $("#bet-btn").text("Place Bet");
        $("#img-left").attr("src", backImg);
        $("#img-right").attr("src", backImg);
        $("#img-shoot").attr("src", backImg);
        $("#pillar-btn").prop("disabled", false);
        $("#result-message").text("Step 1: Click 'Pillar' for the next round.");
    });

    // Step 5: Full Reset Button Click
    $("#reset-btn").click(function () {
        GameEngine.reset();
        updateStatus();
        isBetPlaced = false;
        $("#bet-btn").text("Place Bet");
        $("#img-left").attr("src", backImg);
        $("#img-right").attr("src", backImg);
        $("#img-shoot").attr("src", backImg);
        $("#pillar-btn").prop("disabled", false);
        $("#bet-input").prop("disabled", true).val(10);
        $("#bet-btn").prop("disabled", true);
        $("#deal-btn").prop("disabled", true);
        $("#next-btn").prop("disabled", true);
        $("#result-message").text("Game fully reset. Step 1: Click 'Pillar'.");
    });

    function disableAll() {
        $("#pillar-btn").prop("disabled", true);
        $("#bet-btn").prop("disabled", true);
        $("#deal-btn").prop("disabled", true);
        $("#next-btn").prop("disabled", true);
        $("#bet-input").prop("disabled", true);
    }
});
