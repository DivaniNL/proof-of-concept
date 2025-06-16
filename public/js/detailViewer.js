// Check if TDSVIEWER is supported
if (typeof TSDViewer !== 'undefined') {
    if(TSDViewer){
        //Visually remove image if the 3d model can be loaded
        document.querySelector('#model-alt img').setAttribute('style','visibility: hidden;');
        let $aboutViewer = document.querySelector("#model-alt");
        // Debug class added to make the 3d model being lowered in z-index
        $aboutViewer.classList.add('debug');
        let paintingFullImg = document.querySelector('#model-alt img');

        // Check if the image is orientation: landscape or portait, and adjust the chosen model based on that calc
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

        // Create the model
        TSDViewer.create($aboutViewer, {
            forceLoad: true,
            model: modelOrientation,
            plugins: 'customiser',
            onLoadComplete: () => {

                // Set image to artwork of detail page, set background to secondary-bg color and remove the image, becuase the 3d model is now loaded
                $aboutViewer.setTexture({name: 'field1', source: document.querySelector('#model-alt img'), background: '#ff0000', scale: 'cover'}).then(() => { /* callback */ });
                $aboutViewer.setBackground("#2C2926");
                document.querySelector("#model-alt img").remove();
            },
        });
        $aboutViewer.classList.add('loaded');    
    }
}else{
    console.log('TSD Viewer kan niet worden ingeladen, fukkie wukkie')
}
