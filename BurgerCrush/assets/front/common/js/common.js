var imagesPreLoaded = false, nextScreen;
var preLoader = jQuery("#section-preloader");
var offersData = offersData ? JSON.parse(offersData) : "";
var gameData = gameData ? JSON.parse(gameData) : "";
var gameMessages = gameMessages ? JSON.parse(gameMessages) : "";
var gamePlayCount = 0, retryLimit = parseInt(gameData.retry_limit);
var gameDataObj = new Object(), gameResultData = new Object(), gamePlayStatus = '0'; // 0 = Not Yet Played, 1 = Won, 2= Lost
var isRetryEnabled = (gameData.retry_enabled == true), retryWithLoyalty = gameData.retry_with_loyalty;
var retryPts = ((retryWithLoyalty == true) ? parseInt(gameData.retry_points) : 0);
var selectedOfferData = "", gmalLoyaltyId, gmalRewardId;
var loyaltyPointsElem = jQuery(".available_loyalty_points");
var raffleEntriesElem = jQuery(".total_raffle_entries");
var errorCodeElem = $(".show_error_code");
var videoElem = document.getElementById("media-video"), videoEnded = false;
//var sharedOnFacebook = (getQueryParam('shared')) ? true : false;
var isFullScreen = (getQueryParam('fullscreen')) ? true : false;
var actualHeight = screen.height;
var operatingSystem = '';
var imagesToLoadAfterGame = [];
/**
 *  For Reference: Replaceable Variables
 *  User Raffle Entries: {raffle_elffar}
 *  Level Points: {level_1_level}, {level_2_level}, {level_3_level}, {level_4_level}, {level_b_level}
 */

/**
 * Console logs data
 * @param {type} d
 * @returns {undefined}
 */
function cl(d) {
    if (logInConsole) {
        console.log(d);
    }
}

function showalert(msg, parse) {
    
    if (isUndefined(parse)){ parse = false; }
    if (debugMode){
        if(parse){ msg = JSON.stringify(msg); }
        alert(msg); 
    }
    cl(msg);
}

function getMobileOperatingSystem() {
    
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var body = $("body");
    if (body.length > 0) {
        if (/windows phone/i.test(userAgent)) {
            body.addClass("windows");
            operatingSystem = "windows";
        }
        if (/android/i.test(userAgent)) {
            body.addClass("android");
            operatingSystem = "android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            body.addClass("ios");
            operatingSystem = "ios";
        }
        return operatingSystem;
    }
}

/**
 * Checks if variable is undefined
 * @param {type} v
 * @returns {Boolean}
 */
function isUndefined(v) {
    return typeof v == "undefined";
}

/**
 * Prepends Zero To A Number
 * @param {type} number
 * @returns {String}
 */
function prependZero(number) {
    return number < 10 ? "0" + number : number;
}

/**
 * Stringify JSON Response
 * @param {type} find
 * @param {type} replace
 * @returns {String}
 */
function stringify(data) {
    return JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
}

/**
 * Gets Random Key from Array
 * @param {type} arr
 * @returns {Number}
 */
function getRandomArrayKey(arr){
    return Math.floor(Math.random() * arr.length);
}

/**
 * Replaces Array
 * @param {type} find
 * @param {type} replace
 * @returns {String}
 */
String.prototype.replaceArray = function (find, replace) {
    var replaceString = this;
    for (var i = 0; i < find.length; i++) {
        var regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
        return replaceString;
    }
};

/**
 * Replaces strings with another string
 * @returns {undefined}
 */
function replaceVariable(f, r) {

    showalert("== Replacing variables: " + f + " ==");
    $("section p").html(function (index, html) {
        return html.replace(f, r);
    });
}

/**
 * Shuffle Array Items
 * @returns {undefined}
 */
function shuffle(array) {
    
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * PHP Equivalent in_array function in JS
 * @returns {Boolean}
 */
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        var arrayElem = stringConversion(haystack[i]);
        if(arrayElem == needle) return true;
    }
    return false;
}

/**
 * Covert string for tags matching
 * @returns {String}
 */
function stringConversion(string){
    
    var replaceSpace = string.split(' ').join('_');
    var replaceDashUnderScore = replaceSpace.split('-_').join('-');
    var replaceUnderScoreDash = replaceDashUnderScore.split('_-').join('-');
    return replaceUnderScoreDash.toLowerCase();
}

