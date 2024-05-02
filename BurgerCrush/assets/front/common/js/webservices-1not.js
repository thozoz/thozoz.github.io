/*
 * JS Functions for MCD Webservices
 */

//Global Variables
var isLocal = (window.location.hostname == 'localhost');
var user, deals, system, userData = '', appDetails = '', systemData = '', loyaltyPointsData = '';
var userId = '', mcdUserId, mcdDeviceId, tnc_checked, mcdUserEmail, game_avatar;
var response, GMAL_RequestTime, GMAL_ResponseTime, mcdAppVer;
var nextScreen, shareMsgSMS, shareMsgWhstapp;
var logInConsole = (isGmalOnlineMode() ? 0 : 1);
var referralTemplates = [3,4,6,27];
var autoUserDataSetTemplates = [17,22,23,24,25,26,27,28,30];
var getUserTagTemplates = [11,24,26,27,28,30];
var updateHightValueTagStatus = [28,30];
var isRefarralCampaign = (referralTemplates.indexOf(campaignType) !== -1);
var isOfferClaimed = false, isGamePlayed = false, gameCompleteCallBackDone = false;
var gmalLogId = '', transactionID, parentTransactionId = 0, gameEntryId = '';
var hasForceLoyaltyPoints = (isGmalOnlineMode() ? false : true), forceLoyaltyPoints = 44, availableLoyaltyPoints = 0, usedLoyaltyPoints = 0;
var raffleEntries = 0;
var lastLevel = 0, currentLevel = 1;
var isUserRegistered = false, raffleVariablesReplaced = false, registeredUserData, raffleDataFetchDone = false, userRafflePoints = 0; //Raffle Data
var userDriver = 2; //By default the user will be a low redeemer (GC)
var selectedFavoriteTag = '';
var raffleTemplate = 15;
var apitokenData, apiToken = '', apiTokenExpiry;
var claimObject = {};
var worldTmsDataObj = {};
var jsonObj = {};
var gameUniqueId = '';
var playDuration = 0;
var newReferralUser = 0; //By default the user will be old user
// var redirectToClaimFormIcon = '';

const TYPE_GET_USER = 1;
const TYPE_PROMPT_LOGIN = 2;
const TYPE_OFFER_ACTIVATION = 3;
const TYPE_GET_LOYALTY_POINTS = 4;
const TYPE_BURN_LOYALTY_POINTS = 5;
const TYPE_OCR_SCANNER = 6;
const TYPE_VOUCHER_VERIFICATION = 7;
const TYPE_WORLD_CUP_TMS_ENTRY_API = 8;
const TYPE_WORLD_CUP_TMS_CLAIM_API = 9;
const TYPE_WORLD_CUP_TMS_STATEMENT_API = 10;
const TYPE_WORLD_CUP_TMS_TOKEN_API = 11;
const TYPE_WORLD_CUP_TMS_REDRAW_API = 12;

//API URLs
var api = {
        setUserData: baseUrl + 'set-user-data',
        postOfferActivationData: baseUrl + 'saveOfferActivationData',
        tnc_update: baseUrl + 'tnc-update',
        storeTransaction: baseUrl + 'store-transaction',
        updateTransaction: baseUrl + 'update-transaction',
        storeGmalLog: baseUrl + 'store-gmal-log',
        storeRaffleParticipation: baseUrl + 'store-user-raffle-entries',

        //Customer Preference
        setUserFavTag: baseUrl + 'set-favorite-tag',

        //Referral Campaigns
        CodeRedeemption: baseUrl + 'code-redeemption',
        ChkIfRedeemed: baseUrl + 'if-redeemed',
        ChkIfRedeemedReferral: baseUrl + 'if-redeemed-referral',
        UpdateFlag: baseUrl + 'update-flag',
        StoreShareLogs : baseUrl + 'store-shareLogs',
        alreadyClaimed : baseUrl + 'alreadyClaimed',

        //Raffle
        getUserRaffleData: raffleApiUrl + 'getUserDetails',
        updateUserRafflePoints: raffleApiUrl + 'saveRafflePoints',
        getRaffleWinPercentage: baseUrl + 'raffle-winning-percentage',
        getCampaignConfigurationById: baseUrl + 'loyalty-config',

        //Voucher Campaigns
        checkVoucherCode: baseUrl + 'check-voucherCode',
        voucherRedeemption: baseUrl + 'voucherRedeemption',
        storeVoucherTransaction: baseUrl + 'store-voucher-transaction',
        loyaltyEmailNotification : baseUrl + 'loyalty-email-notification',
        vocuherClaimHistory : baseUrl + 'vocuher-claim-history',
        checkUserAllowedToProceed : baseUrl + 'check-user-allowed-proceed',

        //TMS
        getTMSOfferDataPerPrizeId : baseUrl + 'tms-getdataByPrizeId',
        tmsTokenApi : baseUrl + 'tms-token-api',
        tmsEntryApi : baseUrl + 'tms-entry-api',
        tmsClaimApi : baseUrl + 'tms-claim-api',
        tmsStatementApi : baseUrl + 'tms-statement-api',
        tmsPrizeDrawApi : baseUrl + 'tms-draw-api',
        tmsPrizeDetails: baseUrl + 'tms-prize-details',
        
        getMatchFixures: baseUrl + 'get-match-fixure',
        
        //getOfferData: baseUrl + 'get-offer-data',
        //getGameData: baseUrl + 'get-game-data',
        //updateGameTransaction: ,
        //CodeRedeemption:baseUrl + 'code-redeemption',
        //guestUser: baseUrl + 'add-guest-user',
        //postUpdateMobileNumber: baseUrl + 'updateMobileNumber',
        //getSocialSharePoint: baseUrl + 'getSocialSharePoints',
        //socialSharePointRedeem: baseUrl + 'redeemsocialsharepoints',
        //calculatePoints: baseUrl + 'calculate-points',
        //getuserpoints: baseUrl + 'getuserpoints',
        //userEnterInRaffleFlow: baseUrl + 'userEnterInRaffleFlow',
        //gettimeremaining: baseUrl + 'gettimeremaining',
        //skipMobileUpdate: baseUrl + 'skip-mobile-Update'

        //Referral Program
        referralCodeRedeemption: baseUrl + 'referral-program-code-redeemption',
        alreadyClaimedReferee : baseUrl + 'alreadyClaimedReferee',
        getReferrerRewards: baseUrl + 'get-referrer-rewards',
        referralCrmEmailNotification : baseUrl + 'referral-crm-email-notification',
        
        //McNuggets
        mcnuggetsStoreShareLogs : baseUrl + 'mcnuggets-store-shareLogs',
        mcnuggetsCodeRedeemption: baseUrl + 'mcnuggets-code-redeemption',
        mcnuggetsChkIfRedeemed: baseUrl + 'mcnuggets-if-redeemed',
        initiateGameTransaction: baseUrl + 'initiate-game-transaction',
        updateGameTransactionScore: baseUrl + 'update-game-transaction-score',
        saveGameTransaction: baseUrl + 'save-game-transaction',
        getTodaysRetries: baseUrl + 'get-game-retry-count',
        mcnuggetsGetProgressData: baseUrl + 'mcnuggets-get-progress-data',
        
        //loyalty template partner codes
        getPartnerCode: baseUrl + 'get-partner-code',
        redeemPartnerCode: baseUrl + 'redeem-partner-code',
        getLoyaltyPartnerUserHistory: baseUrl + 'get-user-history'
    };
  
setInterval(function(){ playDuration++; }, 1000);
        
/**
 * Checks if is in online mode
 * @returns boolean
 */
function isGmalOnlineMode(){
    return (gmalCallMode === 1);
}

/**
 * Checks if is Local
 * @param {type} data
 * @returns {type|String}
 */
function isLocalEnv(){
    return (!isGmalOnlineMode() && isLocal);
}

/**
 * Parse McD response
 * @type type
 */
function parseMcdResponse(data){
    return JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, " ");
}

function getAuthToken(){
    return $('meta[name="auth-token"]').attr('content');
}

/**
 * Calls GMAL API to fetch user data
 * 1: Calling GMAL Get User API, else: Dummy data
 */
