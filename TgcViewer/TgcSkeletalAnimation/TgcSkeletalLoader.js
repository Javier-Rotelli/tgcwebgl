/**
 * Herramienta para cargar una Malla con animacion del tipo Skeletal Animation, segun formato TGC
 *
 * @author Matias Leone
 */
 
 
/**
 * Ubicacion de atributos del tipo de mesh VERTEX_COLOR
 */
TgcSkeletalLoader.TYPE_VERTEX_COLOR_VERTEX_POS_INDEX = 0;
TgcSkeletalLoader.TYPE_VERTEX_COLOR_VERTEX_COLOR_INDEX = 1;
TgcSkeletalLoader.TYPE_VERTEX_COLOR_STRIDE = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE) * TgcSceneLoader.FLOAT_SIZE_BYTES;
TgcSkeletalLoader.TYPE_VERTEX_COLOR_COLOR_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * TgcSceneLoader.VERTEX_POS_SIZE;
 
/**
 * Ubicacion de atributos del tipo de mesh DIFFUSE_MAP
 */
TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_POS_INDEX = 0;
TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_COLOR_INDEX = 1;
TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_TEXCOORD0_INDEX = 2;
TgcSkeletalLoader.TYPE_DIFFUSE_MAP_STRIDE = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE) * TgcSceneLoader.FLOAT_SIZE_BYTES;
TgcSkeletalLoader.TYPE_DIFFUSE_MAP_COLOR_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * TgcSceneLoader.VERTEX_POS_SIZE;
TgcSkeletalLoader.TYPE_DIFFUSE_MAP_TEXCOORD_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE);

 
 
 
/**
 * Constructor
 */
function TgcSkeletalLoader () {

}


/**
 * Carga un modelo y un conjunto de animaciones a partir de varios archivos
 * @param {String} meshFileUrl Ubicacion del archivo XML del modelo
 * @param {Array<String>} animationsFileUrl Array con ubicaciones de los archivos XML de cada animación
 * @param {String} mediaUrl URL a partir del cual hay que buscar las texturas. Si mediaUrl es undefined se utiliza la misma carpeta en la que se encuentra el archivo XML de la malla.
 * @return {TgcSkeletalMesh} Modelo cargado
 */
TgcSkeletalLoader.prototype.loadMeshAndAnimationsFromUrl = function(meshFileUrl, animationsFileUrl, mediaUrl) {
	var mesh = this.loadMeshFromUrl(meshFileUrl, mediaUrl);
	for(var i = 0; i < animationsFileUrl.length; i++) {
		this.loadAnimationFromUrl(mesh, animationsFileUrl[i]);
	}
	return mesh;
}

/**
 * Carga un modelo a partir de un archivo. 
 * @param {String} fileUrl Ubicacion del archivo XML
 * @param {String} mediaUrl URL a partir del cual hay que buscar las texturas. Si mediaUrl es undefined se utiliza la misma carpeta en la que se encuentra el archivo XML de la malla.
 * @return {TgcSkeletalMesh} Modelo cargado
 */
TgcSkeletalLoader.prototype.loadMeshFromUrl = function(fileUrl, mediaUrl) {
	var xml = TgcUtils.loadXmlFile(fileUrl);
	if(mediaUrl == undefined) {
		mediaUrl = TgcUtils.getDirUrlFromFileUrl(fileUrl);
	}
	return this.loadMeshFromXml(xml, mediaUrl);
}

/**
 * Carga la escena a partir del nodo root del XML
 * @param {XmlNode} xml Root Node del XML
 * @param {String} mediaUrl
 * @return {TgcSkeletalMesh} Escena cargada
 */
TgcSkeletalLoader.prototype.loadMeshFromXml = function(xml, mediaUrl) {
	var parser = new TgcSkeletalParser();
	var meshData = parser.parseMeshFromXml(xml);
	return this.loadMesh(meshData, mediaUrl);
}

/**
 * Carga una animación a un modelo ya cargado, en base a un archivo.
 * La animación se agrega al modelo.
 * @param {TgcSkeletalMesh} mesh Modelo ya cargado
 * @param {String} fileUrl Ubicacion del archivo XML de la animacion
 */
TgcSkeletalLoader.prototype.loadAnimationFromUrl = function(mesh, fileUrl) {
	var xml = TgcUtils.loadXmlFile(fileUrl);
	return this.loadAnimationFromXml(mesh, xml);
}