/**
 * Match High redeemer tag
 * @returns {Boolean}
 */
function tagsMatching(tagsArray, highRedeemerTag) {
    
    var searchString = stringConversion(highRedeemerTag);
    showalert("Needle " + searchString);
    var tagMatched = inArray(searchString, tagsArray);
    showalert('Matching Status in function '+ tagMatched);
    return tagMatched;
}

/**
 * Tracks Screen Display if needed
 * @param {type} sectionName
 * @returns {String}
 */
function trackScreenDisplay(sectionName) {
    var screenTitle = {
        "section-preloader": "Displayed Loader Screen",
        "section-campaignInstruction": "Displayed Campaign Intro Screen",
        "section-mainScreen": "Displayed Campaign Intro Screen",
        "section-termsCondtions": "Displayed TnC Screen",
        "section-gameInstruction": "Displayed Game Instruction Screen",
        "section-gameSelection": "Displayed Game Selection Screen",
        "section-gameloader": "Displayed Game Loading Screen",
        "section-gameLoader": "Displayed Game Loading Screen",
        "section-video": "Displayed Campaign Video Screen",
        //'section-motivationalMsg': 'Displayed Motivatonal Screen',
        "section-game": "Displayed Game Play Screen",
        "section-Win": "Displayed Game Won Screen",
        "section-userWin": "Displayed Game Won Screen",
        "section-userChoice": "Displayed Reward Choose Screen",
        "section-chooseReward": "Displayed Choose Reward Screen",
        "section-gameLose": "Displayed Game Lose Screen",
        "section-Lose": "Displayed Game Lose Screen",
        "section-alreadyClaimed": "Displayed Already Played Screen",
        "section-offerClaimSuccess": "Displayed Reward Claim Success Screen",
        "section-OfferPage": "Displayed Reward Claim Success Screen",
        "game-lose": "Displayed Game Lose Screen",
        "section-Lost": "Displayed Game Lost Screen",
        "section-retry": "Displayed Better Luck Screen",
        // Level Intro Screens
        "section-welcome-level-1": "Displayed Level 1 Welcome Screen",
        "section-welcome-level-2": "Displayed Level 2 Welcome Screen",
        "section-welcome-level-3": "Displayed Level 3 Welcome Screen",
        "section-welcome-level-4": "Displayed Level 4 Welcome Screen",
        "section-welcome-level-bonus": "Displayed Bonus Level Welcome Screen",
        // Level Congrats Screens
        "section-congrats-level-1": "Displayed Level 1 Congrats Screen",
        "section-congrats-level-2": "Displayed Level 2 Congrats Screen",
        "section-congrats-level-3": "Displayed Level 3 Congrats Screen",
        "section-congrats-level-4": "Displayed Level 4 Congrats Screen",
        "section-congrats-level-bonus": "Displayed Bonus Level Congrats Screen",
        //Raffle Screens
        "section-raffle-intro": "Displayed Raffle Intro Screen",
        "section-raffleScreen": "Displayed Raffle Points Screen",
        "section-updateDetails": "Displayed Contact Update Screen",
        "section-raffleParticipation": "Displayed Raffle Participation Screen",
        "section-MerchandiseInitiative": "Displayed Merchandise Initiative Screen",
    };
    
    if (gtmTrackingId && sectionName in screenTitle) {
        trackEvent("screen_display", screenTitle[sectionName]);
    }
}

/**
 * Sets Current Screen
 * @param {type} sectionName
 * @returns {String}
 */
function setAsCurrentScreen(sectionName, duration) {
    
    showalert("== Displaying " + sectionName + " Screen ==");
    if (typeof duration === "undefined") duration = 0;
    
    setTimeout(function(){
        $("#" + sectionName + ' .reload-on-display').each(function(){
            var $this = $(this), imgUrl = $this.attr('src');
            if(isUndefined(imgUrl)){ imgUrl = $this.data('src'); }
            $this.attr('src', '');
            $this.attr('src', imgUrl);
        });
    }, duration);
    
    setTimeout(function(){
        $(".flow-section").removeClass("current");
        $("#" + sectionName).removeClass("hide").addClass("current");
    }, (duration + 100));
    
    trackScreenDisplay(sectionName);
}

/**
 * Shows Loader
 * @param boolean Show/hide loading text
 * @returns {undefined}
 */
