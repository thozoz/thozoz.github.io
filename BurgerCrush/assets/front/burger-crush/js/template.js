// /******* Game functions start here ******/

// /******* Game functions end ******/

var enterCampaignBtn = $("#btn_enter_campaign"),
    retryBtn = $("#retryBtn"),
    gameDuration = parseInt(gameData.timeInSeconds),
    isReplay = false,
    onGameCompleteActionCalled = false,
    audioTrack = "assets/front/burger-crush/audio/",
    gameWonImageElem  = $('#gifImg-gamewin-burgercrush'),
    gameLoseImageElem = $('#gifImg-gamelose-burgercrush');

var imagesToPreload = [
                    $(gameWonImageElem).data('src'),
                    $(gameLoseImageElem).data('src')
                    ];

/***** Audio Functions Goes Here *******/

//Audio Setup
window.ALLOW_PLAY = true;
Howler.autoUnlock = true;

//background Sound
window.MP3_BACKGROUND = new Howl({
    src: audioTrack + "BackgroundMusic.mp3",
    autoplay: false,
    html5: false,
    volume: 1,
    loop: true,
    onplay: function () {
        showalert("== Background sound played ==");
        $(".audio-toggle button").removeClass("audio-is-paused").addClass("audio-is-playing");
        $(".audio-toggle button").attr("onclick", "javascript : pauseSound(window.MP3_BACKGROUND)");
    },
    onpause: function () {
        showalert("== Background sound paused ==");
        $(".audio-toggle button").removeClass("audio-is-playing").addClass("audio-is-paused");
        $(".audio-toggle button").attr("onclick", "javascript : playSound(window.MP3_BACKGROUND)");
    },
    onplayerror: function () {
        showalert("== Error playing background sound ==");
    },
    onend: function () {
        showalert("== MP3_BACKGROUND Finished! ==");
    }
});

// /**
//  * Gets game result data
//  * To be changed
//  */
function getGameResultData(gameResultData) {
    
    var gameRes = {
                game_play_status: gamePlayStatus,
                play_duration: gameResultData.totalElapsedSeconds,
                points_earned: gameResultData.points_earned,
                success_combinations: gameResultData.success_combinations,
                availableLoyaltyPts: availableLoyaltyPoints,
                loyaltyPointsLogId: gmalLogId
            };
    return gameRes;
}

function showBGIntroScreen(){
    setAsCurrentScreen("section-mainScreen");
}
// /**
//  * On Game Complete Actions
//  * @returns {undefined}
//  */
function gameCompleteAction(isGameLost)
{    
    if(isUndefined(isGameLost)){ isGameLost = false; }
}

// /**
//  * On game won callback
//  * @returns {undefined}
//  */
function onGameWonCallback(gameResultData){


    if(!onGameCompleteActionCalled){
        
        currentGameStatus = 'won';
        onGameCompleteActionCalled = true;
        
        setTimeout(function(){ 
            setAsCurrentScreen('section-Win');
            playGif(gameWonImageElem);
            gameCompleteAction();
        }, 500);
        
        gameResultData = getGameResultData(gameResultData);
        setTimeout(function(){
            if(hasMultipleReward){
                var onSuccessAction = function(){
                    setAsCurrentScreen('section-chooseReward');
                };
                var errorAction = function(){};
                updateTransaction(onSuccessAction, errorAction, gameResultData);
            }else{
                claimOffer(gameResultData);
            }
        }, 4500);
    }
}

// /**
//  * On game lose callback
//  */
function onGameLoseCallback(gameResultData){

    if(!onGameCompleteActionCalled){
        
        currentGameStatus = 'lost';
        onGameCompleteActionCalled = true;
        
        setTimeout(function(){ 
            setAsCurrentScreen('section-Lose');
            playGif(gameLoseImageElem);
            gameCompleteAction(true);
        }, 500);
        
        gameResultData = getGameResultData(gameResultData);

        var onSuccessAction = function(){ 
            showOnGameLostScreen(2500);
        };
        var errorAction = function(){};
        updateTransaction(onSuccessAction, errorAction, gameResultData);
    }
}

// /**
//  * Enter into Game function
//  * @returns {undefined}
//  */
function enterIntoGame(isReplay) {
    
    showalert("== Entering Into Game ==");
    
    currentGameStatus = 'starting';
    gameDataObj = {
                game_duration: gameDuration,
                target: parseInt(gameData.target),
                language: language,
            };

    var successAction = function(){
        showalert("== Transaction Started | ID: " + transactionID);
        startGamePlay(isReplay);
    };
    startTransaction(successAction, 2, gameDataObj);
}