/**
 * Carga una animación a un modelo ya cargado, a partir del nodo root del XML.
 * La animación se agrega al modelo.
 * @param {TgcSkeletalMesh} mesh Modelo ya cargado
 * @param {XmlNode} xml Root Node del XML
 */
TgcSkeletalLoader.prototype.loadAnimationFromXml = function(mesh, xml) {
	var parser = new TgcSkeletalParser();
	var animationData = parser.parseAnimationFromXml(xml);
	var animation = this.loadAnimation(mesh, animationData);
	mesh.animations[animation.name] = animation;
}

/**
 * Carga la escena a partir de un objeto TgcSceneData ya parseado
 * @param {TgcSkeletalMeshData} meshData
 * @param {String} mediaUrl
 * @return {TgcSkeletalMesh} Escena cargada
 */
TgcSkeletalLoader.prototype.loadMesh = function(meshData,  mediaUrl) {

	//Cargar Texturas
	var materialsArray = new Array();
	for (var i = 0; i < meshData.materialsData.length; i++)
	{
		var materialData = meshData.materialsData[i];
		var texturesUrl = mediaUrl + meshData.texturesDir + "/";

		//Crear StandardMaterial
		if (materialData.type == TgcMaterialData.StandardMaterial)
		{
			materialsArray.push(this.createTextureAndMaterial(materialData, texturesUrl));
		}

		//Crear MultiMaterial
		else if (materialData.type == TgcMaterialData.MultiMaterial)
		{
			var matAux = new Object();
			materialsArray.push(matAux);
			matAux.subMaterials = new Array();
			for (var j = 0; j < materialData.subMaterials.length; j++)
			{
				matAux.subMaterials.push(this.createTextureAndMaterial(materialData.subMaterials[j], texturesUrl));
			}
		}
	}
	
	
	//Crear Mesh
	var tgcMesh = undefined;

	//Crear mesh que no tiene Material, con un color simple
	if (meshData.materialId == -1)
	{
		tgcMesh = this.crearMeshSoloColor(meshData);
	}


	//Crear mesh con DiffuseMap
	else
	{
		tgcMesh = this.crearMeshDiffuseMap(materialsArray, meshData);
	}


	//Crear BoundingBox, aprovechar lo que viene del XML o crear uno por nuestra cuenta
	if (meshData.pMin != undefined && meshData.pMax != undefined)
	{
		tgcMesh.boundingBox = new TgcBoundingBox(meshData.pMin, meshData.pMax);
	}
	else
	{
		tgcMesh.boundingBox = this.createMeshBoundingBox(meshData);	
	}
	tgcMesh.staticMeshBoundingBox = tgcMesh.boundingBox;


	tgcMesh.enabled = true;
	return tgcMesh;
}


/**
 * Crea un mesh con uno o varios DiffuseMap
 * @param {Array<TgcSkeletalLoaderMaterialAux>} materialsArray
 * @param {TgcSkeletalMeshData} meshData
 * @return {TgcSkeletalMesh} mesh cargado
 */
