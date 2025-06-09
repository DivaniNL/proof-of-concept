
if (typeof TSDViewer !== 'undefined') {
    if(TSDViewer){
        document.querySelector('#model-alt img').setAttribute('style','visibility: hidden;');
        let $aboutViewer = document.querySelector("#model-alt");
        $aboutViewer.classList.add('debug');
        let paintingFullImg = document.querySelector('#model-alt img');
        var width = paintingFullImg.naturalWidth;
        var height = paintingFullImg.naturalHeight;
        if (width > height){
            modelOrientation = 'hva-pictureframe3-horizontal' /* landscape */
        } else if (width < height){
            modelOrientation = 'hva-pictureframe3-vertical' /* portrait */
        } else {
            modelOrientation = 'hva-pictureframe2' /* vierkant */
        }
        if (height === undefined || width === undefined){
            modelOrientation = 'hva-pictureframe3-horizontal' /* fallback */
        }
        TSDViewer.create($aboutViewer, {
            forceLoad: true,
            model: modelOrientation,
            plugins: 'customiser',
            onLoadComplete: () => {
                $aboutViewer.setTexture({name: 'field1', source: document.querySelector('#model-alt img'), background: '#ff0000', scale: 'cover'}).then(() => { /* callback */ });
                $aboutViewer.setBackground("#2C2926");
                document.querySelector("#model-alt img").remove();
            },
        });
    }
}else{
    console.log('TSD Viewer kan niet worden ingeladen, fukkie wukkie')
}