document.addEventListener("DOMContentLoaded", function(event){

    event.preventDefault();
    GMAL_RequestTime = new Date().toLocaleString('en-US', {timeZone: timezone});

    showalert('== Campaign Type: ' + campaignType + ' ==');
    showalert('== Market ID: ' + marketId + ' ==');
    showalert('== User Agent: ' + navigator.userAgent + '==');

    if(typeof whileLoadingAction !== 'undefined' ){ whileLoadingAction(); }

    var introScreenDelaySecs = ((typeof initialDelay == 'undefined') ? 3000 : initialDelay);
    
    var onUserDataResponseAction = function(){
        if(isRefarralCampaign || (autoUserDataSetTemplates.indexOf(campaignType) !== -1)){ 
            checkGuestUser(); 
        }else{
            if(campaignType == 29){
                setUserMetaData();
            }
            
            removeLoader('section-mainScreen', introScreenDelaySecs);
        }
        replaceVariable("{{name}}", JSON.parse(userData).firstname);
    };
    
    if(!hasGMAL){
        removeLoader('section-mainScreen', introScreenDelaySecs);
    }else{
        if (isGmalOnlineMode()){

            showalert('== GMAL Online Mode. Request Time:' + GMAL_RequestTime + ' ==');

            document.addEventListener('mcdBridgeReady', function(e){
                
                e.preventDefault();
                showalert('== MCD Brige Connection Done ==');

                user = mcd.bridge.message('user');
                if(user){
                    user.send({"getuser": true});

                    user.on('data', function (data) {
                        GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
                        userData = JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
                        showalert("== Promptlogin data: " + userData);
                    });

                    user.on('done', function (){
                        showalert('== User Data Receive Done ==');
                        onUserDataResponseAction();
                    });

                    user.on('error', function (error){
                        if(error.code){
                            if(error.serverResponse && error.serverResponse.errorCode){
                                showalert('Error Code On Getting User: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                                setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                            }else{
                                showalert('Error Code On Getting User: '+'P-'+error.code+'-0');
                                setErrorCode('P-'+error.code+'-0');
                            }
                        }
                        if(isRefarralCampaign){ openLoginPopup(); }
                        showalert('== Error:' + error);
                        GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
                    });
                }
            });
        }
        else{
            showalert('== GMAL Offline Mode. Request Time: ' + GMAL_RequestTime + ' ==');
            var userDataArr = {
                            "mcdonaldsId": "bearer 10607d2d53cdb7e5a7cb9787f4ab2e7571007e12070b5a94e54b77eb2cd14c2e2337",
                            "firstname": "TestUser",
                            "lastname": "Test",
                            "email": "test123@gmail.com",
                            "deviceId": "1535dfd81b72c20c1",
                            "deviceToken": "bearer 3d2d53cdb7e5a7cb9787f4ab2e7571007e12070b5a94e54b77eb2cd14c2e2337"
                            };
            userData = JSON.stringify(userDataArr);
            onUserDataResponseAction();
        }
    }
});

/**
 * Gets McD App Data
 * @returns {undefined}
 */
getAppData = function(){

    showalert('== Getting System Data ==');
    if (isGmalOnlineMode()){
        system = mcd.bridge.message('system');
        if(system){
            system.send({"getVersion": true});
            system.on('data', function(data){
                appDetails = JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
                if(hasLoyaltyFlow){ getUserLoyaltyPoints(); }
                showalert("== System Data: " + appDetails);
            });
            system.on('error', function(error){
                showalert("System data error: " + JSON.stringify(error));
                if(error.code){
                    if(error.serverResponse && error.serverResponse.errorCode){
                        showalert('Error Code On Getting System Data: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                        setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                    }else{
                        showalert('Error Code On Getting System Data: '+'P-'+error.code+'-0');
                        setErrorCode('P-'+error.code+'-0');
                    }
                }
            });
            system.on('done', function(){ });
        }
    }else{
        appDetails = JSON.stringify({"platform": "web"});
        if(hasLoyaltyFlow){ getUserLoyaltyPoints(); }
    }
};

/**
 * Sets Available Loyalty Points
 * @param {type} pts
 * @returns {undefined}Sets Available Loyalty Points
 */
setAvailableLoyaltyPts = function(pts){

    showalert('== Has Force Loyalty Points: ' + hasForceLoyaltyPoints + ' ==');
    availableLoyaltyPoints = ((pts > 0) ? pts : (hasForceLoyaltyPoints ? forceLoyaltyPoints : 0));
    showalert('== Setting Available Loyalty Points: ' + availableLoyaltyPoints + ' ==');
    if (raffleTemplate == campaignType) {
        if (availableLoyaltyPoints > 0) {
            selectedEntriesInput.prop('max', availableLoyaltyPoints);
            $('#range_slider_value').attr('data-max', availableLoyaltyPoints);
            showalert("==Used Points ="+availableLoyaltyPoints);
            calculatePercentage(0, userId, currentRafflePrizeId, campaignId);
            $('#convertButton').removeClass('hide');
            $('#slideWrap').removeClass('hide');
            $('#noPointsWrap').addClass('hide');
            $('#dealsButton').addClass('hide');
        }
        else{
            $('#convertButton').addClass('hide');
            $('#slideWrap').addClass('hide');
            $('#noPointsWrap').removeClass('hide');
            $('#dealsButton').removeClass('hide');
        }
        $('#fullScreenLoader').addClass('hide');
    }
    setUserLoyaltyPoints();
};

/**
 * Gets User Loyalty Points
 * @returns {undefined}
 */
getUserLoyaltyPoints = function(){

    GMAL_RequestTime = new Date().toLocaleString('en-US', {timeZone: timezone});
    var requestData = {"getPoints": true};

    if (isGmalOnlineMode()){
        showalert('== Getting User Loyalty Points ==');
        deals = mcd.bridge.message('deals');
        deals.send(requestData);
        deals.on('data', function (data) {
            var jsonData = jsonlint.parse(JSON.stringify(data));
            loyaltyPointsData = JSON.stringify(jsonData, null, " ");
            showalert("== Loyalty Points Data: " + loyaltyPointsData + " ==");
            setAvailableLoyaltyPts(jsonData.points);
            storeGmalLogRespone(4, stringify(requestData), loyaltyPointsData);
        });

        deals.on('error', function(error){
            showalert('== Get Loyalty Points Error:' + error);
            if(error.code){
                if(error.serverResponse && error.serverResponse.errorCode){
                    showalert('Error Code On Getting User Loyalty Points: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                    setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                }else{
                    showalert('Error Code On Getting User Loyalty Points: '+'P-'+error.code+'-0');
                    setErrorCode('P-'+error.code+'-0');
                }
            }
            setAvailableLoyaltyPts(0);
            storeGmalLogRespone(4, stringify(requestData), stringify(error));
        });

        deals.on('done', function(){ });
    }else{
        setAvailableLoyaltyPts(0);
        loyaltyPointsData = JSON.stringify({"points": availableLoyaltyPoints});
        storeGmalLogRespone(4, stringify(requestData), loyaltyPointsData);
    }
};

/**
 * Burns User Loyalty Points
 * @returns {undefined}
 */
burnUserLoyaltyPoints = function(pts, onDoneAction, onErrorAction, errorRedirection = true){

    GMAL_RequestTime = new Date().toLocaleString('en-US', {timeZone: timezone});
    var requestData = {"burnPoints": true, "points": -parseInt(pts)};
    if (isGmalOnlineMode()){
        showalert('== Burning Loyalty Points!! ==');
        deals = mcd.bridge.message('deals');
        deals.send(requestData);
        deals.on('data', function (data) {
            var jsonData = jsonlint.parse(JSON.stringify(data));
            loyaltyPointsData = JSON.stringify(jsonData, null, "  ");
            showalert("== Burn Loyalty Points Data: " + loyaltyPointsData + ' ==');
            if(!isUndefined(onDoneAction)) onDoneAction();
            storeGmalLogRespone(5, stringify(requestData), loyaltyPointsData, errorRedirection);
        });

        deals.on('error', function (error) {
            showalert('== Burn Loyalty Points Error:' + error);
            if(error.code){
                if(error.serverResponse && error.serverResponse.errorCode){
                    showalert('Error Code On Burning User Loyalty Points: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                    setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                }else{
                    showalert('Error Code On Burning User Loyalty Points: '+'P-'+error.code+'-0');
                    setErrorCode('P-'+error.code+'-0');
                }
            }
            if(!isUndefined(onErrorAction)) onErrorAction();
            storeGmalLogRespone(5, stringify(requestData), stringify(error), errorRedirection);
        });

        deals.on('done', function(){ });
    }else{
        loyaltyPointsData = JSON.stringify({"success": true});
        storeGmalLogRespone(5, stringify(requestData), loyaltyPointsData, errorRedirection);
        if(!isUndefined(onDoneAction)) onDoneAction();
    }
};

/**
 * Adds Loyalty Points for a user
 * @returns {undefined}
 * Not Being Used at the moment
 */
addUserLoyaltyPoints = function(pts){

    GMAL_RequestTime = new Date().toLocaleString('en-US', {timeZone: timezone});
    if (isGmalOnlineMode()){
        deals = mcd.bridge.message('deals');
        deals.send({"burnPoints": true, "points": parseInt(pts)}); //point should be a +ve number
        deals.on('data', function (data) {
            var jsonData = jsonlint.parse(JSON.stringify(data));
            loyaltyPointsData = JSON.stringify(jsonData, null, "  ");
            setAvailableLoyaltyPts(jsonData.points);
            showalert("Add Loyalty Points Data: " + loyaltyPointsData);
        });

        deals.on('error', function (error) {
            showalert('Add Loyalty Points Error:' + error);
            if(error.code){
                if(error.serverResponse && error.serverResponse.errorCode){
                    showalert('Error Code On Adding User Loyalty Points: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                    setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                }else{
                    showalert('Error Code On Adding User Loyalty Points: '+'P-'+error.code+'-0');
                    setErrorCode('P-'+error.code+'-0');
                }
            }
        });

        deals.on('done', function () {
            showalert("Add Loyalty Points Completed!!");
        });
    }else{
        loyaltyPointsData += pts;
    }
};

/**
 * Opens MCD Login Popup
 * @returns {undefined}
 */
openLoginPopup = function(){

    showalert('== Opening Login Popup ==');
    showInProcessScreen('login', 100);
    user = mcd.bridge.message('user');
    user.send({"promptlogin": true});
    user.on('data', function(data){
        showalert('== Promptlogin Data: ' + JSON.stringify(data) + ' ==');
        userData = JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
        showalert('== User Data:' + userData + ' ==');
        setUserMetaData(true);
    });
};

/**
 * Sets App Orientation
 * @returns {undefined}
 */
setAppOrientation = function(mode){

    if(isUndefined(mode)){ mode = "landscape"; }
    system = mcd.bridge.message('system');
    if(system){
        system.send({"appOrientation" : mode});
        system.on('data', function(data){
            systemData = JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
            showalert("== Set Orientation Data: " + systemData);
        });
        system.on('error', function(error){
            showalert("System data error: " + JSON.stringify(jsonlint.parse(JSON.stringify(error))));
            if(error.code){
                if(error.serverResponse && error.serverResponse.errorCode){
                    showalert('Error Code On Setting App Orientation: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                    setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                }else{
                    showalert('Error Code On Setting App Orientation: '+'P-'+error.code+'-0');
                    setErrorCode('P-'+error.code+'-0');
                }
            }
        });
        system.on('done', function(){
            showalert("== Set orientation Done ==");
            system = mcd.bridge.message('system');
        });
    }
};

/**
 * Toggle Full screen
 * @returns {undefined}
 */
toggleFullScreen = function(mode){

    if(isUndefined(mode)){ mode = true; }
    system = mcd.bridge.message('system');
    if(system){
        system.send({"fullscreen" : mode});
        system.on('data', function(data){
            systemData = JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
            showalert("== Full Screen Data: " + systemData);
            if(mode == true){
                $('body.en').addClass('fullscreen');
            } else if(mode == false){
                $('body.en').removeClass('fullscreen');
            } else{
                $('body.en').removeClass('fullscreen');
            }
        });
        system.on('error', function(error){
            showalert("Full Screen data error: " + JSON.stringify(jsonlint.parse(JSON.stringify(error))));
            if(error.code){
                if(error.serverResponse && error.serverResponse.errorCode){
                    showalert('Error Code On Toggling Full Screen: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                    setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                }else{
                    showalert('Error Code On Toggling Full Screen: '+'P-'+error.code+'-0');
                    setErrorCode('P-'+error.code+'-0');
                }
            }
        });
        system.on('done', function(){
            showalert("== Toggle Full Screen Done ==");
            system = mcd.bridge.message('system');
        });
    }
};

/**
 * Checks MCD Guest User
 * @returns {undefined}
 */
checkGuestUser = function(checkCondition){

    showalert('== Checking if user is logged in or not ==');
    if(isUndefined(checkCondition)) checkCondition = false;

    if(userData){
        showalert('== User Data is set ==');
        setUserMetaData();
    }else{
        showalert('== User Data Not Set ==');
        if(checkCondition){
            if(campaignType == 8){
                if(videoEnded){
                    showalert('== Opening Login Screen ==');
                    openLoginPopup();
                }else{
                    showalert('== Video Not Ended Yet ==');
                    setTimeout(function(){ checkGuestUser(checkCondition); }, 800);
                }
            }else{
                showalert('== Opening Login Screen ==');
                openLoginPopup();
            }
        }else{
            showalert('== Opening Login Screen ==');
            openLoginPopup();
        }
    }
};

checkUserAllowedToProceedForToday = function(screen = "")
{
    showalert('== checkUserAllowedToProceedForToday Starts  =='); 
    var lock = false;
    if (campaignType == 17 || campaignType == 22) 
    {
        showalert('== checkUserAllowedToProceedForToday Campaign ID  =='+ campaignType);
        var xhttp = new XMLHttpRequest(),
        xmlPostData = { lang: language, campaign_id: campaignId, mcd_user_id: userId, timezone: timezone };

        xhttp.onreadystatechange = function(){
            if((this.readyState == 4) && (this.status == 200) && this.responseText){
                var responseTxt = jsonlint.parse(this.responseText);
                showalert('== Blocked User  ==' + JSON.stringify(responseTxt));                
                if (responseTxt.lock) {
                    showalert('== checkUserAllowedToProceedForToday: Locked == ');
                    $('#wentWrongButtonVou').addClass('hide');
                    var messageError = "You have already attempted maximum number of times today. Please come back tomorrow";
                    if (language !== undefined && language == 'ar') {
                        messageError = "لقد استخدمت الحد الأقصى للمحاولات اليوم. من فضلك حاول غداً";
                    }
                    $('#errorMsgVou').text(messageError);
                    setAsCurrentScreen('section-wentWrong');
                }
                else{
                    showalert('== checkUserAllowedToProceedForToday: UnLocked == ');
                    if (screen == "") {
                        if(isTncCheckRequired && !isTncChecked()) {
                            setAsCurrentScreen('section-termsCondtions');
                        }else{
                            onTncCheckedAction();
                        }
                    }
                    else if (screen == 'mainScreen') {
                        removeLoader('section-'+screen, 2000);
                    }
                    else{
                        setAsCurrentScreen('section-'+screen);
                        var messageError = "Something went wrong! Please try again with your voucher code.";
                        if (language !== undefined && language == 'ar') {
                            messageError = "عذراً، لقد حدث خطأ ما! يرجى المحاولة ثانية مع كود قسيمتك.";
                        }
                        $('#errorMsgVou').text(messageError);
                    }
                }
            }else{
                showalert('== checkUserAllowedToProceedForToday Status Not 200  ==');
            }
        };

        xhttp.open("POST", api.checkUserAllowedToProceed, true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
        xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
        xhttp.send(JSON.stringify(xmlPostData));
    }
};

/**
 * Sets User Meta Data
 * @returns {undefined}
 */
setUserMetaData = function(isLoginPopupOpened) {

    showalert('== Setting user data ==');

    if(isUndefined(isLoginPopupOpened)) isLoginPopupOpened = false;

    if(isLoginPopupOpened){ window.ALLOW_PLAY = true ; }

    if(!GMAL_ResponseTime) GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
    
    var xhttp = new XMLHttpRequest(),
        xmlPostData = { lang: language, campaignId: campaignId, userMeta: userData, market: marketCode, gmal_request_time: GMAL_RequestTime, gmal_response_time: GMAL_ResponseTime };

    xhttp.onreadystatechange = function(){
        if((this.readyState == 4) && (this.status == 200) && this.responseText){
            
            showalert('== Raw data : ' + this.responseText);

            var responseTxt = jsonlint.parse(this.responseText);
            showalert('== User data ==' + JSON.stringify(responseTxt));
            
            mcdUserEmail = JSON.parse(userData).email;
            
            userId      = responseTxt.user_id;
            mcdUserId   = responseTxt.mcd_user_id;
            mcdDeviceId = responseTxt.mcdonalds_device_id;
            tnc_checked = responseTxt.tnc_checked;
            game_avatar = responseTxt.game_avatar;
            uniq_code   = responseTxt.uniq_code;
            referral_unique_code   = responseTxt.referral_unique_code;
            mcnuggets_unique_code   = responseTxt.mcnuggets_unique_code;
            lastLevel   = responseTxt.game_level;
            currentLevel = responseTxt.next_level;
            parentTransactionId = responseTxt.parent_transaction_id;
            isRetry      = responseTxt.is_retry;
            retriesCount = responseTxt.retry_count;
            selectedFavoriteTag = responseTxt.favorite_tag_id;
            raffleEntries = responseTxt.raffle_entries;
            gameUniqueId = userId + '' + Date.now();
            
            //if(userId == 10545){ addUserTags('Jeddah_growth_high_points'); } //to be removed later
            showalert('== User ID ==' + userId);
            
            if(isRefarralCampaign){
                setShareUrl();
                if(campaignType == 27){
                    $('.milestone_1_count').html(reward_limit);
                    if(isUndefined(new_user_tag) || new_user_tag == "" || (!isGmalOnlineMode())){
                        chkIfReedeemed();
                    }else{
                        onUserDataSetAction();
                    }
                }else{
                    switch (flowtype) {
                        case 1:
                            $('.milestone_1_count').html(reward_limit);
                            chkIfReedeemed();
                            break;
                        case 3:
                            $('.milestone_1_count').html(mileStone1);
                            $('.milestone_2_count').html(parseInt(mileStone2) - parseInt(mileStone1));
                            chkIfReedeemed();
                            break;
                        case 4:
                            $('.milestone_1_count').html(mileStone1);
                            chkIfReedeemed();
                            break;
                        case 2:
                            alreadyClaimedfunc();
                            break;
                        default:
                            break;
                    }
                }
            }else{
                if(typeof onUserDataSetAction !== 'undefined'){ onUserDataSetAction(); }
                if(campaignType == 28){
                    setShareUrlMcnuggets();
                    mcnuggetsChkIfReedeemed();
                    mcnuggetsGetProgressData();
                    getTodayRetriesCount();
                    initiateMcnuggetsScreenVisit();
                }

                loadLazyImages();

                switch (campaignType){
                    case 8:
                        if(isLoginPopupOpened){ videoEnded = true; }
                        onVideoEnded();
                        break;

                    case 19:   //No claim limit
                    case 20:
                    case 21:
                        if(isTncCheckRequired && !isTncChecked()) {
                            setAsCurrentScreen('section-termsCondtions');
                            fullScreenLoader.addClass('hide');
                        }else{
                            onTncCheckedAction();
                        }
                        break;

                    case 22:
                    case 17:
                        checkUserAllowedToProceedForToday();
                        break;
                        
                    case 25:
                        if(isTncChecked()){
                            onTncCheckedAction();
                        }else{
                            setAsCurrentScreen('section-termsCondtions');
                        }
                        break;
                        
                    case 28:
                        if(isTncChecked()){
                            onTncCheckedAction();
                        }else if(isTncCheckRequired && !isTncChecked()) {
                            updateScreenVisit('tnc');
                            setAsCurrentScreen('section-termsCondtions');
                        }
                        break;
                    case 29:
                        break;
                    // case 30:
                    //     if(isTncChecked()){
                    //         onTncCheckedAction();
                    //     }else if(isTncCheckRequired && !isTncChecked()) {
                    //         setAsCurrentScreen('section-termsCondtions');
                    //     }
                    //     break
                    default:
                        if(isTodaysClaimReached(responseTxt)){
                            isOfferClaimed = true;
                            if(typeof showAlreadyClaimedScreen !== 'undefined'){
                                showAlreadyClaimedScreen();
                            }else{
                                setAsCurrentScreen('section-alreadyClaimed');
                            }
                        }else{
                            if(isTncCheckRequired && !isTncChecked()){
                                setAsCurrentScreen('section-termsCondtions');
                            }else{
                                onTncCheckedAction();
                            }
                        }
                        break;
                }
            }
            getAppData();
        }
    };
    xhttp.open("POST", api.setUserData, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(xmlPostData));
};

/**
 * Checks user type. If High redeemer or low
 * @returns {Boolean}
{
    "success" : true,
    "tags": [
        "device-os-android",
        "OpenedApp_1_14_Days",
        "Activity_NumAppSessionsLast30days_10_plus",
        "OpenedApp_1_28_Days",
        "DK_Form3NotCompleted",
        "OfferRedeemed_2_plus_28_Days",
        "EmailRegistered_7_13_Days",
        "OpenedApp_1_7_Days",
        "se_tag1",
    ]
}
 */
getUserTags = function(highRedeemerTag){

    if (isGmalOnlineMode()){
        showalert('== Get user tags online called ==');
        user = mcd.bridge.message('user');
        if(user){
            user.send({"getTags" : true});
            user.on('data', function(data){
                showalert("Get tags data: " + JSON.stringify(data));
                var response = JSON.parse(JSON.stringify(data));
                showalert('Decoded Tags - '+response.tags);
                storeGmalLogRespone(13, stringify([]), stringify(data));
                if (!isUndefined(highRedeemerTag)) {
                    var matching = tagsMatching(response.tags, highRedeemerTag);
                    showalert('Matching Response - ' + matching);

                    if (matching){ //Logic to be written upon response
                        showalert('tag matched');
                        userDriver = 1;
                        newReferralUser = 1;

                        if(updateHightValueTagStatus.includes(+template_id)){
                            showalert("== updateUserTagStatus called ==");
                            showalert("userId: "+userId+", campaignId: "+campaignId);
                            updateUserTagStatus(userId, campaignId);
                        }
                    } else {
                        showalert("tag did not matched");
                        showalert("user tags: "+JSON.stringify(response.tags));

                        newReferralUser = 0;

                        if(template_id == 27){ 
                            if(isTncCheckRequired && !isTncChecked()){
                                showalert("Tnc is not checked new");
                                setAsCurrentScreen('section-termsCondtions');
                                return;
                            } else {
                                showalert("== showing existing user screen new ==");
                                setAsCurrentScreen('section-introScreenExistingUser');
                            }
                        }
                    }
                }
            });
            user.on('error', function(error){
                newReferralUser = 1;
                if(error.code){
                    if(error.serverResponse && error.serverResponse.errorCode){
                        showalert('Error Code On Getting User Tags: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                        setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                    }else{
                        showalert('Error Code On Getting User Tags: '+'P-'+error.code+'-0');
                        setErrorCode('P-'+error.code+'-0');
                    }
                }
                showalert("== Get tags error: " + JSON.stringify(error));
                storeGmalLogRespone(13, stringify([]), stringify(error));
            });
            user.on('done', function(){
                showalert("== Get tags done ==");
                if(typeof onUserDriverGetAction !== 'undefined'){ onUserDriverGetAction(); }
                if((template_id == 27) && (newReferralUser == 1)){ chkIfReedeemed(); }
            });
        }else{
            showalert("== Get tags error. User not found!");
        }
    }else{
        showalert('== Get user tags offline called ==');
        userDriver = 1;newReferralUser = 1;
        var data = {
            "success" : true,
            "tags": [
                "device-os-android",
                "OpenedApp_1_14_Days",
                "Activity_NumAppSessionsLast30days_10_plus",
                "OpenedApp_1_28_Days",
                "DK_Form3NotCompleted",
                "OfferRedeemed_2_plus_28_Days",
                "EmailRegistered_7_13_Days",
                "OpenedApp_1_7_Days",
                "se_tag1"
            ]
        };
        storeGmalLogRespone(13, stringify([]), stringify(data));
        if(typeof onUserDriverGetAction !== 'undefined'){ onUserDriverGetAction(); }
    }
};

/**
 * Adds user tags
 * @returns {Boolean}
 */
addUserTags = function(tags){
    if(tags){
        if (isGmalOnlineMode()){
            user = mcd.bridge.message('user');
            user.send({"addTags": [tags] });
            user.on('data', function(data){
                showalert("== Add tags: " + JSON.stringify(data));
                storeGmalLogRespone(13, stringify([tags]), stringify(data));
                getUserTags();
            });
            user.on('error', function(error){
                showalert("== Add tags error: " + JSON.stringify(error));
                if(error.code){
                    if(error.serverResponse && error.serverResponse.errorCode){
                        showalert('Error Code On Adding User Tags: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                        setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                    }else{
                        showalert('Error Code On Adding User Tags: '+'P-'+error.code+'-0');
                        setErrorCode('P-'+error.code+'-0');
                    }
                }
                storeGmalLogRespone(13, stringify([tags]), stringify(error));
                getUserTags();
            });
            user.on('done', function(){
                showalert("= Add tags done ==");
            });
        }
        else{
            var data = {'success' : true};
            storeGmalLogRespone(13, stringify([tags]), stringify(data));
            getUserTags();
        }
    }
};

/**
 * Sets User Preference
 * @returns {undefined}
 */
setUserPreference = function(){

};

/**
 * Checks if TnC is Checked
 * @returns {Boolean}
 */
function isTncChecked(){
    return (tnc_checked == 'Y');
}

/**
 * Checks if user can replay game
 * @returns {Boolean}
 */
function userCanReplay(){
    return ((gamePlayCount <= retryLimit) && (availableLoyaltyPoints >= retryPts));
}

/**
 * Checks if Todays Claim Limit is Reached
 * @returns {Boolean}
 */
function isTodaysClaimReached(responseTxt){

    showalert("== Checking if today's limit reached ==");
    var offerClaimReturn = false;
    if(!allowMultipleClaims){
        switch(campaignType){
            case 5:
            case 7:
            case 10:
                isGamePlayed   = responseTxt.game_play_status;
                offerClaimReturn = ((responseTxt.game_play_status == '2') ? true : ((responseTxt.game_play_status == '1') ? (responseTxt.offer_claimed_status == '1') : false));
                break;
            case 14:
                offerClaimReturn = (responseTxt.game_play_status == '0') ? false : true;
                break;

            default:
                offerClaimReturn = responseTxt.offer_claimed_status;
                break;
        }
    }
    return offerClaimReturn;
}

// call CRM

function callCrmForEmailNotification(postData)
{
    showalert("== CRM Post Data:" + JSON.stringify(postData));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)){
            var rsptxt = this.responseText ? JSON.parse(this.responseText) : '';
            showalert(rsptxt);
            if(rsptxt && (rsptxt.success == true)){
                showalert('== Email notification data successfully send ==');   
            }else{
                // showWentWrongScreen('Request Error: Email notification data send fail, success false');
                showalert('== Email notification data send fail==');
            }
        }
    };
    xhttp.onerror = function(){
        showalert('== Email notification data send fail==');
        showWentWrongScreen('Request Error: Email notification data send fail,ajax error');
    };
    xhttp.open("POST", api.loyaltyEmailNotification, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(postData));
}

// call CRM For Referral Email Notification

function callCrmForReferralEmailNotification(data)
{
    showalert("== CRM Post Data:" + JSON.stringify(data));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)){
            var rsptxt = this.responseText ? JSON.parse(this.responseText) : '';
            if(rsptxt && (rsptxt.success == true)){
                showalert('== Referral Crm Email notification data successfully send ==');   
            }else{
                showalert('== Referral Crm Email notification data send fail==');
            }
        }
    };
    xhttp.onerror = function(){
        showalert('== Referral Crm Email notification data send fail==');
        showWentWrongScreen('Request Error: Referral Crm Email notification data send fail,ajax error');
    };
    xhttp.open("POST", api.referralCrmEmailNotification, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(data));
}

// Store Loyalty Transactions to DB

function storeLoyaltyTransaction(onSuccessAction, onErrorAction, configId){

    showalert("== Saving loyalty participation data ==");

    var postData = {
                    campaign_id: campaignId,
                    mcd_user_id: userId,
                    mcdonalds_device_id: mcdDeviceId,
                    language: language,
                    loyalty_pts_used: usedLoyaltyPoints,
                    transaction_type: 1,
                    available_loyalty_pts: availableLoyaltyPoints,
                    config_id : configId
                };

    showalert("== Post Data:" + JSON.stringify(postData));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)){
            var rsptxt = this.responseText ? JSON.parse(this.responseText) : '';
            if(rsptxt && (rsptxt.status === true)){
                postData.tranction_id = rsptxt.transactionId;
                postData.userData = JSON.parse(userData);
                showalert('Campaign Category Id == '+ campaignCategoryId);
                if(campaignCategoryId == 29){
                    showalert('==Skipping CRM notification');
                }else{
                    showalert('==Calling CRM notification');
                    callCrmForEmailNotification(postData);
                }
                
                if(typeof onSuccessAction !== 'undefined') {
                    onSuccessAction(rsptxt.transactionId);
                }
            }else{
                showWentWrongScreen('Request Error: Loyalty Participation Data Save Failed');
            }
        }
    };
    xhttp.onerror = function(){
        showalert('== Loyalty Participation Data Save Failed ==');
        showWentWrongScreen('Request Error: Raffle Participation Data Save Failed');
        if(!isUndefined(onErrorAction)){ onErrorAction(); }
    };
    showalert("ben 3.yim");
    xhttp.open("POST", api.storeTransaction, true);
    showalert("ben 3.yim");
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(postData));
}
    
    
    
    


