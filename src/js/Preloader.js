class Preloader {
    constructor(){
        let material = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() }
            },
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        } );
        
        let scene = new THREE.Scene();
        let container = document.createElement("div");
        container.style.height = window.innerHeight + "px";
        container.style.width = window.innerWidth + "px";
        let Renderer = new THREE.WebGLRenderer();

        Renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(Renderer.domElement);
    }
}