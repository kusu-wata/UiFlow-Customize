// pwa.js

// サービスワーカーの登録
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/customize/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// PWAインストール関連の処理
function initializePWA() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // インストールボタンを表示
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.style.display = 'block';
        }
    });

    // インストールボタンのクリックイベント設定
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.addEventListener('click', async () => {
            console.log("aaaaa");
            if (deferredPrompt) {
                console.log("aaaaabbbbb");
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                deferredPrompt = null;
            }
        });
    }
}

// 初期化
registerServiceWorker();
initializePWA();