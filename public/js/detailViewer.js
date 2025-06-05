

let $aboutViewer = document.querySelector("#test2");
TSDViewer.create($aboutViewer, {
    model: 'hva-pictureframe3-horizontal',
    plugins: 'customiser',
    onLoadComplete: () => {
        $aboutViewer.setTexture({name: 'base', source: document.querySelector('#test'), background: '#ff0000', scale: 'contain'}).then(() => { /* callback */ });
    },
});