/**
 * stores Game Transaction Data to DB
 * @param {type} gameScheduleId
 * @param {type} onSuccessAction
 * @returns {undefined}
 */
function startTransaction(onSuccessAction, transactionType, gameObj){

    showalert("== Starting Transaction ==");
    if(typeof transactionType == 'undefined') transactionType = 1;
    var postData = {
                    campaign_id: campaignId,
                    mcd_user_id: userId,
                    mcdonalds_device_id: mcdDeviceId,
                    language: language,
                    parent_id: parentTransactionId,
                    game_level: currentLevel,
                    prize_id: currentRafflePrizeId,
                    transaction_type: transactionType,
                    loyalty_pts_used: usedLoyaltyPoints,
                    game_unique_id: gameUniqueId
                    };
    if(!isUndefined(gameObj)){ postData.game_data = stringify(gameObj); }

    showalert("== Post Data:" + JSON.stringify(postData));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)){
            var rsptxt = this.responseText ? JSON.parse(this.responseText) : '';
            if(rsptxt && (rsptxt.status === true)){
                transactionID = rsptxt.transactionId;
                gameEntryId = rsptxt.gameEntryId;
                if(parentTransactionId == 0){ parentTransactionId = transactionID;}
                if(typeof onSuccessAction !== 'undefined') onSuccessAction();
            }else{
                transactionID = rsptxt.transactionId;
                gameEntryId = rsptxt.gameEntryId;
                if(parentTransactionId == 0){ parentTransactionId = transactionID;}
                if(typeof onSuccessAction !== 'undefined') onSuccessAction();;
            }
        }
    };
    
    showalert("ben 4.yim");
    xhttp.open("POST", api.storeTransaction, true);
    showalert("ben 4.yim");
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(postData));
   
}