function showLoader(removeText){
    
    if (!isUndefined(removeText) && removeText) {
        preLoader.find(".loaderText").hide();
    } else {
        preLoader.find(".loaderText").show();
    }
    $('.flow-section').removeClass("current");
    preLoader.removeClass("hide").addClass("current");
}

/**
 * Hides Loader
 * @returns {undefined}
 */
function hideLoader() {
    preLoader.find(".loaderText").show();
    preLoader.addClass("hide").removeClass("current");
}

/**
 * Removes Loader
 * @param {type} screenName
 * @param {type} duration
 * @returns {undefined}
 */
function removeLoader(screenName, duration) {
    
    showalert("== Removing Loader Screen ==");

    if (isUndefined(screenName)){ screenName = "section-mainScreen"; }
    if (isUndefined(duration)){ duration = 0; }

    var switchScreen = true, callBackFunction = "";
    switch (campaignType) {
        case 7:
            callBackFunction = function(){
                if (screenName == "section-OfferPage") {
                    congoSound();
                }
            };
            break;

        case 8:
            showalert("== Trying To Play Video ==");
            screenName = "section-video";
            callBackFunction = function () {
                try {
                    showalert("== Playing Video ==");
                    videoElem.play();
                    checkGuestUser(true);
                } catch (err) {
                    showalert("== Error Playing Video ==");
                    showalert("== Error: " + JSON.stringify(err) + " ==");
                    setTimeout(function () {
                        videoEnded = true;
                        checkGuestUser();
                        onVideoEnded();
                    }, 5000);
                }

                $(videoElem).on("ended", function () {
                    videoEnded = true;
                    videoElem.pause();
                    onVideoEnded();
                });
            };
            break;
        
        default:
            break;
    }

    if (switchScreen && $("#" + screenName).length) {
        setTimeout(function () {
            preLoader.addClass("hide").removeClass("current");
            setAsCurrentScreen(screenName);
            if (callBackFunction) {
                callBackFunction();
            }
        }, duration);
    }
}

/**
 * Shows loading screen when anything is in Process
 * @param string processType
 * @returns {undefined}
 */
function showInProcessScreen(processType, duration) {
    if ($("#section-inProcess").length) {
        $("#in_process_html").html("");
        if (typeof duration !== "undefined") {
            setTimeout(function () {
                setAsCurrentScreen("section-inProcess");
                var processHtml = "";
                if (typeof processType !== "undefined") {
                    switch (processType) {
                        case "login":
                            $("#section-inProcess img").click(function () {
                                openLoginPopup();
                            });
                            break;
                    }
                }
                if (processHtml) {
                    $("#in_process_html").html(processHtml);
                }
            }, duration);
        } else {
            setAsCurrentScreen("section-inProcess");
        }
    }
}

/**
 * Hides InProcess Screen and sets the current screen (if provided)
 * @param {type} nextScreen
 * @returns {undefined}
 */
function hideInProcessScreen(nextScreen, duration) {
    
    if ($("#section-inProcess").length) {
        if (typeof duration !== "undefined") {
            setTimeout(function () {
                $("#section-inProcess").addClass("hide");
                if (typeof nextScreen !== "undefined") {
                    setAsCurrentScreen(nextScreen);
                }
            }, duration);
        } else {
            $("#section-inProcess").addClass("hide");
            if (typeof nextScreen !== "undefined") {
                setAsCurrentScreen(nextScreen);
            }
        }
    }
}

/**
 * Gets Query Parameters
 * @param {type} key
 * @returns {undefined}
 */
function getQueryParam(key) {
    var url = window.location.href;
    var queryStartPos = url.indexOf("?");
    if (queryStartPos === -1) {
        return;
    }
    var params = url.substring(queryStartPos + 1).split("&");
    for (var i = 0; i < params.length; i++) {
        var pairs = params[i].split("=");
        if (decodeURIComponent(pairs.shift()) == key) {
            return decodeURIComponent(pairs.join("="));
        }
    }
}

/**
 * Shows went wrong screen
 * @param {type} errorType
 * @returns {undefined}
 */
function showWentWrongScreen(errorType) {
    
    showalert(errorType);
    if (gtmTrackingId) {
        trackEvent('went_wrong', (!isUndefined(errorType) ? errorType : "Something Went Wrong"));
    }
    setAsCurrentScreen("section-wentWrong");
}