TgcSkeletalLoader.prototype.crearMeshDiffuseMap = function(materialsArray,  meshData) {
	var gl = GuiController.Instance.gl;
	
	//Configurar Textura para un solo SubSet
	var matAux = materialsArray[meshData.materialId];
	var meshTextures;
	var subGroups = 1;
	if (matAux.subMaterials == undefined)
	{
		meshTextures = new Array(matAux.texture);
	}

	//Configurar Textura para varios SubSet
	else
	{
		//Cargar array de Texturas
		meshTextures = new Array();
		subGroups = matAux.subMaterials.length;
		for (var m = 0; m < matAux.subMaterials.length; m++)
		{
			meshTextures.push(matAux.subMaterials[m].texture);
		}
	}
	
		
	//Cargar VertexBuffer, en orden por subGrupo de material
	var vertexBufferLength = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE) * meshData.coordinatesIndices.length;
	var vertexBuffer = new Float32Array(vertexBufferLength);
	var subGroupsVertexCount = new Array();
	var vertexCount = 0;
	var idx = 0;
	for (var g = 0; g < subGroups && vertexCount < meshData.coordinatesIndices.length; g++) {
		
		//Iteramos varias veces sobre el mismo array de vertices para ir guardando en orden por subGrupo
		subGroupsVertexCount.push(0);
		for (var i = 0; i < meshData.coordinatesIndices.length; i++) {
			
			//En esta vuelta solo cargamos este vertice si corresponde al grupo actual, sino se cargara en la prox vuelta
			var triIndex = Math.floor(i / 3);
			if(subGroups == 1 || meshData.materialsIds[triIndex] == g) {
				
				//Incrementamos la cantidad de vertices que hay en este subgrupo
				subGroupsVertexCount[g]++;
				vertexCount++;
				
				//vertices
				var coordIdx = meshData.coordinatesIndices[i] * 3;
				vertexBuffer[idx++] = meshData.verticesCoordinates[coordIdx];
				vertexBuffer[idx++] = meshData.verticesCoordinates[coordIdx + 1];
				vertexBuffer[idx++] = meshData.verticesCoordinates[coordIdx + 2];
	 				
				//color
				var colorIdx = meshData.colorIndices[i];
				vertexBuffer[idx++] = meshData.verticesColors[colorIdx];
				vertexBuffer[idx++] = meshData.verticesColors[colorIdx + 1];
				vertexBuffer[idx++] = meshData.verticesColors[colorIdx + 2];
				
				//texture coordinates diffuseMap
				var texCoordIdx = meshData.texCoordinatesIndices[i] * 2;
				vertexBuffer[idx++] = meshData.textureCoordinates[texCoordIdx];
				vertexBuffer[idx++] = meshData.textureCoordinates[texCoordIdx + 1];
			}
		}
	}
	
	
	//Crear VBO de vertexBuffer
	var glVertexBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, glVertexBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertexBuffer, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	vertexBuffer = undefined;
	
	
	//Cargar IndexBuffer en forma plana
	var indexBuffer = new Uint16Array(meshData.coordinatesIndices.length);
	for (var i = 0; i < meshData.coordinatesIndices.length; i++)
	{
		indexBuffer[i] = i;
	}
	var glIndexBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndexBufferId);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	indexBuffer = undefined;
	

	//Cargar esqueleto
	var bones = this.loadSkeleton(meshData);
    var verticesWeights = this.loadVerticesWeights(meshData, bones);
	
	//Cargar datos de meshData que interesan mantener como originales
	var origData = new TgcSkeletalMesh_OriginalData();
	origData.coordinatesIndices = meshData.coordinatesIndices;
	origData.verticesCoordinates = meshData.verticesCoordinates;
	origData.colorIndices = meshData.colorIndices;
	origData.verticesColors = meshData.verticesColors;
	origData.texCoordinatesIndices = meshData.texCoordinatesIndices;
	origData.textureCoordinates = meshData.textureCoordinates;
	
	//Crear mesh de TGC
	var tgcMesh = new TgcSkeletalMesh(meshData.name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, TgcSkeletalMesh.MeshRenderType.DIFFUSE_MAP, origData, bones, verticesWeights);
	tgcMesh.diffuseMaps = meshTextures;
	tgcMesh.shader = GuiController.Instance.tgcShaders.getTgcSkeletalMeshShader(tgcMesh);
	
	return tgcMesh;
}

/**
 * Crea un mesh sin texturas, solo con VertexColors
 * @param {Array<TgcSkeletalLoaderMaterialAux>} materialsArray
 * @param {TgcSkeletalMeshData} meshData
 * @return {TgcSkeletalMesh} mesh cargado
 */
