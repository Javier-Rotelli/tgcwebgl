/**
 * Key frame de animacion para un hueso particular
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalAnimationFrame.prototype = {
	/**
     * Numero de frame en el cual transcurre esta rotacion y traslacion.
     * @type int
     */
    frame: undefined,
	
	/**
     * Posicion del hueso para este frame
     * @type vec3
     */
    position: undefined,
	
	/**
     * Rotacion del hueso para este frame en Quaternion
     * @type quat4
     */
    rotation: undefined,
}	
 
 
/**
 * Constructor
 * @param {int} YYYYYY
 * @param {vec3} YYYYYY
 * @param {quat4} YYYYYY
 */
function TgcSkeletalAnimationFrame (frame, position, rotation) {
	this.frame = frame;
    this.position = position;
    this.rotation = rotation;
}