/**
 * Loyalty Pts Action
 * @param {type} hasPts
 * @returns {undefined}
 */
function loyaltyPtsAction(hasPts){
    
    showalert("== loyalty points action ==" + hasPts);
    
    if(isUndefined(hasPts)){ hasPts = true; }
    if(hasPts){
        $('.message_points').css('display', 'block');
        $('.message_nep').css('display', 'none');
    }else{
        $('.message_points').css('display', 'none');
        $('.message_nep').css('display', 'block');
    }
}

/**
 * Shows On Game Lost Screen
 * @returns {undefined}
 */
function showOnGameLostScreen(duration){
    
    if(isUndefined(duration)){ duration = 500; }
    //console.log('gameData =' + JSON.stringify(gameData));
    console.log('isRetryEnabled =' + isRetryEnabled);
    if(isRetryEnabled){
        console.log('gamePlayCount =' + gamePlayCount);
        if(gamePlayCount >= retryLimit){
            setAsCurrentScreen('section-retry', duration);
        }else{
            if(userCanReplay()) {
                loyaltyPtsAction(true);
            }else{
                loyaltyPtsAction(false);
                disableBtn(retryBtn, 'btn-disabled');
                setAsCurrentScreen('section-retry', (parseInt(5000) + parseInt(duration)));
            }
            setAsCurrentScreen("section-Lost", duration);
        }
    }else{
        setAsCurrentScreen('section-retry', duration);
    }
}

/**
 * Preloads Images to the document
 */
function preloadImages(images, onDoneAction) {
    
    var preLoadedCount = 0;
    $.each(images, function (index, image) {
        cl('Preloading images Initiated');
        var img = $("<img />");
        img.attr("src", image);
        img.on("load", function () {
            preLoadedCount++;
        });
    });

    if (preLoadedCount === images.length) {
        imagesPreLoaded = true;
        if (typeof onDoneAction !== "undefined")
            onDoneAction();
    }
}

/**
 * Try Again Action
 * @returns {undefined}
 */
function tryAgainAction() {
    trackEvent("btn_click", "Clicked Try Again Button");
    window.location.href = window.location.href;
}

/**
 * Sets User Available Loyalty Points
 * @returns {undefined}
 */
function setUserLoyaltyPoints() {
    showalert('== Loyalty Point Updated on UI ==' + availableLoyaltyPoints);
    loyaltyPointsElem.html(prependZero(availableLoyaltyPoints));
}

function setErrorCode(errorCode = '000') {
    showalert('== server error code updated ==' + errorCode);
    var errorCodeElem = $(".show_error_code");
    errorCodeElem.text(errorCode);
    var show_error_code_head_val = $('.show_error_code_head').text();
    $('.show_error_code_head').html(show_error_code_head_val.replace("(X-XXX-XXX)", ' '));
}

/**
 * Sets User Raffle Entries
 * @returns {undefined}
 */
function setUserRaffleEntries() {
    showalert('== Raffle Point Updated on UI ==');
    raffleEntriesElem.html(prependZero(raffleEntries));
}

/**
 * Sets User Total Current Raffle Points
 * @returns {undefined}
 */
function setUserRafflePoints() {

    showalert("== Setting user raffle points. Available points: " + userRafflePoints + " ==");
    if (!raffleVariablesReplaced) {
        raffleVariablesReplaced = true;
        replaceVariable('{raffle_elffar}', '<span class="total-raffle-points" style="display:inline-block;">' + userRafflePoints + "</span>");
    }
    $('#user_raffle_points_updated').val(userRafflePoints);
    $("body .total-raffle-points").html(userRafflePoints);
}

/**
 * Go To Deals Action
 * @returns {undefined}
 */
function goTodealsAction() {
    trackEvent("go_to_deals", "Clicked Go To Deals Page Link");
    window.location.href = "gmalite://gmalite-deals";
}

/**
 * Loads lazy images
 * @param {type} param1
 * @param {type} param2
 */
function loadLazyImages() {
    
    showalert('== Loading Lazy Images ==');
    jQuery(".lazyload-image").each(function () {
        var imgSrc = $(this).data("src");
        if (imgSrc){
            $(this).attr("src", imgSrc);
        }
    });
}

/**
 * Processes Offer Activation
 * @param {type} loyaltyId
 * @param {type} rewardId
 * @returns {undefined}
 */
