import ApiKeyManager from '/customize/apiKeyManager.js';

console.log("testaaaaaaa");
class QRReader {
    constructor() {
        this.startBtn = document.getElementById('start-btn');
        this.closeBtn = document.getElementById('close-btn');
        this.reader = document.getElementById('reader');
        this.video = document.getElementById('video');
        this.result = document.getElementById('result');
        this.overlay = document.querySelector('.overlay');
        this.errorMessage = document.getElementById('error-message');
        this.stream = null;
        this.isScanning = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startScanning());
        this.closeBtn.addEventListener('click', () => this.stopScanning());
        window.addEventListener('beforeunload', () => this.stopScanning());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopScanning();
            }
        });
    }

    async startScanning() {
        try {
            console.log("startScanning pushed", this.isScanning)
            if (this.isScanning) return;
            
            this.isScanning = true;
            this.hideError();
            this.reader.style.display = 'block';
            this.overlay.style.display = 'block';

            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" } 
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            this.scanQRCode();

        } catch (err) {
            this.handleError(err);
        }
    }

    stopScanning() {
        this.isScanning = false;
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.video.srcObject) {
            this.video.srcObject = null;
        }
        this.reader.style.display = 'none';
        this.overlay.style.display = 'none';
        this.hideError();
    }

    handleError(error) {
        console.error('エラーが発生しました:', error);
        let errorMsg = 'エラーが発生しました。';

        switch (error.name) {
            case 'NotAllowedError':
                errorMsg = 'カメラへのアクセスが拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。';
                break;
            case 'NotFoundError':
                errorMsg = 'カメラが見つかりません。';
                break;
            case 'NotReadableError':
                errorMsg = 'カメラにアクセスできません。他のアプリがカメラを使用している可能性があります。';
                break;
            case 'AbortError':
                errorMsg = 'カメラの使用が中断されました。';
                break;
        }

        this.showError(errorMsg);
        this.isScanning = false;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
        this.errorMessage.textContent = '';
    }

    scanQRCode() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const scan = () => {
            if (!this.isScanning) return;

            try {
                if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                    canvas.height = this.video.videoHeight;
                    canvas.width = this.video.videoWidth;
                    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        this.handleQRCode(code.data);
                        return;
                    }
                }
                requestAnimationFrame(scan);
            } catch (error) {
                this.handleError(error);
            }
        };

        scan();
    }

    handleQRCode(data) {
        const apiKey = ApiKeyManager.extractApiKeyFromUrl(data);
        
        if (apiKey) {
            this.result.textContent = `APIキーを検出: ${apiKey}`;
            if (ApiKeyManager.registerApiKey(apiKey)) {
                this.result.textContent += '\n登録成功！リダイレクトします...';
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                this.result.textContent += '\n登録に失敗しました。';
            }
        } else {
            this.result.textContent = 'QRコードからAPIキーを抽出できませんでした。';
        }
        
        this.stopScanning();
    }
}

// QRReaderのインスタンスを作成
const qrReader = new QRReader();