/**
 * Datos de Material
 *
 * @author Matias Leone
 */
 
 
/**
 * Material Types
 */
TgcMaterialData.StandardMaterial = "Standardmaterial";
TgcMaterialData.MultiMaterial = "Multimaterial";
 
/**
 * Atributos
 */
TgcMaterialData.prototype = {
	/**
     * @type String
     */
    name: undefined,
	
	/**
     * @type String
     */
    type: undefined,
	
	/**
	 * Submaterials
     * @type Array<TgcMaterial>
     */
    subMaterials: undefined,
	
	/**
	 * Material
     * @type Array<float>[4]
     */
    ambientColor: undefined,
	
	/**
	 * Material
     * @type Array<float>[4]
     */
    diffuseColor: undefined,
	
	/**
	 * Material
     * @type Array<float>[4]
     */
    specularColor: undefined,
	
	/**
	 * Material
     * @type float
     */
    opacity: undefined,
	
	/**
     * @type bool
     */
    alphaBlendEnable: undefined,
	
	/**
	 * Bitmap
     * @type String
     */
    fileName: undefined,
	
	/**
     * @type Array<float>[2]
     */
    uvTiling: undefined,
	
	/**
     * @type Array<float>[2]
     */
    uvOffset: undefined,
}

/**
 * Constructor
 */
function TgcMaterialData () {

}


