
if (typeof TSDViewer !== 'undefined') {
    if(TSDViewer){
        document.querySelector('#model-alt img').setAttribute('style','visibility: hidden;');
        let $aboutViewer = document.querySelector("#model-alt");
        TSDViewer.create($aboutViewer, {
            forceLoad: true,
            model: 'hva-pictureframe3-horizontal',
            plugins: 'customiser',
            onLoadComplete: () => {
                $aboutViewer.setTexture({name: 'field1', source: document.querySelector('#model-alt img'), background: '#ff0000', scale: 'cover'}).then(() => { /* callback */ });
                $aboutViewer.setBackground("#2C2926");
                document.querySelector("#model-alt img").remove();
                $aboutViewer.classList.add('debug');
            },
        });
    }
}else{
    console.log('TSD Viewer kan niet worden ingeladen, fukkie wukkie')
}
