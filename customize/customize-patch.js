// customize-patch.js
const patchConfig = {
    enabledPatches: [
      'patch1.js',
      'm5b-import/m5b-import.js'
    ]
  };
  
  async function loadPatchesFromConfig() {
    try {
      for (const patchFile of patchConfig.enabledPatches) {
        try {
          const patch = await import(`./${patchFile}`);
          // パッチの登録や初期化処理
          registerPatch(patch);
        } catch (error) {
          console.error(`Failed to load patch ${patchFile}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to load patch configuration:', error);
    }
  }
  
  function registerPatch(patch) {
    // パッチ登録のロジック
    if (patch.init) {
      patch.init();
    }
  }
  
  // プラグインマネージャークラス
  class PatchManager {
    constructor() {
      this.patches = [];
    }
  
    registerPatch(patch) {
      this.patches.push(patch);
    }
  
    initializePatches() {
      this.patches.forEach(patch => {
        if (typeof patch.init === 'function') {
          patch.init();
        }
      });
    }
  
    runPatchMethod(methodName, ...args) {
      this.patches.forEach(patch => {
        if (typeof patch[methodName] === 'function') {
          patch[methodName](...args);
        }
      });
    }
  }
  
  const patchManager = new PatchManager();
  
  // パッチの読み込みと初期化
  loadPatchesFromConfig();
  
  // グローバルオブジェクトやエクスポートで公開
  window.patchManager = patchManager;
  export { patchManager };