TgcSkeletalLoader.prototype.crearMeshSoloColor = function(materialsArray,  meshData) {
	var gl = GuiController.Instance.gl;
	
	//Cargar VertexBuffer, en orden por subGrupo de material
	var vertexBufferLength = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE) * meshData.coordinatesIndices.length;
	var vertexBuffer = new Float32Array(vertexBufferLength);
	var subGroupsVertexCount = new Array();
	subGroupsVertexCount.push(0);
	var vertexCount = 0;
	var idx = 0;
	for (var i = 0; i < meshData.coordinatesIndices.length; i++) {
		subGroupsVertexCount[0]++;
		
		//vertices
		var coordIdx = meshData.coordinatesIndices[i] * 3;
		vertexBuffer[idx++] = meshData.verticesCoordinates[coordIdx];
		vertexBuffer[idx++] = meshData.verticesCoordinates[coordIdx + 1];
		vertexBuffer[idx++] = meshData.verticesCoordinates[coordIdx + 2];
		
		//color
		var colorIdx = meshData.colorIndices[i];
		vertexBuffer[idx++] = meshData.verticesColors[colorIdx];
		vertexBuffer[idx++] = meshData.verticesColors[colorIdx + 1];
		vertexBuffer[idx++] = meshData.verticesColors[colorIdx + 2];
	}
	
	
	//Crear VBO de vertexBuffer
	var glVertexBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, glVertexBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertexBuffer, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	vertexBuffer = undefined;
	
	
	//Cargar IndexBuffer en forma plana
	var indexBuffer = new Uint16Array(meshData.coordinatesIndices.length);
	for (var i = 0; i < meshData.coordinatesIndices.length; i++)
	{
		indexBuffer[i] = i;
	}
	var glIndexBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glIndexBufferId);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	indexBuffer = undefined;
	

	//Cargar esqueleto
	var bones = this.loadSkeleton(meshData);
    var verticesWeights = this.loadVerticesWeights(meshData, bones);
	
	//Cargar datos de meshData que interesan mantener como originales
	var origData = new TgcSkeletalMesh_OriginalData();
	origData.coordinatesIndices = meshData.coordinatesIndices;
	origData.verticesCoordinates = meshData.verticesCoordinates;
	origData.colorIndices = meshData.colorIndices;
	origData.verticesColors = meshData.verticesColors;
	origData.textureCoordinates = meshData.textureCoordinates;
	
	//Crear mesh de TGC
	var tgcMesh = new TgcSkeletalMesh(meshData.name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, TgcSkeletalMesh.MeshRenderType.VERTEX_COLOR, origData, bones, verticesWeights);
	tgcMesh.shader = GuiController.Instance.tgcShaders.getTgcSkeletalMeshShader(tgcMesh);
	
	return tgcMesh;
}


/**
 * Cargar estructura de esqueleto
 * @param {TgcSkeletalMeshData} meshData
 * @return {Array<TgcSkeletalBone>}
 */
TgcSkeletalLoader.prototype.loadSkeleton = function(meshData) {
	//Crear huesos
	var bones = new Array();
	for (var i = 0; i < meshData.bones.length; i++)
	{
		var boneData = meshData.bones[i];

		var bone = new TgcSkeletalBone(i, boneData.name,
			vec3.createFrom(boneData.startPosition[0], boneData.startPosition[1], boneData.startPosition[2]),
			quat4.createFrom(boneData.startRotation[0], boneData.startRotation[1], boneData.startRotation[2], boneData.startRotation[3])
			);
		bones.push(bone);
	}

	//Cargar padres en huesos
	for (var i = 0; i < bones.length; i++)
	{
		var boneData = meshData.bones[i];
		if (boneData.parentId == -1)
		{
			bones[i].parentBone = undefined;
		}
		else
		{
			bones[i].parentBone = bones[boneData.parentId];
		}
	}

	return bones;
}

/**
 * Cargar Weights de vertices
 * @param {TgcSkeletalMeshData} meshData
 * @param {Array<TgcSkeletalBone>} bones
 * @return {Array<TgcSkeletalVertexWeight>}
 */
TgcSkeletalLoader.prototype.loadVerticesWeights = function(meshData, bones) {
	//Crear un array de Weights para cada uno de los vertices de la malla
	var weightsLength = meshData.verticesCoordinates.length / 3;
	var weights = new Array();
	var vertexWeightTotals = new Array();
	for (var i = 0; i < weightsLength; i++)
	{
		weights.push(new TgcSkeletalVertexWeight());
		vertexWeightTotals.push(0);
	}

	//Cargar los weights de cada vertice
	var weightsCount = meshData.verticesWeights.length / 3;
	for (var i = 0; i < weightsCount; i++)
	{
		var vertexIdx = meshData.verticesWeights[i * 3];
		var boneIdx = meshData.verticesWeights[i * 3 + 1];
		var weightVal = meshData.verticesWeights[i * 3 + 2];

		var bone = bones[boneIdx];
		var weight = new TgcSkeletalVertexWeight_BoneWeight(bone, weightVal);

		weights[vertexIdx].weights.push(weight);

		//acumular total de weight para ese vertice, para luego poder normalizar
		vertexWeightTotals[vertexIdx] += weightVal;
	}

	//Normalizar weights de cada vertice
	for (var i = 0; i < weights.length; i++)
	{
		var vertexWeight = weights[i];
		var vTotal = vertexWeightTotals[i];

		//Normalizar cada valor segun el total acumulado en el vertice
		for (var j = 0; j < vertexWeight.weights.length; j++)
		{
			var w = vertexWeight.weights[j];
			w.weight = w.weight / vTotal;
		}
	}

	return weights;
}




