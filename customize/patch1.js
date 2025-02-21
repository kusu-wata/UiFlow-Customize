export function init() {
    console.log('Patch 1 initialized');
  }
  
  export function someMethod() {
    console.log('Patch 1 method called');
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM は完全に読み込まれ解釈されました");
  });