function processOfferActivation(loyaltyId, rewardId, gameResultData, screenSection) {

    if(isOfferClaimed == false){
        
        isOfferClaimed = true;
        showalert("== Processing Offer Activation | Loyalty ID: " + loyaltyId + " | Reward ID: " + rewardId);
        
        if(isUndefined(screenSection)){ 
            screenSection = "section-OfferPage"; 
            showalert("[processOfferActivation] | screenSection = "+screenSection);
        }

        if (isUndefined(loyaltyId) || isUndefined(rewardId)) {
            loyaltyId = offersData.gmal_loyalty_id;
            rewardId  = offersData.gmal_reward_id;
        }

        var successAction = function (activationResponse) {
            showalert("== Activation Response:" + JSON.stringify(activationResponse));
            var isOfferActivationSuccess = isGmalOnlineMode() ? (activationResponse.success === true) : (activationResponse === true);
            cl(isOfferActivationSuccess);
            var nextScreen = isOfferActivationSuccess ? screenSection : "section-wentWrong";
            
            if (template_id == 27) { // only for referral program
                setAsCurrentScreen(nextScreen);
                getRefferrerReward();
            } else {
                removeLoader(nextScreen, (isGmalOnlineMode() ? 500 : 2000));
            }

            isOfferClaimed = false;
        };
        var errorAction = function () {
            setAsCurrentScreen("section-wentWrong", (isGmalOnlineMode() ? 500 : 2000));
        };
        var onDoneAction = function () {
            showalert("Offer Activation Done");
        };
        activateOffer(loyaltyId, rewardId, successAction, errorAction, onDoneAction, gameResultData);
    }
}

/**
 * Claims Offer functionality
 * @returns {undefined}
 */
function claimOffer(gameResult, selectedOffer, isBtnClicked){
    
    showLoader();
    
    if(isUndefined(isBtnClicked)){ isBtnClicked = true; }
    if(gtmTrackingId && isBtnClicked){ trackEvent('btn_click', 'Clicked Claim Reward Button'); }
    selectedOfferData = ((!isUndefined(selectedOffer)) ? selectedOffer : offersData);
    
    setSelectedOffersData();
    
    if(!isOfferClaimed) {
        if(gmalLoyaltyId && gmalRewardId){
            processOfferActivation(gmalLoyaltyId, gmalRewardId, gameResult);
        }else{
            showalert('== Loyalty Id or Reward Id Missing!! ==');
            setAsCurrentScreen('section-wentWrong', 500);
        }
    }else{
        showalert('== Reward Already Claimed!! ==');
        setAsCurrentScreen('section-alreadyClaimed', 500);
    }
}

/**
 * Play Sound
 * @param {type} MP3
 * @returns {undefined}
 */
function playSound(MP3) {
    showalert("== Playing Sound " + MP3 + " ==");
    window.ALLOW_PLAY = true;
    if (!isUndefined(MP3)) { MP3.play(); }
}

/**
 * Pause Sound
 * @param {type} MP3
 * @returns {undefined}
 */
function pauseSound(MP3) {
    //showalert("== Sound Paused ==");
    window.ALLOW_PLAY = false;
    if (!isUndefined(MP3)){ MP3.pause(); }
}

/**
 * On Tnc Checked Action
 * @returns {undefined}
 */
function onTncCheckedAction() {
    
    showalert('== On tnc check action . campaign_type = '+campaignType);
    switch (campaignType) {
        case 1: //Video Campaign
            setAsCurrentScreen("section-video");
            playVideo();
            break;

        case 2: //Image Campaign
            setAsCurrentScreen("section-image");
            break;

        case 5: //Core Fries Campaign
        case 7: //Memory Game Campaign
            enterIntoGame();
            break;

        case 8: //Chicken Spicy Campaign
            checkGamePlayStatus();
            break;
         
        case 10: //Drive Thru Campaign 
            playCampaignVideo();
            break;
            
        case 11: //customer preference campaign
            showTagsScreen();
            break;
        
        case 12: // BB Core Chicken
        case 14: // Arab Cup
            showGameLoader();
            break;
            
        case 13: // McSaver
        case 16: // McCafe
            showGameIntroScreen();
            break;
            
        case 15: // Raffle
        case 21: // Loyalty Raffle
            showRaffleParticipationScreen();
            break;

        case 19: // Loyalty Merchandise
            showMerchandiseInitiativeScreen();
            break;

        case 20: // Loyalty Charity
            showLoyaltyInitiativeScreen();
            break;

        case 17: // Voucher
        case 22: // Voucher Offer
            showVoucherParticipationScreen();
            break;

        case 23: // Burger Crush
            showBGIntroScreen();
            break;
        
        case 24: // Arab World Cup
            showIntroScreen();
            break;
            
        case 25: //TMS World Cup
            showIntroScreen();
            break;

        case 26: //Raise Your Arches
            showIntroScreen();
            break;

        case 27: //Referral Program
            showIntroScreen();
            break;
            
        case 28: //McNuggets
            updateScreenVisit('tnc');
            showIntroScreen();
            break;
        case 29: //Loyalty 
            showWelcomeScreen();
            break;
        case 30: // Whack a Mac
            showWelcomeScreen();
            break;
    }
}

