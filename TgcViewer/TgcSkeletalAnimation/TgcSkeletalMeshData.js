/**
 * Información de la Malla de un modelo animado por Animación Esquelética
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalMeshData.prototype = {
	/**
     * @type String
     */
    name: undefined,
	
	/**
     * @type String
     */
    texturesDir: undefined,
	
	/**
	 * Valores por triangulo
     * @type Array<int>
     */
    coordinatesIndices: undefined,
	
	/**
	 * Valores por triangulo
     * @type Array<int>
     */
    texCoordinatesIndices: undefined,
	
	/**
	 * Valores por triangulo
     * @type Array<int>
     */
    colorIndices: undefined,
	
	/**
     * @type int
     */
    materialId: undefined,
	
	/**
	 * SubMaterials para cada triangulo
     * @type Array<int>
     */
    materialsIds: undefined,
	
	/**
	 * Valores por vertice
     * @type Array<float>
     */
    verticesCoordinates: undefined,
	
	/**
	 * Valores por vertice
     * @type Array<float>
     */
    textureCoordinates: undefined,
	
	/**
	 * Valores por vertice
     * @type Array<float>
     */
    verticesColors: undefined,

	/**
	 * Informacion de Texturas y Materials
     * @type Array<TgcMaterialData>
     */
    materialsData: undefined,
	
	/**
	 * Huesos del esqueleto
     * @type Array<TgcSkeletalBoneData>
     */
    bones: undefined,
	
	/**
	 * Tomar de a 3: VertesIdx, BoneIdx, Weight
     * @type Array<float>
     */
    verticesWeights: undefined,

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

}
	
 
 
/**
 * Constructor
 */
function TgcSkeletalMeshData () {

}


