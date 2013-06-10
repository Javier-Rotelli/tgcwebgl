/**
 * Ejemplo 2
 * 
 * @author Matias Leone
 *
 */

/**
 * Variables globales
 */
Example2.prototype = {
	scene : undefined,
}
 
/**
 * Constructor
 */
function Example2 () {

}

/**
 * Iniciar ejemplo
 */
Example2.prototype.init = function() {
	var gl = GuiController.Instance.gl;
	

	var loader = new TgcSceneLoader();
	//this.scene = loader.loadSceneFromUrl("Media/models/Mesa/Mesa-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Sillon/Sillon-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Edificio1/Edificio1-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Robot/Robot-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Box/Box-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Triangle/Triangle-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Deposito/Deposito-TgcScene.xml");
	
	this.scene = loader.loadSceneFromUrl("Media/models/Sector-Area1/Scene-TgcScene.xml");
	//this.scene = loader.loadSceneFromUrl("Media/models/Sector-Area2/Scene-TgcScene.xml");
	
	
	
	//Camara FPS
	GuiController.Instance.currentCamera = GuiController.Instance.fpsCamera;
	GuiController.Instance.fpsCamera.movementSpeed = 10;
	GuiController.Instance.fpsCamera.jumpSpeed = 10;
}

/**
 * Render
 */
Example2.prototype.render = function(elapsedTime) {
	var gl = GuiController.Instance.gl;
	
	//Render meshes opacos
	for(var i = 0; i < this.scene.meshes.length; i++) {
		if(!this.scene.meshes[i].alphaBlendEnable) {
			if(this.scene.meshes[i].renderType != TgcMesh.MeshRenderType.VERTEX_COLOR) {
				this.scene.meshes[i].render();
			}
		}
	}
	
	//Render meshes con Alpha
	for(var i = 0; i < this.scene.meshes.length; i++) {
		if(this.scene.meshes[i].alphaBlendEnable) {
			this.scene.meshes[i].render();
		}
	}
}


