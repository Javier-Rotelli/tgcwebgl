/**
 * Animacion para una malla con animacion esqueletica
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalAnimation.prototype = {
	/**
     * Nombre de la animacion
     * @type String
     */
    name: undefined,
	
	/**
     * Velocidad de refresco de la animacion
     * @type int
     */
    frameRate: undefined,
	
	/**
     * Total de cuadros que tiene la animacion
     * @type int
     */
    framesCount: undefined,
	
	/**
     * Frames de animacion por cada uno de los huesos.
	 * El array se encuentra en el mismo orden que la jerarquia de huesos del esquelto.
	 * Están todos los huesos, aunque no tengan ningún KeyFrame.
	 * Si no tienen ningun frame tienen la lista en undefined
     * @type Array<TgcSkeletalAnimationFrame>
     */
    boneFrames: undefined,
	
	/**
     * BoundingBox para esta animacion particular
     * @type TgcBoundingBox
     */
    boundingBox: undefined,
}


 
 
/**
 * Constructor
 * @param {String} name
 * @param {int} frameRate
 * @param {framesCount} framesCount
 * @param {Array<TgcSkeletalAnimationFrame>} boneFrames
 * @param {TgcBoundingBox} boundingBox
 */
function TgcSkeletalAnimation (name, frameRate, framesCount, boneFrames, boundingBox) {
	this.name = name;
	this.frameRate = frameRate;
	this.framesCount = framesCount;
	this.boneFrames = boneFrames;
	this.boundingBox = boundingBox;
}


/**
 * Indica si el hueso tiene algun KeyFrame
 *
 * @param {int} boneIdx
 * @return {bool}
 **/
TgcSkeletalAnimation.prototype.hasFrames = function(boneIdx) {
	return this.boneFrames[boneIdx] != undefined && this.boneFrames[boneIdx].length > 0;
}



