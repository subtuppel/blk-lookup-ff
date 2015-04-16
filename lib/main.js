var self = require("sdk/self");
var tabs = require("sdk/tabs");
var {
    viewFor
} = require("sdk/view/core");
var window = viewFor(require("sdk/windows").browserWindows[0]);

// basic validation of the selected text in here already
// refine needed?
var script = 'self.on("context", function(){' +
    'var txt = window.getSelection().toString().trim();' +
    'if (txt.length == 34){' +
    "return 'lookup BlackCoin address';} " +
    'if (txt.length == 64){' +
    "return 'lookup BlackCoin transaction';} " +
    "return 'Not a BlackCoin address or transaction';" +
    '});' +
    'self.on("click", function(){' +
    'self.postMessage(window.getSelection().toString());' +
    '});';

var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
    label: "Lookup BlackCoin address or transaction",
    context: contextMenu.SelectionContext(),
    contentScript: script,
    image: self.data.url("blk-16.png"),
    onMessage: function(selectionText) {
        openAddressInfo(selectionText);
    }
});

function openAddressInfo(address) {
    var myUrl = '';
    var text = address.trim();
    var first = text.toLowerCase().substring(0, 1);
    // only alpahnumeric?
    var r = /^[a-z0-9]+$/i
    var match = r.exec(text);
    // also checking length, address is 34 characters, tx 64
    if (match) {
        if (text.length == 34 && first == 'b') {
            myUrl = 'https://chainz.cryptoid.info/blk/address.dws?' + text;
        }
        //// block hash does also have 64 characters
        //// This will always try to open a tx page, no result if the hash was a blick instead
        if (address.length == 64) {
            myUrl = 'https://chainz.cryptoid.info/blk/tx.dws?' + text;
        }
    }
      
    // open new tab if valid address or tx id
    // else notify
    if (myUrl != '') {
        tabs.open(myUrl);
    } else {
        window.alert('Not a BlackCoin address or transaction');
    }
}