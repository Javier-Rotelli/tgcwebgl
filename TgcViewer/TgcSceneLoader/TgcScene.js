/**
 * Escena compuesta por un conjunto de Meshes estáticos
 *
 * @author Matias Leone
 */
 
 /**
 * Atributos
 */
TgcScene.prototype = {
	/**
     * Nombre de la escena
     * @type String
     */
    sceneName: undefined,
	
	/**
     * URL de la escena
     * @type String
     */
    fileUrl: undefined,
	
	/**
     * Meshes de la escena
     * @type Array<TgcMesh>
     */
    meshes: new Array(),
	
	/**
     * BoundingBox de toda la escena
     * @type TgcBoundingBox
     */
    boundingBox: undefined,
}
 
/**
 * Constructor
 */
function TgcScene () {

}