/**
 * Crea Material y Textura
 * @param {TgcMaterialData} materialData
 * @param {String} texturesUrl
 * @return {TgcSkeletalLoaderMaterialAux}
 */
TgcSkeletalLoader.prototype.createTextureAndMaterial = function(materialData, texturesUrl)
{
	var matAux = new TgcSkeletalLoaderMaterialAux();

	/*
	//Crear material
	Material material = new Material();
	matAux.materialId = material;
	material.AmbientColor = new ColorValue(
		materialData.ambientColor[0],
		materialData.ambientColor[1],
		materialData.ambientColor[2],
		materialData.ambientColor[3]);
	material.DiffuseColor = new ColorValue(
		materialData.diffuseColor[0],
		materialData.diffuseColor[1],
		materialData.diffuseColor[2],
		materialData.diffuseColor[3]);
	material.SpecularColor = new ColorValue(
		materialData.specularColor[0],
		materialData.specularColor[1],
		materialData.specularColor[2],
		materialData.specularColor[3]);
	*/
	//TODO ver que hacer con la opacity

	//crear textura
	if (materialData.fileName != null)
	{
		var texture = TgcTexture.createTexture(texturesUrl + "/" + materialData.fileName, materialData.fileName);
		matAux.texture = texture;
	}
	else
	{
		matAux.texture = null;
	}

	return matAux;
}


/**
 * Cargar estructura de animacion
 * @param {TgcSkeletalMesh} mesh
 * @param {TgcSkeletalAnimationData} animationData
 * @return {TgcSkeletalAnimation}
 */
TgcSkeletalLoader.prototype.loadAnimation = function(mesh, animationData) {
	//Crear array para todos los huesos, tengan o no keyFrames
	var boneFrames = new Array();

	//Cargar los frames para los huesos que si tienen
	for (var i = 0; i < animationData.bonesFrames.length; i++)
	{
		var boneData = animationData.bonesFrames[i];
		
		//Crear frames
		for (var j = 0; j < boneData.keyFrames.length; j++)
		{
			var frameData = boneData.keyFrames[j];

			var frame = new TgcSkeletalAnimationFrame(
				frameData.frame,
				vec3.createFrom(frameData.position[0], frameData.position[1], frameData.position[2]),
				quat4.createFrom(frameData.rotation[0], frameData.rotation[1], frameData.rotation[2], frameData.rotation[3])
				);

			//Agregar a lista de frames del hueso
			if (boneFrames[boneData.id] == undefined)
			{
				boneFrames[boneData.id] = new Array();
			}
			boneFrames[boneData.id].push(frame);
		}
	}

	//BoundingBox de la animación, aprovechar lo que viene en el XML o utilizar el de la malla estática
	var boundingBox = undefined;
	if (animationData.pMin != undefined && animationData.pMax != undefined)
	{
		boundingBox = new TgcBoundingBox(
			vec3.createFrom(animationData.pMin[0], animationData.pMin[1], animationData.pMin[2]),
			vec3.createFrom(animationData.pMax[0], animationData.pMax[1], animationData.pMax[2]));
	}
	else
	{
		boundingBox = mesh.boundingBox;
	}
		
	//Crear animacion
	var animation = new TgcSkeletalAnimation(animationData.name, animationData.frameRate, animationData.framesCount, boneFrames, boundingBox);
	return animation;
}


/**
 * Crear BoundingBox de mesh en base a vertices de meshData
 * @param {TgcSkeletalMeshData} meshData
 * @return {TgcBoundingBox}
 */
TgcSkeletalLoader.prototype.createMeshBoundingBox = function(meshData)
{
	var points = new Array();
	for (var i = 0; i < meshData.coordinatesIndices.length; i++) {
		var n = meshData.coordinatesIndices[i] * 3;
		var v = vec3.createFrom(
			meshData.verticesCoordinates[n],
			meshData.verticesCoordinates[n + 1],
			meshData.verticesCoordinates[n + 2]
			);
		points.push(v);
	}
	return TgcBoundingBox.computeFromPoints(points);
}


/**
 * Estructura auxiliar para cargar SubMaterials y Texturas
 * @author Matias Leone
 * Constructor
 */
 function TgcSkeletalLoaderMaterialAux() {
	this.texture = undefined;
	this.subMaterials = undefined;
 }



