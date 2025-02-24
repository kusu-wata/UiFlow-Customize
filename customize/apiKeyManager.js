// apiKeyManager.js
const ApiKeyManager = {
    registerApiKey: function(apiKey) {
        if (!apiKey) {
            console.error('APIキーが含まれていません。');
            return false;
        }

        // テーブルデータをオブジェクトとして定義
        const tableData = {
            "_type":"core",
            "AllAPIKEY": `"[,${apiKey}]"`,
            "mui_apikey": apiKey,
            "mui_language": "ja",
            "guide":"true",
            "new_user": "false",
            "versionModal": {"display":"hide","ver":"1.14.1"},
            "shortcut_ver": "2"
        };

        try {
            // ローカルストレージにテーブルデータを追加
            for (const [key, value] of Object.entries(tableData)) {
                localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
            console.log('テーブルデータがローカルストレージに追加されました。');

            // セッションストレージにデータを登録
            sessionStorage.setItem('_type', 'core');
            sessionStorage.setItem('mui_apikey', apiKey);
            console.log('セッションストレージにデータが登録されました。');

            return true;
        } catch (error) {
            console.error('データの保存中にエラーが発生しました:', error);
            return false;
        }
    },

    extractApiKeyFromUrl: function(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('apiKey');
        } catch (e) {
            console.error('URLの解析に失敗しました:', e);
            return null;
        }
    }
};

// モジュールをエクスポート
export default ApiKeyManager;