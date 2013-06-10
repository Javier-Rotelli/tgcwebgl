/**
 * Shaders comunes a varios objetos del framework
 *
 * @author Matias Leone
 */
 
 
/**
 * Path de shaders
 */
TgcShaders.BASE_PATH = "Media/shaders/";
 
/**
 * Shaders para TgcMesh
 */
TgcShaders.TGC_MESH = {
	SHADER_URL: TgcShaders.BASE_PATH + "tgcMeshShader.xml",
	VERTEX_COLOR_TECHNIQUE: "VertexColorTechnique",
	DIFFUSE_MAP_TECHNIQUE: "DiffuseMapTechnique",
	DIFFUSE_MAP_AND_LIGHTMAP_TECHNIQUE: "DiffuseMapAndLightmapTechnique",
}

/**
 * Shaders para TgcSkeletalMesh
 */
TgcShaders.TGC_SKELETAL_MESH = {
	SHADER_URL: TgcShaders.BASE_PATH + "tgcSkeletalMeshShader.xml",
	VERTEX_COLOR_TECHNIQUE: "VertexColorTechnique",
	DIFFUSE_MAP_TECHNIQUE: "DiffuseMapTechnique",
}

/**
 * Nombres comunes de variables de shader para atributos
 */
TgcShaders.ATTR_NAME = {
	POSITION: "aPosition",
	NORMAL: "aNormal",
	COLOR: "aColor",
	TEXCOORD: "aTexcoord",
	TEXCOORD_LIGHTMAP: "aTexcoordLightmap",
}
 
 
/**
 * Atributos
 */
TgcShaders.prototype = {
	/**
     * Shader para TgcMesh con VertexColor
     * @type TgcShaderEffect
     */
    tgcMeshVertexColor: undefined,
	
	/**
     * Shader para TgcMesh con DiffuseMap
     * @type TgcShaderEffect
     */
    tgcMeshDiffuseMap: undefined,
	
	/**
     * Shader para TgcMesh con DiffuseMap y Lightmap
     * @type TgcShaderEffect
     */
    tgcMeshDiffuseMapAndLightmap: undefined,
	
	/**
     * Shader para TgcSkeletalMesh con VertexColor
     * @type TgcShaderEffect
     */
    tgcSkeletalMeshVertexColor: undefined,
	
	/**
     * Shader para TgcSkeletalMesh con DiffuseMap
     * @type TgcShaderEffect
     */
    tgcSkeletalMeshDiffuseMap: undefined,

}
 
 
/**
 * Constructor.
 * Cargar todos los shaders comunes
 */
function TgcShaders () {
	var attributes;
	
	//Cargar XML de shader de TgcMesh
	var rootTgcMesh = TgcUtils.loadXmlFile(TgcShaders.TGC_MESH.SHADER_URL);
	
	//Crear shader TgcMesh VertexColor
	attributes = new Array();
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.POSITION, TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_POS_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.NORMAL, TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_NORMAL_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.COLOR, TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_COLOR_INDEX));
	this.tgcMeshVertexColor = TgcShaderEffect.fromTgcEffectXml(rootTgcMesh, TgcShaders.TGC_MESH.VERTEX_COLOR_TECHNIQUE, attributes);	
	
	//Crear shader TgcMesh DiffuseMap
	attributes = new Array();
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.POSITION, TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_POS_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.NORMAL, TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_NORMAL_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.COLOR, TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_COLOR_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.TEXCOORD, TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_TEXCOORD0_INDEX));
	this.tgcMeshDiffuseMap = TgcShaderEffect.fromTgcEffectXml(rootTgcMesh, TgcShaders.TGC_MESH.DIFFUSE_MAP_TECHNIQUE, attributes);	
	
	//Crear shader TgcMesh DiffuseMap and Lightmap
	attributes = new Array();
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.POSITION, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_POS_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.NORMAL, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_NORMAL_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.COLOR, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_COLOR_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.TEXCOORD, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_TEXCOORD0_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.TEXCOORD_LIGHTMAP, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_TEXCOORD1_INDEX));
	this.tgcMeshDiffuseMapAndLightmap = TgcShaderEffect.fromTgcEffectXml(rootTgcMesh, TgcShaders.TGC_MESH.DIFFUSE_MAP_AND_LIGHTMAP_TECHNIQUE, attributes);
	
	
	
	//Cargar XML de shader de TgcSkeletalMesh
	var rootTgcSkeletalMesh = TgcUtils.loadXmlFile(TgcShaders.TGC_SKELETAL_MESH.SHADER_URL);
	
	//Crear shader TgcSkeletalMesh VertexColor
	attributes = new Array();
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.POSITION, TgcSkeletalLoader.TYPE_VERTEX_COLOR_VERTEX_POS_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.COLOR, TgcSkeletalLoader.TYPE_VERTEX_COLOR_VERTEX_COLOR_INDEX));
	this.tgcSkeletalMeshVertexColor = TgcShaderEffect.fromTgcEffectXml(rootTgcSkeletalMesh, TgcShaders.TGC_SKELETAL_MESH.VERTEX_COLOR_TECHNIQUE, attributes);	
	
	//Crear shader TgcSkeletalMesh DiffuseMap
	attributes = new Array();
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.POSITION, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_POS_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.COLOR, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_COLOR_INDEX));
	attributes.push(new TgcShaderAttribute(TgcShaders.ATTR_NAME.TEXCOORD, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_TEXCOORD0_INDEX));
	this.tgcSkeletalMeshDiffuseMap = TgcShaderEffect.fromTgcEffectXml(rootTgcSkeletalMesh, TgcShaders.TGC_SKELETAL_MESH.DIFFUSE_MAP_TECHNIQUE, attributes);	

}

/**
 * Devuelve el shader default que le corresponde a un TgcMesh
 * segun su MeshRenderType
 *
 * @param {TgcMesh} mesh
 * @return {TgcShaderEffect} shader default para el mesh
 **/
TgcShaders.prototype.getTgcMeshShader = function(mesh) {
	if(mesh.renderType == TgcMesh.MeshRenderType.VERTEX_COLOR) return this.tgcMeshVertexColor;
	if(mesh.renderType == TgcMesh.MeshRenderType.DIFFUSE_MAP) return this.tgcMeshDiffuseMap;
	return this.tgcMeshDiffuseMapAndLightmap;
}

/**
 * Devuelve el shader default que le corresponde a un TgcSkeletalMesh
 * segun su MeshRenderType
 *
 * @param {TgcSkeletalMesh} mesh
 * @return {TgcShaderEffect} shader default para el mesh
 **/
TgcShaders.prototype.getTgcSkeletalMeshShader = function(mesh) {
	if(mesh.renderType == TgcSkeletalMesh.MeshRenderType.VERTEX_COLOR) return this.tgcSkeletalMeshVertexColor;
	return this.tgcSkeletalMeshDiffuseMap;
}