/**
 * Updates Game Transaction Data to DB
 * @param {type} gameTransactionId
 * @param {type} onSuccessAction
 * @returns {undefined}
 */
function updateTransaction(onSuccessAction, onErrorAction, gameResult, gameData) {

    showalert('== Updating Transaction ==');

    if(typeof gameResult !== 'undefined'){

        var postData = {
                        campaign_id: campaignId,
                        transaction_id: transactionID,
                        game_entry_id: gameEntryId,
                        game_result: stringify(gameResult),
                        game_play_status: gameResult.game_play_status,
                        app_details: appDetails,
                        available_loyalty_pts: availableLoyaltyPoints,
                        play_duration: playDuration
                    };
        if(!isUndefined(gameData)){ postData.game_data = stringify(gameData); }

        showalert("== Post Data:" + JSON.stringify(postData));

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if((this.readyState == 4) && (this.status == 200)){
                var rsptxt = JSON.parse(this.responseText);
                if(rsptxt.status === true){
                    if(typeof onSuccessAction !== 'undefined'){ onSuccessAction(); }
                }else{
                    if(typeof onSuccessAction !== 'undefined'){ onSuccessAction(); }
                }
            }
        };
        
        };
        xhttp.open("POST", api.updateTransaction, true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
        xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
        xhttp.send(JSON.stringify(postData));
    }


