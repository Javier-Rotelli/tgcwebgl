/**
 * EJEMPLO
 * 
 * @author Matias Leone
 *
 */


/**
 * Constructor
 */
function EJEMPLO () {
    this.scene = undefined;
	
}

/**
 * Iniciar ejemplo
 */
EJEMPLO.prototype.init = function() {
	var gl = GuiController.Instance.gl;
		
	
	//Camara FPS
	GuiController.Instance.currentCamera = GuiController.Instance.fpsCamera;
}

/**
 * Render
 */
EJEMPLO.prototype.render = function(elapsedTime) {
	var gl = GuiController.Instance.gl;
	
}


