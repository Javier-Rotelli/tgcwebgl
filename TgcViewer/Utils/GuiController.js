/**
 * Controlador principal de la aplicación
 * 
 * @author Matias Leone
 *
 */
 
 
GuiController.NEAR_DISTANCE = 0.1;
GuiController.FAR_DISTANCE = 10000;
GuiController.FIELD_OF_VIEW_Y = 45;
GuiController.UP_VECTOR = vec3.createFrom(0, 1, 0);
 
 
/**
 * Atributos
 */
GuiController.prototype = {
	/**
     * Contexto de WebGL
     * @type WebGLRenderingContext
     */
    gl: undefined,
	
	/**
     * Canvas
     * @type HTMLCanvasElement
     */
    canvas: undefined,
	
	/**
     * Lista de ejemplos
     * @type Array<TgcExample>
     */
    examples: undefined,
	
	/**
     * Ejemplo actual a ejecutar
     * @type TgcExample
     */
    currentExample: undefined,
	
	/**
     * Matriz de View
     * @type mat4
     */
    view: undefined,
	
	/**
     * Matriz de Projection
     * @type mat4
     */
    projection: undefined,
	
	/**
     * Matriz View * World
     * @type mat4
     */
    worldView: undefined,
	
	/**
     * Matriz Proj * View * World
     * @type mat4
     */
    worldViewProj: undefined,
	
	/**
     * Tiempo transcurrido entre frames
     * @type float
     */
    elapsedTime: undefined,
	
	/**
     * Cuadros por segundo (FPS)
     * @type float
     */
    framesPerSecond: undefined,
	
	/**
     * Pool de texturas
     * @type TgcTexturePool
     */
    texturesPool: undefined,
	
	/**
     * Manejo de Input
     * @type TgcInput
     */
    tgcInput: undefined,
	
	/**
     * Camara en primera persona
     * @type TgcFpsCamera
     */
    currentCamera: undefined,
	
	/**
     * Camara en primera persona
     * @type TgcFpsCamera
     */
    fpsCamera: undefined,
	
	/**
     * Shaders comunes del engine
     * @type TgcShaders
     */
    tgcShaders: undefined,
}
 
 
 
/**
 * Constructor privado. No invocar
 */
function GuiController () {
    this.intervalID = -1;
	this.fpsCounterElement = undefined;
}

/**
 * Acceso global Singleton
 */
GuiController.Instance = undefined;

/**
 * Crear instancia de GuiController. Solo invocar una sola vez al inicio de la aplicacion.
 */
GuiController.NewInstance = function() {
	GuiController.Instance = new GuiController();
}


/**
 * Iniciar todo el engine
 * @param {String} canvasID ID de elemento Canvas
 * @param {Array<TgcExample>} examples ejemplos para ejecutar
 * @param {int} defaultExampleIndex indice del ejemplo de examples que se desea ejecutar inicialmente
 */
GuiController.prototype.initGraphics = function(canvasID, examples, defaultExampleIndex) {
	//Crear contexto de WebGL
	this.canvas = document.getElementById(canvasID);
	this.fpsCounterElement = document.getElementById("fpsCounter");
	this.gl = this.createWebGLContext(this.canvas);
	
	//Iniciar ElapsedTime y FPS
	this.startTime = new Date().getTime();
	this.elapsedTime = 0;
	this.lastFps = this.startTime;
    this.framesPerSecond = 0;
    this.frameCount = 0;
	
	//Matrices
	this.view = mat4.create();
	this.projection = mat4.create();
	this.worldView = mat4.create();
	this.worldViewProj = mat4.create();
		
	//Calcular View y Projection
	mat4.lookAt(vec3.createFrom(0, 0, -100), vec3.createFrom(0, 0, 0), GuiController.UP_VECTOR, this.view);
	mat4.perspective(GuiController.FIELD_OF_VIEW_Y, this.canvas.width / this.canvas.height, GuiController.NEAR_DISTANCE, GuiController.FAR_DISTANCE, this.projection);
	
	//Color inicial
	this.gl.clearColor(0.0, 0.0, 0.5, 1.0);
	
	//Valores de Device
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LESS);
	
	//Alpha Blending
	this.gl.disable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.blendEquation (this.gl.FUNC_ADD);
	
	//Iniciar otras herramientas
	this.texturesPool = new TgcTexturePool();
	this.tgcInput = new TgcInput();
	this.fpsCamera = new TgcFpsCamera();
	this.currentCamera = this.fpsCamera;
	this.tgcShaders = new TgcShaders();
	
	/* //TODO: terminar herramientas
	this.fpsCamera = new TgcFpsCamera();
    this.rotCamera = new TgcRotationalCamera();
    this.thirdPersonCamera = new TgcThirdPersonCamera();
	this.currentCamera = this.rotCamera;
	this.frustum = new TgcFrustum();
	this.mp3Player = new TgcMp3Player();
    this.directSound = new TgcDirectSound();
	this.drawer2D = new TgcDrawer2D();
	this.text3d = new TgcDrawText(tgcD3dDevice.D3dDevice);
    */
	
	
	//Iniciar ejemplo
	this.examples = examples;
	this.currentExample = this.examples[defaultExampleIndex];
	this.currentExample.init();
	this.queueNewFrame();
}