/**
 * Sets selected offer
 * @returns {undefined}
 */
function setSelectedOffer(ot) {
    
    if(ot && !isUndefined(ot)){
        $("#selected_offer_index").val(ot);
        $(".rewards-list .rewardImage").removeClass("selected-offer borderGreen").addClass("grey");
        $(".rewards-list .reward-image-" + ot).removeClass("grey").addClass("selected-offer borderGreen");
    }
}

/**
 * go to ChooseReward
 * @returns {undefined}
 */
function showChooseReward() {
    setAsCurrentScreen("section-chooseReward");
}

/**
 * Disables Button
 * @param {object} selector element
 */
function disableBtn(elem, className) {
    $(elem).prop("disabled", true);
    if (!isUndefined(className)) {
        $(elem).addClass(className);
    }
}

/**
 * Enables Button
 * @param {object} selector element
 */
function enableBtn(elem, className) {
    showalert("== Enabling button ==");
    jQuery(elem).removeProp("disabled").removeAttr("disabled");
    if (!isUndefined(className)) {
        $(elem).removeClass(className);
    }
}

function myFullscreen(){
    var currHeight = screen.height;
    console.log(currHeight);
    if(currHeight < actualHeight){
        $('body.en').removeClass('fullscreen');
    }else {
        $('body.en').addClass('fullscreen');
    }
}

/**
 * Checks if objects are same
 */
function objectsAreSame(x, y) {
    var objectsAreSame = true;
    for (var propertyName in x) {
        if (x[propertyName] !== y[propertyName]) {
            objectsAreSame = false;
            break;
        }
    }
    return objectsAreSame;
}

/**
 * Sets selected offers data
 * @returns {undefined}
 */
function setSelectedOffersData(selectedOfferObj){
    
    if(!isUndefined(selectedOfferObj) && selectedOfferObj){ 
        selectedOfferData = selectedOfferObj;
    }
    gmalLoyaltyId = selectedOfferData.gmal_loyalty_id;
    gmalRewardId = selectedOfferData.gmal_reward_id;
}

/**
 * Sets Claimed Reward Image
 * @returns {undefined}
 */
function setClaimedRewardImage(offerDetails, sectionId){
    
    showalert("== Setting claimed reward image ==");
    if(isUndefined(sectionId)){ sectionId = 'section-OfferPage'; }
    $('#'+sectionId).find('.claimed_offer_image').attr('src', uploadsPath + offerDetails.image).attr('alt', offerDetails.name);
    $('#'+sectionId).find('.claimed_offer_name').html(offerDetails.name);
}

/**
 * Plays Gif Image
 * @param {type} imgElem
 * @returns {undefined}
 */
function playGif(imgElem){
    showalert('Play gif called');
    var gifPath = $(imgElem).data('src');
    if(gifPath){
        $(imgElem).attr('src', gifPath);
    }
    showalert($(imgElem).attr('src'));
}

/**
 * Stops Gif Image
 * @param {type} imgElem
 * @returns {undefined}
 */
function stopGif(imgElem){
    $(imgElem).removeAttr('src');
}

/**
 * Accept TnC
 * @returns {undefined}
 */
function acceptTnC(){
    
    var onSuccessAction = function (data) {
        if (data) {
            trackEvent("tnc_agree", "Terms & Conditions Agreed");
            onTncCheckedAction();
        } else {
            showWentWrongScreen("TnC Update Failed");
        }
    };
    postAcceptTerms(onSuccessAction);
}

/**
 * Document Ready Function
 * @param {type} param
 */
