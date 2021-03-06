// ==UserScript==
// @name         MapAtZoneNotifications
// @namespace    https://github.com/slivermasterz/TrimpScripts
// @version      2.2-Sliverz
// @updateURL    https://github.com/slivermasterz/TrimpsScripts/notificationInstall.js
// @description  Notify you when at MapAtZone
// @author       Sliverz
// @include        *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'MapAtZoneNotification-script';
//This can be edited to be your own Github Repository URL.
script.src = 'https://slivermasterz.github.io/TrimpScripts/MapAtZoneNotification.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);
