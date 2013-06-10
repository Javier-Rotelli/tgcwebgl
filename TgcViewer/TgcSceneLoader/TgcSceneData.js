/**
 * Datos de la escena
 *
 * @author Matias Leone
 */

/**
 * Atributos
 */
TgcSceneData.prototype = {
	/**
     * @type String
     */
    name: undefined,
	
	/**
     * @type String
     */
    texturesDir: undefined,
	
	/**
     * @type String
     */
    lightmapsDir: undefined,
	
	/**
     * @type bool
     */
    lightmapsEnabled: undefined,
	
	/**
     * @type Array<TgcMeshData>
     */
    meshesData: undefined,
	
	/**
     * @type Array<TgcMaterialData>
     */
    materialsData: undefined,
	
	/**
     * @type Array<float>
     */
    pMin: undefined,
	
	/**
     * @type Array<float>
     */
    pMax: undefined,
}
 
 
/**
 * Constructor
 */
function TgcSceneData () {

	
    //Datos de PortalRendering
    //public TgcPortalRenderingData portalData;

}