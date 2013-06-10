/**
 * Ejemplo 1
 * 
 * @author Matias Leone
 *
 */

/**
 * Variables globales
 */
Example1.prototype = {
	scene : undefined,
}
 
/**
 * Constructor
 */
function Example1 () {

}

/**
 * Iniciar ejemplo
 */
Example1.prototype.init = function() {

	var loader = new TgcSceneLoader();
	//this.scene = loader.loadSceneFromUrl("Media/models/Mesa/Mesa-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Sillon/Sillon-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Edificio1/Edificio1-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Robot/Robot-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Box/Box-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Triangle/Triangle-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Deposito/Deposito-TgcScene.xml");
	this.scene = loader.loadSceneFromUrl("Media/models/Sector-Area1/Scene-TgcScene.xml");
	
	
	//Camara FPS
	GuiController.Instance.currentCamera = GuiController.Instance.fpsCamera;
	GuiController.Instance.fpsCamera.movementSpeed = 10;
	GuiController.Instance.fpsCamera.jumpSpeed = 10;
	
}

/**
 * Render
 */
Example1.prototype.render = function(elapsedTime) {
	var gl = GuiController.Instance.gl;
	
	//Render meshes
	for(var i = 0; i < this.scene.meshes.length; i++) {
		this.scene.meshes[i].render();
	}
}

