/**
 * Ejemplo 3
 * 
 * @author Matias Leone
 *
 */

/**
 * Variables globales
 */
Example3.prototype = {
	mesh : undefined,
}

/**
 * Constructor
 */
function Example3 () {
	
}

/**
 * Iniciar ejemplo
 */
Example3.prototype.init = function() {
	var gl = GuiController.Instance.gl;
	
	
	//Cargar mesh animado
	var loader = new TgcSkeletalLoader();
	this.mesh = loader.loadMeshAndAnimationsFromUrl("Media/models/Mono/Mono-TgcSkeletalMesh.xml", [
			"Media/models/Mono/Crouch-TgcSkeletalAnim.xml",
			"Media/models/Mono/Run-TgcSkeletalAnim.xml"
		]
	);
	
	
	this.mesh.playAnimation("Run", true);
	
	//Camara FPS
	GuiController.Instance.currentCamera = GuiController.Instance.fpsCamera;
	GuiController.Instance.fpsCamera.movementSpeed = 10;
	GuiController.Instance.fpsCamera.jumpSpeed = 10;
}

/**
 * Render
 */
Example3.prototype.render = function(elapsedTime) {
	var gl = GuiController.Instance.gl;
	

	//this.mesh.animateAndRender();
	this.mesh.render();
}