/**
 * Saves user raffle participation data
 * @returns {undefined}
 */
function saveRaffleParticipationData(onSuccessAction, onErrorAction){

    showalert("== Saving user raffle participation data ==");

    var postData = {
                    campaign_id: campaignId,
                    mcd_user_id: userId,
                    mcdonalds_device_id: mcdDeviceId,
                    prize_id: currentRafflePrizeId,
                    loyalty_pts_used: usedLoyaltyPoints
                    };

    showalert("== Post Data:" + JSON.stringify(postData));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)){
            var rsptxt = this.responseText ? JSON.parse(this.responseText) : '';
            if(rsptxt && (rsptxt.status === true)){
                if(typeof onSuccessAction !== 'undefined') onSuccessAction();
            }else{
                showWentWrongScreen('Request Error: Raffle Participation Data Save Failed');
            }
        }
    };
    xhttp.onerror = function(){
        showalert('== Raffle Participation Data Save Failed ==');
        showWentWrongScreen('Request Error: Raffle Participation Data Save Failed');
        if(!isUndefined(onErrorAction)){ onErrorAction(); }
    };
    xhttp.open("POST", api.storeRaffleParticipation, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(postData));
}

/**
 * Stores Offer Activation Data
 * @param {type} status
 * @param {type} requestData
 * @param {type} responseData
 * @param {type} successAction
 * @param {type} errorAction
 * @returns {undefined}
 */
function saveOfferActivationData(status, requestData, responseData, successAction, gameResult, offer_type = 0){

    showalert("Storing Offer Activation Data: Status - " + status + ' :: ' + JSON.stringify(requestData) + ' :: ' + JSON.stringify(responseData) + ' :: ' + JSON.stringify(successAction));
    var postData = {
                campaign_id: campaignId,
                transaction_id: transactionID,
                game_entry_id: gameEntryId,
                lanuage: language,
                userId: userId,
                mcdonalds_device_id: mcdDeviceId,
                offer_activation_status: status,
                offer_type: offer_type,
                gmal_request: requestData,
                gmal_response: responseData,
                gmal_request_time: GMAL_RequestTime,
                gmal_response_time: GMAL_ResponseTime
                };
                
    if(isRefarralCampaign){
        postData.offerId = offerId;
        if(flowtype == 2){ postData.codeRedeemEntryId = codeRedeemEntryId; } //update transaction ID Only for referee
        else if(referralTemplates.includes(27)){postData.codeRedeemEntryId = codeRedeemEntryId;}
    }else if(campaignType == 28){
        postData.offerId = offerId;
        if(mcnuggetsCodeRedeemEntryId){ postData.mcnuggetsCodeRedeemEntryId = mcnuggetsCodeRedeemEntryId; }
    }else if(selectedOfferData){
        postData.offerId = selectedOfferData.offer_id;
    }else{
        postData.offerId = offersData.offer_id;
    }

    if(!isUndefined(gameResult) && gameResult){
        postData.game_result      = stringify(gameResult);
        postData.game_play_status = gameResult.game_play_status;
        // if (!isUndefined(gameResult.voucher_id)) {
        //     postData.voucher_id = gameResult.voucher_id;
        // }
    }

    showalert(postData);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if((this.readyState == 4) && (this.status == 200)){
            var rspTxt = JSON.parse(this.responseText);
            showalert("== Offer Activation Datas: " + JSON.stringify(rspTxt));
            if(rspTxt.success === true){
                if(typeof successAction !== 'undefined') successAction(responseData);
            }else{
                if(typeof successAction !== 'undefined') successAction(responseData);
            }
        }
    };



    xhttp.open("POST", api.postOfferActivationData, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(postData));
}

