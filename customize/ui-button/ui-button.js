// DOM変更を監視するベースクラス
class DOMObserver {
    constructor() {
        this.observer = null;
    }

    observe(targetElement = document.body, options = { childList: true, subtree: true }) {
        this.observer = new MutationObserver((mutations) => this.handleMutations(mutations));
        this.observer.observe(targetElement, options);
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    handleMutations(mutations) {
        throw new Error('handleMutations must be implemented');
    }
}

// 要素追加を管理するクラス
class ShortcutIconAdder extends DOMObserver {
    constructor() {
        super();
        this.targetClasses = ['list--btn', 'ng-tns-c55-0'];
        this.elementCreators = [];
    }

    // 要素を作成する関数を追加
    addElementCreator(creator) {
        if (typeof creator === 'function') {
            this.elementCreators.push(creator);
        } else {
            throw new Error('Element creator must be a function');
        }
    }

    handleMutations(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (this.isTargetElement(node)) {
                    this.addElements(node);
                }
            });
        });
    }

    isTargetElement(node) {
        console.log(node.classList)
        return (
            node.nodeType === 1 && 
            this.targetClasses.every(className => node.classList.contains(className))
        );
    }

    // 登録された全ての要素を追加
    addElements(targetElement) {
        this.elementCreators.forEach(creator => {
            const element = creator();
            if (element instanceof Element) {
                targetElement.appendChild(element);
            }
        });
    }
}

// 使用例
const shortcutIconAdder = new ShortcutIconAdder();

// ショートカットアイコンを作成する関数を追加
shortcutIconAdder.addElementCreator(() => {
    const span = document.createElement('span');
    span.setAttribute('_ngcontent-yxj-c55', '');
    span.classList.add('shortcut-icon', 'ng-tns-c55-0');

    const svg = document.createElement('svg');
    span.appendChild(svg);
    span.appendChild(document.createComment(''));

    return span;
});

// 他の要素を追加する例
shortcutIconAdder.addElementCreator(() => {
    const div = document.createElement('div');
    div.classList.add('custom-element');
    div.textContent = 'Additional Element';
    return div;
});

// 監視開始
shortcutIconAdder.observe();

// 使用例：特定の要素のみを監視する場合
// const targetElement = document.querySelector('#specific-container');
// shortcutIconAdder.observe(targetElement);

// 監視停止
// shortcutIconAdder.disconnect();