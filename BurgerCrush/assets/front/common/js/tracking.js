/*
 * JS file for all social tracking scripts
 */
var showGTMLog = false;
if(gtmTrackingId){
    
    (function(w, d, s, l, i){w[l] = w[l] || []; w[l].push({'gtm.start':
    new Date().getTime(), event:'gtm.js'}); var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer'?'&l=' + l:''; j.async = true; j.src =
    'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmTrackingId);

    window.dataLayer = window.dataLayer || [];

    function gtag(){ dataLayer.push(arguments); }

    gtag('js', new Date());
    gtag('config', gtmTrackingId);

    //gtag('consent', 'update', {'ad_storage': 'granted', 'analytics_storage': 'granted'});
    //dataLayer.push({ 'event': 'default_consent' });

    dataLayer.push({ 'campaignLocation': marketName, 'campaignCode': campaignCode });

    dataLayer.push({
                    event: "gaCampaignVisit",
                    gaEventaction: 'Campaign Visit',
                    gaEventCategory: marketName,
                    gaEventLabel: campaignCode
                    });
}

var googleTrackEvent = function(category, action, label){    
    dataLayer.push({
            event: "gaEvent",
            gaEventCategory: category,
            gaEventaction: action,
            gaEventLabel: label.toLowerCase()
    });
    if(showGTMLog){ showalert('== GTM: ' + label); }
};

var trackEvent = function (type, title){
    
    if(gtmTrackingId){

        switch(type){
            case 'btn_click':
                googleTrackEvent("Page Body Interaction", "Button Click", title);
                break;

            case 'screen_display':
                googleTrackEvent("Page Body Interaction", "Screen Display", title);
                break;

            case 'go_to_deals':
                googleTrackEvent("Outbound Link Click", "MCD Go To Deals Button Click", title);
                break;

            case 'gmal_call':
                //googleTrackEvent("Page Body Interaction", "GMAL Call Done", title);
                break;

            case 'whatsapp':
                googleTrackEvent("Outbound Link Click", "Whatsapp Share Button Click", title);
                break;

            case 'message':
                googleTrackEvent("Outbound Link Click", "Message Share Button Click", title);
                break;

            case 'code_redemption':
                googleTrackEvent("Code redeemed", "Code redeemed success", title);
                break;

            case 'fb_share':
                googleTrackEvent("Outbound Link Click", "Facebook Share Button Click", title);
                break;

            case 'went_wrong':
                googleTrackEvent("Page Body Interaction", "Something Went Wrong", title);
                break;
                
            case 'popup_display':
                googleTrackEvent("Page Body Interaction", "Popup Display", title);
                break;
                
            case 'popup_closed':
                googleTrackEvent("Page Body Interaction", "Popup Closed", title);
                break;

            default:
                break;
        }
    }
};