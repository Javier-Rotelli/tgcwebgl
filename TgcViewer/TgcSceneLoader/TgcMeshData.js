/**
 * Datos de un mesh
 *
 * @author Matias Leone
 */
 
 
/**
 * Tipos de Mesh Instancias
 * @type String
 */
TgcMeshData.ORIGINAL = "Original";
TgcMeshData.INSTANCE = "Instance";


/**
 * Atributos
 */
TgcMeshData.prototype = {
	/**
     * @type String
     */
    name: undefined,
	
	/**
     * @type String
     */
    layerName: undefined,
	
	/**
     * @type Array<string, string>
     */
    userProperties: undefined,
	
	/**
     * @type int
     */
    materialId: undefined,
	
	/**
     * @type String
     */
    lightmap: undefined,
	
	/**
     * @type bool
     */
    lightmapEnabled: undefined,
	
	/**
	 * Color general, por si no tiene Material
     * @type Array<float>
     */
    color: undefined,
	
	/**
     * @type Array<int>
     */
    coordinatesIndices: undefined,
	
	/**
     * @type Array<int>
     */
    texCoordinatesIndices: undefined,
	
	/**
     * @type Array<int>
     */
    colorIndices: undefined,
	
	/**
     * @type Array<int>
     */
    texCoordinatesIndicesLightMap: undefined,
	
	/**
	 * SubMaterials para cada triangulo
     * @type Array<int>
     */
    materialsIds: undefined,
	
	/**
     * @type Array<float>
     */
    verticesCoordinates: undefined,
	
	/**
     * @type Array<float>
     */
    textureCoordinates: undefined,
	
	/**
     * @type Array<float>
     */
    verticesNormals: undefined,
	
	/**
     * @type Array<float>
     */
    verticesColors: undefined,
	
	/**
     * @type Array<float>
     */
    textureCoordinatesLightMap: undefined,
	
	/**
	 * BoundingBox
     * @type Array<float>[3]
     */
    pMin: undefined,
	
	/**
	 * BoundingBox
     * @type Array<float>[3]
     */
    pMax: undefined,
	
	/**
	 * Tipo de instancia
     * @type String
     */
    instanceType: undefined,
	
	/**
	 * Indice de la malla original
     * @type int
     */
    originalMesh: undefined,
	
	/**
	 * Datos de transformacion para instancia
     * @type Array<float>[3]
     */
    position: undefined,
	
	/**
	 * Datos de transformacion para instancia
     * @type Array<float>[3]
     */
    rotation: undefined,
	
	/**
	 * Datos de transformacion para instancia
     * @type Array<float>[3]
     */
    scale: undefined,
	
	/**
	 * AlphaBlending activado
     * @type bool
     */
    alphaBlending: undefined,
}



/**
 * Constructor
 */
function TgcMeshData () {

}







