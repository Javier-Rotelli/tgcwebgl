/**
 * Hueso del esqueleto
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalBone.prototype = {
	/**
     * Posicion inicial del hueso
     * @type vec3
     */
    startPosition: undefined,
	
	/**
     * Rotacion inicial del hueso
     * @type quat4
     */
    startRotation: undefined,
	
	/**
     * Matriz local de transformacion
     * @type mat4
     */
    matLocal: undefined,
	
	/**
     * Matriz final de transformacion 
     * @type mat4
     */
    matFinal: undefined,
	
	/**
     * Matriz de transformacion inversa de la posicion inicial del hueso, para la animacion actual
     * @type mat4
     */
    matInversePose: undefined,
	
	/**
     * Posición del hueso dentro del array de huesos de todo el esqueleto
     * @type int
     */
    index: undefined,
	
	/**
     * Nombre del hueso
     * @type String
     */
    name: undefined,
	
	/**
     * Hueso padre. Es undefined si no tiene
     * @type TgcSkeletalBone
     */
    parentBone: undefined,
}
 
 
/**
 * Constructor
 * @param {int} index
 * @param {String} name
 * @param {vec3} startPosition
 * @param {quat4} startRotation
 */
function TgcSkeletalBone (index, name, startPosition, startRotation) {
	this.index = index;
	this.name = name;
	this.startPosition = startPosition;
	this.startRotation = startRotation;

	this.matLocal = mat4.create();
	mat4.fromRotationTranslation(this.startRotation, this.startPosition, this.matLocal);
}



