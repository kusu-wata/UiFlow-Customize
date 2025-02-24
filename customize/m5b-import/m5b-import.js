export function init() {
    console.log('Patch 1 initialized');
}

export function someMethod() {
    console.log('Patch 1 method called');
}

let isfirst = false;

async function m5bImport() {
    if (typeof window.BlocklyEditorService === 'undefined') {
        alert('BlocklyEditorService is not defined');
        return;
    }

    if (isfirst) {
        return;
    }
    isfirst = true;

    console.log('m5bImport');
    // let dataStr = e.target.result;
    const response = await fetch('/customize/m5b-import/m5b/ir.json');
    const data = await response.text();
    let dataStr = data;
    // let _this = this;
    try {
        
        let _this = window.BlocklyEditorService;
        let opts = BlocklyEditorServiceInitE;
        console.log(_this);
        let data = JSON.parse(dataStr)
            , toolboxDom = document.getElementById(opts.toolboxId);
        // let data = JSON.parse(dataStr)
        //     , toolboxDom = document.getElementById('wrapper_blockly_toolbox');
        // alert("addThirdParty")
        eval(data.jscode),
            toolboxDom.children[toolboxDom.children.length - 1].append(window.Blockly.Xml.textToDom(`<category name="${data.category}" colour="${data.color}">${data.blocks.map(e => `<block type="${e}"></block>`).join("")}</category>`));
        let tempBlock = window.Blockly.Xml.workspaceToDom(window.BlocklyEditor);
        _this.storeSrv.loddingMODE.next(!0),
            _this.init(opts, function () {
                window.BlocklyEditor.clear(),
                    window.Blockly.Xml.domToWorkspace(tempBlock, window.BlocklyEditor)
            });
        let newBlocks = [];
        data.blocks.forEach(e => {
            newBlocks.push({
                kind: "block",
                type: `${e}`
            })
        }
        );
        let newcategory = {
            kind: "category",
            name: `${data.category}`,
            colour: `${data.color}`,
            contents: newBlocks
        }
            , customToolbox = window.BlocklyEditor.toolbox_.getToolboxItemById("custom")
            , customTemp = customToolbox.getContents();
        customToolbox.toolboxItems_ && customToolbox.getChildToolboxItems().forEach(e => {
            customTemp.push(e.toolboxItemDef_)
        }
        ),
            customTemp.push(newcategory),
            window.BlocklyEditor.toolbox_.getToolboxItemById("custom").updateFlyoutContents(customTemp),
            setTimeout(() => {
                _this.storeSrv.componentList.next(_this.storeSrv.componentList.value),
                    _this.storeSrv.unitList.next(_this.storeSrv.unitList.value),
                    _this.storeSrv.hatList.next(_this.storeSrv.hatList.value),
                    _this.storeSrv.stampList.next(_this.storeSrv.stampList.value)
            }
                , 1100)
    } catch (ie) {
        console.log(ie)
    }
}

// setTimeout(() => {
//     m5bImport();
// }, 5000
// );


// if (document.readyState === 'loading') {
//     // 読み込み中ならDOMContentLoadedで関数を実行
//     document.addEventListener('DOMContentLoaded', () => {
//         m5bImport();
//     });
// } else {
//     // そうでなければ即実行
//     m5bImport();
// }

// document.addEventListener('DOMContentLoaded', m5bImport);

//     // ページ再表示時にも初期化
//     window.addEventListener('pageshow', function(event) {
//         // if (event.persisted) {
//             m5bImport();
//         // }
//     });

// avatar

// history.replaceState(null, document.getElementsByTagName('title')[0].innerHTML, null);
// window.addEventListener('popstate', function (e) {
//     this.alert("popstates");
//     m5bImport()
// });

// // イベントリスナーを設定
// let isfirst = false;
// window.addEventListener('testChanged', function(e) {
//     alert("aaaaaaaas")
//     // console.log('window.testが変更されました:', e.detail);
//    if (isfirst == false) {
//     m5bImport();
//     isfirst = true;
//    }

// });

// // プロパティを監視する関数
// function watchTest() {
//     let originalValue = window.BlocklyEditorService;
//     alert("watchstart")
    
//     Object.defineProperty(window, 'BlocklyEditorService', {
//         set: function(newValue) {
//             // カスタムイベントを発火
//             const event = new CustomEvent('testChanged', { 
//                 detail: newValue 
//             });
//             window.dispatchEvent(event);
            
//             originalValue = newValue;
//         },
//         get: function() {
//             return originalValue;
//         }
//     });
// }

// // 監視を開始
// watchTest();


window.addEventListener("BlocklyEditorService", function (e) {
    console.log('BlocklyEditorService changed');
    setTimeout(() => {
        m5bImport();
    },1000);
});

function checkm5bloaded() {
    setTimeout(() => {
        if(isfirst == false){
            if (typeof window.BlocklyEditorService === 'undefined') {
                checkm5bloaded();
            } else {
                m5bImport();
            }
        }
    }, 5000)
}

if (document.readyState === 'loading') {
        // 読み込み中ならDOMContentLoadedで関数を実行
        document.addEventListener('DOMContentLoaded', () => {
            checkm5bloaded();
        });
    } else {
        // そうでなければ即実行
        checkm5bloaded();
    }