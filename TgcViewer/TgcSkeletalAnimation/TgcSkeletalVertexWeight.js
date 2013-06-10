/**
 * Influencias de huesos sobre un vertice. Un vertice puede estar influenciado por mas de un hueso.
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalVertexWeight.prototype = {
	/**
     * Influencias del vertice
     * @type Array<TgcSkeletalVertexWeight_BoneWeight>
     */
    weights: undefined,
}
	
 
 
/**
 * Constructor
 */
function TgcSkeletalVertexWeight () {
	this.weights = new Array();
}



/**
 * Constructor
 * @param {TgcSkeletalBone} bone
 * @param {float} weight
 */
function TgcSkeletalVertexWeight_BoneWeight(bone, weight) {
	this.bone = bone;
	this.weight = weight;
}

/**
 * Atributos
 */
TgcSkeletalVertexWeight_BoneWeight.prototype = {
	/**
     * Hueso que influye
     * @type TgcSkeletalBone
     */
    bone: undefined,
	
	/**
     * Influencia del hueso sobre el vertice. Valor normalizado entre 0 y 1
     * @type float
     */
    weight: undefined,
}