/**
 * Activate Offer
 * @param {type} loyalty_id
 * @param {type} reward_id
 * @param {type} successAction
 * @param {type} errorAction
 * @returns {undefined}
 */
activateOffer = function (loyalty_id, reward_id, successAction, errorAction, onDoneAction, gameResult, offer_type) {

    GMAL_RequestTime = new Date().toLocaleString('en-US', {timeZone: timezone});

    var offerDataString = { loyaltyId: parseInt(loyalty_id), autoActivate: false, rewardId: parseInt(reward_id)  };
    if(!(reward_id === undefined || loyalty_id === undefined)) {
        if (isGmalOnlineMode()) {
            showalert('offer activation Start with Reward ID: ' + reward_id + " & Loyalty ID :" + loyalty_id);

            var offerActivation = mcd.bridge.message('offerActivation');
            offerActivation.send(offerDataString);

            offerActivation.on('data', function(data) {
                showalert('== offer activation Data Rcvd: ' + JSON.stringify(data));
                GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
                if((template_id == 28) && (tier_claimed_status_array)) { tier_claimed_status_array[parseInt(offer_type) - 1] = 1; }
                saveOfferActivationData('1', offerDataString, data, successAction, gameResult, offer_type);
            });

            offerActivation.on('error', function(data) {
                showalert('GMAL Offer Activation Failed: ' + JSON.stringify(data));
                GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
                if(data.code){
                    if(data.serverResponse && data.serverResponse.errorCode){
                        showalert('Error Code On Offer Activation: '+'P-'+data.code+'-'+data.serverResponse.errorCode);
                        setErrorCode('P-'+data.code+'-'+data.serverResponse.errorCode);
                    }else{
                        showalert('Error Code On Offer Activation: '+'P-'+data.code+'-0');
                        setErrorCode('P-'+data.code+'-0');
                    }
                }
                saveOfferActivationData('2', offerDataString, data, errorAction, gameResult, offer_type);
            });

            offerActivation.on('done', function(){
                showalert("== Offer Activation Process Done ==");
                if(!isUndefined(onDoneAction)) onDoneAction();
            });

        }else{
            showalert('offer activation Start Offline with Reward ID: ' + reward_id + " & Loyalty ID :" + loyalty_id);

            GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
            if((template_id == 28) && (tier_claimed_status_array)) { tier_claimed_status_array[parseInt(offer_type) - 1] = 1; }
            showalert('GMAL Offline Activation. ' + GMAL_ResponseTime);
            if((template_id == 28) && (tier_claimed_status_array)) { tier_claimed_status_array[parseInt(offer_type) - 1] = 1; }
            var isSuccess = true, activationStatus = (isSuccess ? '1' : '0');
            saveOfferActivationData(activationStatus, offerDataString, isSuccess, successAction, gameResult, offer_type);
        }
    }else{
        showalert('offer activation - Reward id or Loyalty id undefined. Moving on to next step.');
    }
};

/**
 * Activate Offer For Welcome & No Reward
 * @param {type} offer_id
 * @param {type} reward_type
 * @param {type} successAction
 * @param {type} gameResult
 * @returns {undefined}
 */
activateOfferForWelcomeAndNoReward = function (offer_id, reward_type, successAction, gameResult) {

    GMAL_RequestTime = new Date().toLocaleString('en-US', {timeZone: timezone});
    var offerDataString = { offerId: parseInt(offer_id), autoActivate: false, reward_type: reward_type };
    if(!(offer_id === undefined)) {
            showalert('offer activation Start Offline with Reward Type: ' + reward_type + " & Offer ID :" + offer_id);

            GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
            showalert('GMAL Offline Activation For Welcome And No Reward. ' + GMAL_ResponseTime);

            var isSuccess = true, activationStatus = (isSuccess ? '1' : '0');
            saveOfferActivationData(activationStatus, offerDataString, isSuccess, successAction, gameResult);
    }else{
        showalert('offer activation For Welcome And No Reward - Offer Id is Undefined. Moving on to next step.');
    }
};

/**
 * Updates Terms & Condition Accepatance
 * @returns {undefined}
 */
function postAcceptTerms(onSuccessAction){
    let is_email_enabled = "";
    is_email_enabled = $("#tnc-check-value").val();
    
    var postData = {user_id: userId, campaign_id: campaignId, is_email_enabled};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            showalert('TnC Accept:' + this.responseText);
            if(typeof onSuccessAction !== 'undefined') onSuccessAction(this.responseText);
        }
    };
    xhttp.onerror = function(){
        showalert('TnC Accept:' + this.responseText);
        if(typeof onSuccessAction !== 'undefined') onSuccessAction(this.responseText);
    };
    xhttp.open("POST", api.tnc_update, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(postData));
}

/**
 * Stores Gmal Logs
 * @param apiType
 * @param gmalRequest
 * @param gmalResponse
 */
function storeGmalLogRespone(apiType, gmalRequest, gmalResponse, errorRedirection = true){
    
    if (!isUndefined(userId) && userId > 0){
        
        GMAL_ResponseTime = new Date().toLocaleString('en-US', {timeZone: timezone});
        var xmlPostData = {
                        campaign_id: campaignId,
                        language: language,
                        mcd_user_id: userId,
                        api_type: apiType,
                        gmal_request: gmalRequest,
                        gmal_response: gmalResponse,
                        request_time: GMAL_RequestTime,
                        response_time: GMAL_ResponseTime
                    };

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            
            if ((this.readyState == 4) && (this.status == 200)){
                var rspTxt = JSON.parse(this.responseText);
                if(rspTxt.status == true){ gmalLogId = rspTxt.gmalLogId; }
                showalert('== Gmal Log Inserted: ' + this.responseText);
            }
        };
        xhttp.onerror = function(){
            showalert('== Error Storing Gmal Log ==');
            if(errorRedirection){
                showWentWrongScreen('Error Storing Gmal Log');
            }
        };
        xhttp.open("POST", api.storeGmalLog, true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
        xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
        xhttp.send(JSON.stringify(xmlPostData));
    }
}

/**
 * Gets User Raffle Registration & Points Data
 * @param {function} onSuccessAction On Success Action
 */
getUserRaffleData = function(onSuccessAction){

    var xmlPostData = JSON.stringify({
                                    campaign_code: campaignCode,
                                    prize_id: currentRafflePrizeId,
                                    mcdonalds_id: mcdUserId,
                                    mcdonalds_device_id: mcdDeviceId
                                    });

    showalert("== Getting Raffle Points. Post Data: " + xmlPostData + " ==");

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            showalert(this.responseText);
            var responseObj = JSON.parse(this.responseText);
            if(responseObj.success == true){
                isUserRegistered   = responseObj.isUserRegistered;
                registeredUserData = responseObj.registeredUserData;
                userRafflePoints   = ((responseObj.total_points != null) ? responseObj.total_points : 0);
                if(!isUndefined(onSuccessAction)){ onSuccessAction(); }
            }else{
                showWentWrongScreen('User data not found');
            }
        }
    });

    xhr.open("POST", api.getUserRaffleData);
    xhr.setRequestHeader("authorization", "Basic YjVXViZtdmckclZ1cUQrazpiaGY2WVlVR0YkclZ1cUQraw==");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(xmlPostData);
};

/**
 * Updates user Raffle Points Data
 * @param {int} point raffle points
 * @param {function} onSuccessAction On Success Action
 */
updateUserRafflePoints = function(point, onSuccessAction) {

    var xmlPostData = JSON.stringify({
                                    campaign_code: campaignCode,
                                    prize_id: currentRafflePrizeId,
                                    mcdonalds_id: mcdUserId,
                                    mcdonalds_device_id: mcdDeviceId,
                                    point: point,
                                    type: ((isBonusLevel()) ? 'bonus' : 'level'),
                                    booster: ((isBonusLevel()) ? '1' : parseInt(gameData.points_multiplier))
                                    });

    showalert("== Updating Raffle Points. Post Data: " + xmlPostData + " ==");

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function(){
        if (this.readyState === 4) {
            showalert(this.responseText);
            var responseObj = JSON.parse(this.responseText);
            if(responseObj.success == true){
                userRafflePoints = ((responseObj.total_points != null) ? responseObj.total_points : 0);
                if(!isUndefined(onSuccessAction)){ onSuccessAction(responseObj); }
            } else {
                showWentWrongScreen('Failed updating raffle points');
            }
        }
    });

    xhr.open("POST", api.updateUserRafflePoints);
    xhr.setRequestHeader("authorization", "Basic YjVXViZtdmckclZ1cUQrazpiaGY2WVlVR0YkclZ1cUQraw==");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(xmlPostData);
};