jQuery(document).ready(function($) {

    $("body").addClass("loaded");

    $(".onclick-loader").click(function(){
        $(this).html('<img class="btn-loader" src="'+onclickLoaderPath+'" height="40">');
    });

    (function () {
        var body = document.getElementsByTagName("body");
        body[0].classList.add(language);
        if (language == "ar") {
            document.querySelector("html").setAttribute("dir", "rtl");
            document.querySelector("html").setAttribute("lang", "ar");
        }
    })();

    if (!isPreview) {
        getMobileOperatingSystem();
        
        if (gtmTrackingId) {
            trackEvent("screen_display", "Entered Campaign");
            trackEvent("screen_display", "Displayed Loader Screen");
        }
        
        jQuery(".open-tnc-screen").click(function () {
            trackEvent("btn_click", "Clicked TnC Open Icon");
            jQuery("#close-tnc-screen").data("lastScreen", $(this).parents("section").attr("id") );
            setAsCurrentScreen("section-termsCondtions");
        });

        jQuery("#close-tnc-screen").click(function () {
            var lastscreen = $(this).data("lastScreen"), tncElem = jQuery("#section-termsCondtions");
            tncElem.removeClass("current active");
            setAsCurrentScreen(lastscreen);
        });

        jQuery("#btnAgree").click(function(){

            jQuery(this).attr("disabled", "disabled");
            trackEvent("btn_click", "Clicked TnC Agree Button");
            acceptTnC();
        });

        $(".sectionLoader .loader_header_items").one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
            function(){
                setTimeout(function () {
                    $(".sectionLoader .camp_intro").removeClass("hide").addClass("animated fadeInUp");
                    $(".sectionLoader .tap-heading img").removeClass("hide").addClass("animated fadeIn");
                    $(".sectionLoader .default_loader h3").addClass("hide");
                }, 300);
            }
        );

        $(".sectionLoader .tap-heading img").one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                function () {
                    setTimeout(function () {
                        $(".sectionLoader .tap-heading span").removeClass("hide");
                    }, 300);
                }
        );

        $('.play-btn').click(function () {
            videoElem.play();
            $('.play-btn').hide();
        });

        $("[data-tab]").click(function () {
            var tab_id = $(this).attr("data-tab");
            setAsCurrentScreen(tab_id);
        });

        $("#claim_selected_reward").click(function () {
            
            disableBtn($(this));
            if (gtmTrackingId) {
                trackEvent("btn_click", "Clicked Claim Reward Button");
            }
            setAsCurrentScreen("section-preloader", 1000);
            var selecetedOfferIndex = $("#selected_offer_index").val();
            
            showalert("==Selected offer index:" + selecetedOfferIndex);
            
            selectedOfferData = offersData[selecetedOfferIndex];
            var offerDetails = selectedOfferData[language];
            
            setSelectedOffersData();
            
            processOfferActivation(gmalLoyaltyId, gmalRewardId);
            
            setClaimedRewardImage(offerDetails);
        });
        
        $('figure').on('click', function() {

            var $this   = $(this),
                $index  = $this.index(),
                $img    = $this.children('img'),
                $imgSrc = $img.attr('src'),
                $imgAlt = $img.attr('data-alt'),
                $imgExt = $imgAlt.split('.');

            if($imgExt[1] === 'gif') {
                $img.attr('src', $img.data('alt')).attr('data-alt', $imgSrc);
            } else {
                $img.attr('src', $imgAlt).attr('data-alt', $img.data('alt'));
            }
            $this.toggleClass('play');
	});
        
        var imagesToPreload = [];
        $('.reload-on-display').each(function(){
            var $this = $(this);
            var imgUrl = $this.attr('src');
            if(isUndefined(imgUrl)){ imgUrl = $this.data('src'); }
            
            if($this.hasClass('load-after-game')){
                imagesToLoadAfterGame.push(imgUrl);
            }else{
                imagesToPreload.push(imgUrl);
            }
        });
        preloadImages(imagesToPreload);
    }

    if ($(".news-swiper .swiper-slide").length == 1) {
        $(".swiper-slide").css("width", "100%");
    }
});

window.addEventListener('resize', myFullscreen);

function mungeString(input){
    var a = input.split("@"); 
    var b = a[0];
    var final = b.charAt(0) +'*****'+ b.charAt(b.length - 1) +"@"+ a[1];
    return final;
}
