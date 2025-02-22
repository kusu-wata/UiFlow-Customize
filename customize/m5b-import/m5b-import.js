export function init() {
    console.log('Patch 1 initialized');
}

export function someMethod() {
    console.log('Patch 1 method called');
}

document.addEventListener("DOMContentLoaded", async (event) => {
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
});