/**
 * Sets User Favorite Tag
 * @param {int} selected tag id
 * @param {function} onSuccessAction On Success Action
 */
setUserFavoriteTag = function(tagId, onSuccessAction) {

    var xmlPostData = {
                    campaign_id: campaignId,
                    mcd_user_id: userId,
                    tag_id: tagId
                    };

    showalert("== Setting User Favorite Tag. Post Data: " + xmlPostData + " ==");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if ((this.readyState == 4) && (this.status == 200)){
            var rspTxt = JSON.parse(this.responseText);
            selectedFavoriteTag = tagId;
            showalert('== User Favorite Tag Updated : ' + this.responseText);
            if(typeof onSuccessAction !== 'undefined') onSuccessAction(this.responseText);
        }
    };
    xhttp.onerror = function(){
        showalert('== Error Updating User Favorite ==');
        showWentWrongScreen('Error Updating User Favorite');
    };
    xhttp.open("POST", api.setUserFavTag, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(xmlPostData));
};

/*** Unused Function ****/
/**
 * Gets scheduled Games Data
 * @returns {undefined}
 */
getGameData = function(){

    showalert('== Getting Game Data ==');
    var xhttp = new XMLHttpRequest(), xmlPostData = {market_id: marketId};
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var responseTxt = jsonlint.parse(this.responseText);
            if((typeof responseTxt.success !== 'undefined') && (responseTxt.success == true)){
                allGameData = responseTxt.gameData;
            }
        }
    };
    xhttp.open("POST", api.getGameData, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(xmlPostData));
};

/**
 * Gets scheduled Offers Data
 * @returns {undefined}
 */
getOfferData = function(){

    showalert('== Getting Offer Data ==');
    var xhttp = new XMLHttpRequest(), xmlPostData = {market_id: marketId};
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var responseTxt = jsonlint.parse(this.responseText);
            if((typeof responseTxt.success !== 'undefined') && (responseTxt.success == true)){
                allOfferData = responseTxt.offerData;
            }
        }
    };
    xhttp.open("POST", api.getOfferData, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(xmlPostData));
};

/**
 * activateTMSOffer
 * @returns {undefined}
 */
activateTMSOffer = function(tmsPrizeId, screenSection){

    showalert('== Activating TMS Offer Data ==');
    
    if(isUndefined(screenSection)){ screenSection = "section-OfferPage"; }
    
    var xhttpOffer = new XMLHttpRequest(), xmlPostData = {prize_id: tmsPrizeId, campaign_id: campaignId};
    
    xhttpOffer.onreadystatechange = function(){
        if((this.readyState == 4) && (this.status == 200) && this.responseText){
            var responseTxt = JSON.parse(this.responseText);
            showalert("== activateTMSOffer Response == "+this.responseText);

            if (responseTxt.status && responseTxt.data.gmal_reward_id > 0 && responseTxt.data.gmal_loyalty_id > 0) {
                var key = 'offer_image_'+language;
                $('.tms-reward-image').attr('src', responseTxt.data[key]);
                gmalLoyaltyId = responseTxt.data.gmal_loyalty_id;
                gmalRewardId  = responseTxt.data.gmal_reward_id;
                showalert("==== Offer Plexure Details ===" + gmalLoyaltyId + "," + gmalRewardId);
                processOfferActivation(gmalLoyaltyId, gmalRewardId, {}, screenSection);
            }
            else{
                showalert("==== Offer response incorrect ===");
                setAsCurrentScreen("section-wentWrong");
            }
        }
    };
    xhttpOffer.open("POST", api.tmsPrizeDetails, true);
    xhttpOffer.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttpOffer.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttpOffer.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttpOffer.send(JSON.stringify(xmlPostData));
};

/**
 * Gets McD Scan Data
 * @returns {undefined}
 */
getScanData = function(){
     
    // var scanDetails = false;
    showalert('== Getting Scan Data ==');
    var requestData = [];
    if (isGmalOnlineMode()){
        var user = mcd.bridge.message('scanner'); //access to scanner bridge
        if(user){
            user.send({
                "scanner":true,
                "mode":"OCR",
                "tooltip":"",
                "regex": "^[a-zA-Z0-9-_]+$"
            });
            user.on('data', function(data){
                // var scanDetails = JSON.stringify(jsonlint.parse(JSON.stringify(data)), null, "  ");
                // var scanDetails = jsonlint.parse(JSON.stringify(data));
                // showalert(scanDetails);
                var jsonResponse = JSON.stringify(data);
                var scanDetails = JSON.parse(JSON.stringify(data));

                showalert("Get scanner data: " + jsonResponse);
                showalert('Scanned Data - '+scanDetails.scannedData);
                
                vouchercode = scanDetails.scannedData;
                showalert('voucherCode = '+vouchercode+' '+vouchercode.length);
                
                if (verifyVoucherPattern(vouchercode)) {
                    scanCode();
                    openInfoPopup();
                    $('#btn_check_voucher_code').removeClass('btn-disabled');
                }
                storeGmalLogRespone(6, stringify(requestData), jsonResponse);
            });
            user.on('error', function(error){
                scanDetails = JSON.stringify(error);
                if(error.code){
                    if(error.serverResponse && error.serverResponse.errorCode){
                        showalert('Error Code On Getting Scan Data: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                        setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                    }else{
                        showalert('Error Code On Getting Scan Data: '+'P-'+error.code+'-0');
                        setErrorCode('P-'+error.code+'-0');
                    }
                }
                showWentWrongScreenVou("Your voucher code unrecognizable.");
                showalert("System scan data error: " + JSON.stringify(error));
                storeGmalLogRespone(6, stringify(requestData), scanDetails);
            });
            user.on('done', function(){ });
        }
    }else{
        scanDetails = jsonlint.parse(JSON.stringify({"scannedData": "JNN-cugd-kRLr"}));
        showalert(scanDetails);
        vouchercode = scanDetails.scannedData;
        showalert('voucherCode = '+vouchercode+' '+vouchercode.length);
        if (verifyVoucherPattern(vouchercode)) {
            scanCode();
            openInfoPopup();
            $('#btn_check_voucher_code').removeClass('btn-disabled');
        }
        storeGmalLogRespone(6, stringify(requestData), scanDetails);
    }
};

/**
 * Gets QR Code Data
 */
getQRCodeData = function (onSuccessAction, onErrorAction, OnDoneAction) {

    // var scanDetails = false;
    showalert('== Getting Scan Data ==');
    var requestData = [];
    if (isGmalOnlineMode()) {
        var scanner = mcd.bridge.message('scanner'); //access to scanner bridge
        if (scanner) {
            scanner.send({
                "scanner": true,
                "mode": "qr", //can be sent as qr, barcode, OCR
                "tooltip": "Center the QR code in the viewfinder to scan it" //optional field, this copy will be displayed in the scanner, which you can use to tell what user are suppose todo
            });
            scanner.on('data', function (data) {
                if (typeof onSuccessAction !== 'undefined'){ onSuccessAction(data); }
                storeGmalLogRespone(6, stringify(requestData), JSON.stringify(data));
            });
            scanner.on('error', function (error) {
                if(error.code){
                    if(error.serverResponse && error.serverResponse.errorCode){
                        showalert('Error Code On Getting QR Code Data: '+'P-'+error.code+'-'+error.serverResponse.errorCode);
                        setErrorCode('P-'+error.code+'-'+error.serverResponse.errorCode);
                    }else{
                        showalert('Error Code On Getting QR Code Data: '+'P-'+error.code+'-0');
                        setErrorCode('P-'+error.code+'-0');
                    }
                }
                if (typeof onErrorAction !== 'undefined'){ onErrorAction(error); }
                storeGmalLogRespone(6, stringify(requestData), JSON.stringify(error));
            });
            scanner.on('done', function () {
                if (typeof OnDoneAction !== 'undefined'){ OnDoneAction(); }
            });
        }
    } else {
        var scannedData = {"scannedData": "CDX6D-3HM6R-PGDMM-7RCLC-CCCCC-KFC"};
        if (typeof onSuccessAction !== 'undefined'){
            onSuccessAction(scannedData);
        }
        storeGmalLogRespone(6, stringify(requestData), jsonlint.parse(JSON.stringify(scannedData)));
    }
};


/**
 * call API Function
 */
localApiCallTms = function(endPointUrl, requestData, onSuccessAction, sendAuthorization){
    showalert('== Starting local API Call ==' + endPointUrl);
    if(isUndefined(sendAuthorization)){ sendAuthorization = true; }
    if(sendAuthorization && apiToken){ requestData.token = apiToken; }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var responseTxt = this.responseText;
            responseTxt = JSON.parse(responseTxt);
            showalert("Local API Response:" + JSON.stringify(responseTxt));
            if (typeof onSuccessAction !== 'undefined'){ onSuccessAction(responseTxt); }
        }
    };
    xhttp.open("POST", endPointUrl, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
    xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
    xhttp.send(JSON.stringify(requestData));
};

