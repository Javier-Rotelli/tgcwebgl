/**
 * Cámara en primera persona, con movimientos: W, A, S, D, Space, LeftControl
 *
 * @author Matias Leone
 */
 
 
/**
 * Constantes de movimiento
 */
TgcFpsCamera.DEFAULT_ROTATION_SPEED = 0.5;
TgcFpsCamera.DEFAULT_MOVEMENT_SPEED = 100;
TgcFpsCamera.DEFAULT_JUMP_SPEED = 100;

 
 
/**
 * Atributos
 */
TgcFpsCamera.prototype = {
	/**
     * Velocidad de rotacion de la cámara, en radianes
     * @type float
     */
    rotationSpeed: TgcFpsCamera.DEFAULT_ROTATION_SPEED,
	
	/**
     * Velocidad de desplazamiento de los ejes XZ de la cámara
     * @type float
     */
    movementSpeed: TgcFpsCamera.DEFAULT_MOVEMENT_SPEED,
	
	/**
     * Velocidad de desplazamiento del eje Y de la cámara
     * @type float
     */
    jumpSpeed: TgcFpsCamera.DEFAULT_JUMP_SPEED,
	
	/**
     * Posicion actual de la camara
     * @type vec3
     */
    position: vec3.createFrom(0, 0, 0),
	
	/**
     * Punto hacia donde mira la cámara
     * @type vec3
     */
    lookAt: vec3.createFrom(0, 0, 0),
	
	/**
     * Rotacion actual en el eje Y (mirar hacia los costados), en radianes
     * @type float
     */
    currentRotY: 0,
	
	/**
     * Rotacion actual en XZ (mirar hacia arriba-abajo), en radianes
     * @type float
     */
    currentRotXZ: 0,
}
	
 
 
/**
 * Constructor
 */
function TgcFpsCamera () {

}

/**
 * Actualizar el estado interno de la cámara en cada frame
 **/
TgcFpsCamera.prototype.updateCamera = function() {
	var elapsedTime = GuiController.Instance.elapsedTime;
	var tgcInput = GuiController.Instance.tgcInput;
	
	var forwardMovement = 0;
	var strafeMovement = 0;
	var jumpMovement = 0;
	var xzRotation = 0;
	var yRotation = 0;
	var moving = false;
	var rotating = false;
	
	//Analizar input de teclado
	if(tgcInput.keyDown(TgcInput.Keys.W)) {
		forwardMovement = this.movementSpeed;
		moving = true;
	} else if(tgcInput.keyDown(TgcInput.Keys.S)) {
		forwardMovement = -this.movementSpeed;
		moving = true;
	}
	if(tgcInput.keyDown(TgcInput.Keys.A)) {
		strafeMovement = this.movementSpeed;
		moving = true;
	} else if(tgcInput.keyDown(TgcInput.Keys.D)) {
		strafeMovement = -this.movementSpeed;
		moving = true;
	}
	if(tgcInput.keyDown(TgcInput.Keys.SPACE)) {
		jumpMovement = this.jumpSpeed;
		moving = true;
	} else if(tgcInput.keyDown(TgcInput.Keys.CTRL)) {
		jumpMovement = -this.jumpSpeed;
		moving = true;
	}
	
	//Analizar mouse
	if(tgcInput.buttonDown(TgcInput.MouseButtons.BUTTON_LEFT)) {
		yRotation = -tgcInput.xPosRelative * this.rotationSpeed;
		xzRotation = -tgcInput.yPosRelative * this.rotationSpeed;
		rotating = true;
	}
	

	//Acumular rotacion
	this.currentRotY += yRotation * elapsedTime;
	this.currentRotXZ += xzRotation * elapsedTime;
	
	//Clamp de rotacion XZ entre [-PI/2, PI/2]
	this.currentRotXZ = this.currentRotXZ > FastMath.PI_HALF ? FastMath.PI_HALF : this.currentRotXZ;
	this.currentRotXZ = this.currentRotXZ < -FastMath.PI_HALF ? -FastMath.PI_HALF : this.currentRotXZ;
	
	//Wrap de rotacion Y entre [0, 2PI]
	this.currentRotY = this.currentRotY > FastMath.TWO_PI ? this.currentRotY - FastMath.TWO_PI : this.currentRotY;
	this.currentRotY = this.currentRotY < 0 ? FastMath.TWO_PI + this.currentRotY : this.currentRotY;
	

	
	//Obtener angulos de direccion segun rotacion en Y y en XZ
	var dirX = Math.sin(this.currentRotY);
	var dirZ = Math.cos(this.currentRotY);
	var dirY = Math.sin(this.currentRotXZ);
	
	//Direcciones de movimiento
	var movementDir = vec3.createFrom(dirX, 0, dirZ);
	//vec3.normalize(movementDir);
	var strafeDir = vec3.create();
	vec3.cross(GuiController.UP_VECTOR, movementDir, strafeDir);
	
	
	//Movimiento adelante-atras
	vec3.scale(movementDir, forwardMovement /* * elapsedTime */);

	//Movimiento strafe
	vec3.scale(strafeDir, strafeMovement /* * elapsedTime */);
	
	//Sumar movimiento
	vec3.add(this.position, movementDir);
	vec3.add(this.position, strafeDir);
	this.position[1] += jumpMovement;
	
	//Hacia donde mirar
	var lookAtDir = vec3.createFrom(dirX, dirY, dirZ);
	vec3.normalize(lookAtDir);
	vec3.set(this.position, this.lookAt);
	vec3.add(this.lookAt, lookAtDir);

}

/**
 * Actualizar la matriz View en base a los valores de la cámara
 **/
TgcFpsCamera.prototype.updateViewMatrix = function() {
	mat4.lookAt(this.position, this.lookAt, GuiController.UP_VECTOR, GuiController.Instance.view);
}





