/**
 * Inicia el contexto de WebGL
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGLRenderingContext} contexto creado
 */
GuiController.prototype.createWebGLContext = function(canvas) {
	var context;
	var props = { 
		alpha: false 
	};
	if (canvas.getContext) {
		try {
			context = canvas.getContext('webgl', props);
			if(context) { return context; }
		} catch(ex) {}
		try {
			context = canvas.getContext('experimental-webgl', props);
			if(context) { return context; }
		} catch(ex) {}
	}
	
	alert("No se pudo iniciar WebGL");
	TgcUtils.throwException("No se pudo iniciar WebGL");
}


/**
 * Pedir siguiente cuadro de render
 */
GuiController.prototype.queueNewFrame = function () {
	if (window.requestAnimationFrame)
		window.requestAnimationFrame(tgc_callRender);
	else if (window.msRequestAnimationFrame)
		window.msRequestAnimationFrame(tgc_callRender);
	else if (window.webkitRequestAnimationFrame)
		window.webkitRequestAnimationFrame(tgc_callRender);
	else if (window.mozRequestAnimationFrame)
		window.mozRequestAnimationFrame(tgc_callRender);
	else if (window.oRequestAnimationFrame)
		window.oRequestAnimationFrame(tgc_callRender);
	else {
		queueNewFrame = function () {};
		this.intervalID = window.setInterval(tgc_callRender, 16.7);
	}
}

/**
 * Delegate de render() para no perder el scope (y evitar crear un clousure en cada frame)
 */
function tgc_callRender() {
	GuiController.Instance.render.call(GuiController.Instance);
}

/**
 * Render del ejemplo
 */
GuiController.prototype.render = function() {
	//Limpiar pantalla
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	
	//ElapsedTime y FPS
	var timestamp = new Date().getTime();
	this.elapsedTime = (timestamp - this.startTime) / 1000;
	this.startTime = timestamp;
	//Update FPS if a second or more has passed since last FPS update
	if(timestamp - this.lastFps >= 1000) {
		this.framesPerSecond = this.frameCount;
		this.frameCount = 0;
		this.lastFps = timestamp;
	}
	this.frameCount++;
	this.fpsCounterElement.textContent = this.framesPerSecond;
	
	
	//Actualizar input
	this.tgcInput.updateInput();
	
	//Actualizar camara
	this.currentCamera.updateCamera();
	this.currentCamera.updateViewMatrix();
	
	//Invocar ejemplo
	this.currentExample.render(this.elapsedTime);
	
	
	//Pedir siguiente cuadro
	this.queueNewFrame();
}

 /**
 * Computar las matrices auxiliares worldView y worldViewProj en base a la matriz
 * de world especificada
 *
 * @param {mat4} world
 **/
GuiController.prototype.computeWorldMatrices = function(world) {
	//P * V * W
	mat4.multiply(this.view, world, this.worldView);
	mat4.multiply(this.projection, this.worldView, this.worldViewProj);
}


