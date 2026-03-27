 (function(){
      const urlParams = new URLSearchParams(window.location.search);
      let base64Scene = '';
      if(urlParams.has('scene')) {
        base64Scene = urlParams.get('scene');
      }

      if(!base64Scene) {
        console.error("No se ha proporcionado escena en la URL");
        return;
      }
      VH.init({
        containerId: 'vh-container',
        scene: base64Scene
      });
      history.replaceState({}, '', `?scene=${base64Scene}`);
    })();