/**
 * call API Function
 */
 processApiCallTms = function(endPointUrl, requestData, onSuccessAction, sendAuthorization,apiType){
     
    if(userData){  
        if(isUndefined(sendAuthorization)){ sendAuthorization = true; }
        if(sendAuthorization && apiToken){ requestData.token = apiToken; }
        showalert('== processApiCallTms Called ==');
        var xhttp = new XMLHttpRequest();
        var callCount = 1;
        if(callCount == 1){
            xhttp.onreadystatechange = function(){
                callCount = callCount+1;
                if (this.readyState == 4 && this.status == 200){
                    var responseTxt = parseMcdResponse(this.responseText);
                    if(typeof apiType != "undefined"){ 
                        storeGmalLogRespone(apiType,requestData,responseTxt); 
                    }
                    responseTxt = JSON.parse(JSON.parse(responseTxt));
                    responseTxt.claimToken = requestData.token;
                    responseTxt.claimMcDId = requestData.mcdonaldsID;
                    responseTxt = parseMcdResponse(responseTxt);
                    showalert(responseTxt, true);
                    if (typeof onSuccessAction !== 'undefined'){ onSuccessAction(responseTxt); }
                }
            };
        }
        xhttp.open("POST", endPointUrl, true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader('X-CSRF-TOKEN' , $('meta[name="csrf-token"]').attr('content'));
        xhttp.setRequestHeader('AUTH-TOKEN' , $('meta[name="auth-token"]').attr('content'));
        xhttp.send(JSON.stringify(requestData));
    }else{
        openLoginPopup();
    }

};

wIsError = function(responseData){
    responseData = JSON.parse(responseData);
    isError = typeof responseData.errors == "undefined" ||  typeof responseData.errors[0].errorCode == "undefined" ;
    if(isError){
        return isError;
    }
    return responseData.errors[0].errorCode!=0;
}

/**
 * Gets McD API Call Token
 * @returns {undefined}
 */
getApiToken = function(){
    
    var requestData = { "mcdonaldsID": mcdDeviceId, "emailID": mcdUserEmail , "campaignId": campaignId};
    var onSuccessAction = function(responseData){
        resObj = JSON.parse(responseData);
        if(resObj.valid==false){
            handleErrorApi(wErrors.tokenApiError,resObj.errors[0].errorCode);
        }
        apitokenData = responseData;
        apiToken = responseData.token;
        apiTokenExpiry = responseData.expires;
        worldTmsDataObj.tokenData = responseData;
    };
    console.log(requestData);
    processApiCallTms(api.tmsTokenApi, requestData, onSuccessAction, false,TYPE_WORLD_CUP_TMS_TOKEN_API);  
};

/**
 * Gets McD API Call Token
 * @returns {undefined}
 */
getApiToken2 = function(newDeviceIdForHis, onSuccessActionHis){
    
    var requestData = { "mcdonaldsID": newDeviceIdForHis, "emailID": mcdUserEmail , "campaignId": campaignId};
    var onSuccessAction = function(responseData){
        resObj = JSON.parse(responseData);
        var newRequestData = { "mcdonaldsID": newDeviceIdForHis, "campaignId": campaignId, "token" : resObj.token};
        processApiCallTms(api.tmsStatementApi, newRequestData, onSuccessActionHis, false, TYPE_WORLD_CUP_TMS_STATEMENT_API);
    };
    processApiCallTms(api.tmsTokenApi, requestData, onSuccessAction, false,TYPE_WORLD_CUP_TMS_TOKEN_API);  
};

/**
 * Gets McD API Call Token
 * @returns {undefined}
 */
getApiTokenThenCallIntroScreen = function()
{
    var onSuccessAction = function(responseData){
        resObj = JSON.parse(responseData);
        if(resObj.valid==false){
            handleErrorApi(wErrors.tokenApiError,resObj.errors[0].errorCode);
        }else if(wIsError(responseData) ){
            setAsCurrentScreen('section-wentWrong');
        }else{
            responseData = JSON.parse(responseData);
            apitokenData = responseData;
            apiToken = responseData.token;
            apiTokenExpiry = responseData.expires;
            worldTmsDataObj.tokenData = responseData;
            setAsCurrentScreen('section-mainScreen');
        }
    };
    var requestData = { "mcdonaldsID":  mcdDeviceId , "emailID": mcdUserEmail , "campaignId": campaignId};
    // console.log("====tok "+ mcdUserEmail);
    processApiCallTms(api.tmsTokenApi, requestData, onSuccessAction, false,TYPE_WORLD_CUP_TMS_TOKEN_API);  
};


/**
 * Entry API Function
 */
getEntryApiData = function(worldTmsDataObj, onSuccessAction){
    showalert("=== Entry API Called ===");
    var requestData = { "mcdonaldsID":  mcdDeviceId , "qrCode": worldTmsDataObj.scanDetails.scannedData, "emailID": mcdUserEmail ,"token":worldTmsDataObj.tokenData.token ,"campaignId": campaignId};
    processApiCallTms(api.tmsEntryApi, requestData, onSuccessAction,true,TYPE_WORLD_CUP_TMS_ENTRY_API);
    
};

/**
 * Prize Draw API Function
 */
submitPrizeDrawData = function(dataJson, onSuccessAction){
    
    /*{
	"lastName": "lastname",
        "phoneNumber": "000000000000",	
	"email": "test@test.com",
	"dob": "2000-01-01",
	"residentID": "AAAAA12345"	
    }*/
    cl("pddata "+JSON.stringify(dataJson));
    var userDetailsPlexure = JSON.parse(userData);
    var requestData = { 
        "mcdonaldsID": mcdDeviceId, 
        "firstName": userDetailsPlexure.firstname, 
        "lastName": dataJson.lastName, 
        "email": userDetailsPlexure.email,  
        "phoneNumber": dataJson.phoneNumber, 
        "dob": dataJson.dob
    };

    if(marketId == 1){ 
        requestData.countryCode = 'JE';
        requestData.residentID = dataJson.residentID;
    }
    else if(marketId == 6){
        requestData.countryCode = 'RI';
        requestData.middleName = dataJson.middleName;
    }

    processApiCallTms(api.tmsPrizeDrawApi, requestData, onSuccessAction,true,TYPE_WORLD_CUP_TMS_REDRAW_API);
};

/**
 * Statement API Function
 */
getClaimStatement = function(onSuccessAction){

    var requestData = { "mcdonaldsID": mcdDeviceId, "campaignId": campaignId};
    processApiCallTms(api.tmsStatementApi, requestData, onSuccessAction,true,TYPE_WORLD_CUP_TMS_STATEMENT_API);
};

/**
 * Statement API Function
 */
getClaimStatement2 = function(onSuccessAction, newDeviceIdForHistory){
    getApiToken2(newDeviceIdForHistory, onSuccessAction);
};

/**
 * Submit Claim Form API Function
 */
submitClaimFormData = function(dataJson, onSuccessAction)
{
    dataJson.mcdonaldsID = mcdDeviceId;
    if(dataJson.mcdonaldsDeviceID.length > 5) {
        dataJson.mcdonaldsID = dataJson.mcdonaldsDeviceID;
    }    
    dataJson.campaignId  = campaignId;
    var claimAuth = true;
    if (dataJson.tokenForIWForm.length > 5) {
        var claimAuth = false;
        dataJson.token = dataJson.tokenForIWForm;
    }
    onSuccessAction = function(responseData){
        responseData = JSON.parse(responseData);
        if(responseData.valid==false){
            handleErrorApi(wErrors.claimApiError,responseData.errors[0].errorCode);
        }else if(typeof responseData.winRef !== undefined && responseData.winRef){
            setAsCurrentScreen('section-highValueSuccess');
        }else{
            setAsCurrentScreen('section-wentWrong');
        }
    }
    processApiCallTms(api.tmsClaimApi, dataJson, onSuccessAction, claimAuth, TYPE_WORLD_CUP_TMS_CLAIM_API);
 };

 findJson = function(jsonObj,errorCode){
    for (var key in jsonObj) {
        if(errorCode==key){
            return jsonObj[key];
        }
    }
    return null;
 }

function decryptData(data) {
    decodedString = atob(data);
    
    var utf8Decoder = new TextDecoder('utf-8');
    var utf8Decoded = utf8Decoder.decode(new Uint8Array(decodedString.split('').map(function(c) {
        return c.charCodeAt(0);
    })));
    
    return utf8Decoded;
}
    