// /**
//  * Starts game play
//  * @param {type} isReplay
//  * @returns {undefined}
//  */
function startGamePlay(isReplay)
{
    pauseSound(window.MP3_BACKGROUND);
    preloadImages(imagesToPreload);
    currentGameStatus = 'playing';
    trackEvent("screen_display", "Displayed Game Play Screen");

    if(isReplay){
        showalert("== Game restarted ==");
        setAsCurrentScreen('section-game');
        gameState.restart();
    }
    else{
        showalert("== Game started ==");
        gameState.start();
    }
}

// /**
//  * Starts game play
//  * @param {type} isReplay
//  * @returns {undefined}
//  */
function loadGame(){
    
    showalert("== Loading game ==");
    
    var gameCallBack = function(data){
        
        showalert(data);
        var isUserWon = data.won;
        gamePlayStatus = (isUserWon ? '1' : '2');
        window.MP3_BACKGROUND.play();
        if(isUserWon){
            onGameWonCallback(data);
        }else{
            onGameLoseCallback(data);
        }
    };
    
    var gameParams = {
                webview: ((getMobileOperatingSystem() == 'android') ? true : false),
                // webview: true,
                rtl: ((language == 'ar') ? true : false),
                labels:{ 
                    count: gameMessages.count[language],
                    target: gameMessages.target[language],
                    // prepareInfo: gameMessages.prepare_the_perfect[language].replace(/ /g,"\n"),
                    time: gameMessages.time[language],
                },
                matchImage : gameData.matchImage,
                gridImages: gameData.gridImages,
                audios:{
                  background: '',
                  crush: audio_url +'/SuccessfulMatch_SFX.mp3',
                  patternmatch: audio_url +'/SuccessfulMatch_SFX.mp3',
                  cleargrid: audio_url +'/ClearGridAnimation.mp3'
                },
                timeInSeconds: gameDuration,
                target: parseInt(gameData.target),
                unmountAfter: 2,
                scaleFit: true,
                onComplete: data => { gameCallBack(data); }
            };
    showalert('=== Game Params : '+ JSON.stringify(gameParams));
    gameState.load(gameParams);
}

// /**
//  * Replay Game Action
//  * Resets Game Data
//  */
function replayGame(){
    
    setTimeout(function(){ stopGif(gameLoseImageElem); }, 2000);
    onGameCompleteActionCalled = false;
    currentGameStatus = '';
    enableBtn(retryBtn);
    isReplay = true;

    if(isUndefined(isReplay)){ isReplay = false; }

    if (isReplay) {
        $('#game canvas').removeAttr('style');
        $('#game canvas').attr("style", "display: block; touch-action: none; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);");
    }

    enterIntoGame(isReplay);
}

// /**
//  * Document Ready Actions
//  */
jQuery(document).ready(function($){
    
    loadGame(); //loading game components
    playSound(window.MP3_BACKGROUND);
                   
    //preloadImages([gameBackgroundImage]); //enable this in case if loader background is black

    if (!isUndefined(enterCampaignBtn)) {
        enterCampaignBtn.click(function(){
            disableBtn($(this));
            trackEvent("btn_click", "Clicked On Enter Campaign Button");
            // checkGuestUser();
            setAsCurrentScreen('section-game');
		    trackEvent("screen_display", "Game Started");

		    enterIntoGame(isReplay);
        });
    }

    if (!isUndefined(retryBtn)) {
        
        retryBtn.click(function(){
            
            showalert("== Clicked Retry Button ==");
            trackEvent("btn_click", "Clicked Retry Button");
            setAsCurrentScreen('section-preloader');
            if (userCanReplay()) {
                
                gamePlayCount++;
                showalert("== Replaying Game Take " + gamePlayCount);
                
                var successAction = function () {
                    var pointsAfterDeduction = (availableLoyaltyPoints - retryPts);
                    usedLoyaltyPoints = retryPts;
                    setAvailableLoyaltyPts(pointsAfterDeduction);
                    replayGame();
                };

                var errorAction = function () {
                    setAsCurrentScreen("section-Lost");
                    enableBtn(retryBtn, "btn-memory-disabled");
                };

                if (retryPts > 0) {
                    burnUserLoyaltyPoints(retryPts, successAction, errorAction);
                }
                else{
                    replayGame();
                }
            } else {
                setAsCurrentScreen("section-retry");
            }
        });
    }

    $("#try_again_tomorrow").click(function(){
        disableBtn($(this));
        showalert("== Clicked try again tomorrow button ==");
        if (gtmTrackingId) { trackEvent("btn_click", "Clicked Play Tomorrow Button"); }
        setAsCurrentScreen("section-retry");
    });
});

/**
 * On Visibility Change
 * @param {type} param1
 * @param {type} param2
 */
document.addEventListener("visibilitychange", function () {
    
    cl("== Entered Visibility Change ==");
    
    window.ALLOW_PLAY = false;
    pauseSound(window.MP3_BACKGROUND);
});