/**
 * Herramienta para cargar un archivo de escena XML con formato de TGC (tgcScene)
 *
 * @author Matias Leone
 */
 

/**
 * Tamaño de Float de OpenGL
 */
TgcSceneLoader.FLOAT_SIZE_BYTES = 4;

/**
 * Tamaño de Unsigned Short de OpenGL
 */
TgcSceneLoader.UNSIGNED_SHORT_SIZE_BYTES = 2;

/**
 * Cantidad de floats de cada atributo de vertice
 */
TgcSceneLoader.VERTEX_POS_SIZE = 3;
TgcSceneLoader.VERTEX_NORMAL_SIZE = 3;
TgcSceneLoader.VERTEX_COLOR_SIZE = 3;
TgcSceneLoader.VERTEX_TEXCOORD_SIZE = 2;

/**
 * Ubicacion de atributos del tipo de mesh VERTEX_COLOR
 */
TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_POS_INDEX = 0;
TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_NORMAL_INDEX = 1;
TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_COLOR_INDEX = 2;
TgcSceneLoader.TYPE_VERTEX_COLOR_STRIDE = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE) * TgcSceneLoader.FLOAT_SIZE_BYTES;
TgcSceneLoader.TYPE_VERTEX_COLOR_NORMAL_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * TgcSceneLoader.VERTEX_POS_SIZE;
TgcSceneLoader.TYPE_VERTEX_COLOR_COLOR_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE);

/**
 * Ubicacion de atributos del tipo de mesh DIFFUSE_MAP
 */
TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_POS_INDEX = 0;
TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_NORMAL_INDEX = 1;
TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_COLOR_INDEX = 2;
TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_TEXCOORD0_INDEX = 3;
TgcSceneLoader.TYPE_DIFFUSE_MAP_STRIDE = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE) * TgcSceneLoader.FLOAT_SIZE_BYTES;
TgcSceneLoader.TYPE_DIFFUSE_MAP_NORMAL_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * TgcSceneLoader.VERTEX_POS_SIZE;
TgcSceneLoader.TYPE_DIFFUSE_MAP_COLOR_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE);
TgcSceneLoader.TYPE_DIFFUSE_MAP_TEXCOORD_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE);


/**
 * Ubicacion de atributos del tipo de mesh DIFFUSE_MAP_AND_LIGHTMAP
 */
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_POS_INDEX = 0;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_NORMAL_INDEX = 1;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_COLOR_INDEX = 2;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_TEXCOORD0_INDEX = 3;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_TEXCOORD1_INDEX = 4;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_STRIDE = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE) * TgcSceneLoader.FLOAT_SIZE_BYTES;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_NORMAL_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * TgcSceneLoader.VERTEX_POS_SIZE;
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_COLOR_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE);
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_TEXCOORD0_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE);
TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_TEXCOORD1_OFFSET = TgcSceneLoader.FLOAT_SIZE_BYTES * (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE);




/**
 * Constructor
 */
function TgcSceneLoader () {
	//this.texturesDict = new Array();
}

/**
 * Carga una escena a partir de un archivo. 
 * @param {String} fileUrl Ubicacion del archivo XML
 * @param {String} mediaUrl URL a partir del cual hay que buscar los recursos de escena (Texturas, LightMaps, etc.).
 * 		   si mediaUrl es undefined se utiliza la misma carpeta en la que se encuentra el archivo XML de la malla.
 * @return {TgcScene} Escena cargada
 */
TgcSceneLoader.prototype.loadSceneFromUrl = function(fileUrl, mediaUrl) {
	var xml = TgcUtils.loadXmlFile(fileUrl);
	if(mediaUrl == undefined) {
		mediaUrl = TgcUtils.getDirUrlFromFileUrl(fileUrl);
	}
	return this.loadSceneFromXml(xml, mediaUrl);
}

/**
 * Carga la escena a partir del nodo root del XML
 * @param {XmlNode} xml Root Node del XML
 * @param {String} mediaUrl
 * @return {TgcScene} Escena cargada
 */
TgcSceneLoader.prototype.loadSceneFromXml = function(xml, mediaUrl) {
	var parser = new TgcSceneParser();
	var sceneData = parser.parseSceneFromXml(xml);
	return this.loadScene(sceneData, mediaUrl);
}

/**
 * Carga la escena a partir de un objeto TgcSceneData ya parseado
 * @param {TgcSceneData} sceneData
 * @param {String} mediaUrl
 * @return {TgcScene} Escena cargada
 */
TgcSceneLoader.prototype.loadScene = function(sceneData,  mediaUrl) {
	var tgcScene = new TgcScene();
	tgcScene.sceneName = sceneData.name;
	tgcScene.fileUrl = undefined;
		
	//Cargar Texturas
	var materialsArray = new Array();
	for (var i = 0; i < sceneData.materialsData.length; i++)
	{
		var materialData = sceneData.materialsData[i];
		var texturesUrl = mediaUrl + sceneData.texturesDir + "/";

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
	
	//Cargar Meshes
	for (var i = 0; i < sceneData.meshesData.length; i++)
	{
		var meshData = sceneData.meshesData[i];
		var tgcMesh = undefined;

		//Crear malla original
		if (meshData.instanceType == TgcMeshData.ORIGINAL)
		{
			//Crear mesh que no tiene Material, con un color simple
			if (meshData.materialId == -1)
			{
				tgcMesh = this.crearMeshSoloColor(meshData);
			}

			//Para los que si tienen Material
			else
			{
				//Crear MeshFormat que soporte LightMaps
				if (meshData.lightmapEnabled)
				{
					tgcMesh = this.crearMeshDiffuseMapLightmap(sceneData, mediaUrl, materialsArray, meshData);
				}

				//Formato de Mesh con Textura pero sin Lightmap
				else
				{
					tgcMesh = this.crearMeshDiffuseMap(materialsArray, meshData);
				}
			}
		}

		//Crear malla instancia
		else if (meshData.instanceType == TgcMeshData.INSTANCE)
		{
			//tgcMesh = crearMeshInstance(meshData, tgcScene.getMeshes());
			throw "No implementado";
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

		//Cargar layer
		tgcMesh.layer = meshData.layerName;
		
		//Cargar AlphaBlending
		tgcMesh.alphaBlendEnable = meshData.alphaBlending;

		//agregar mesh a escena
		tgcMesh.enabled = true;
		tgcScene.meshes.push(tgcMesh);

		//Cargar userProperties, si hay
		tgcMesh.userProperties = meshData.userProperties;
	}


	//BoundingBox del escenario, utilizar el que viene del XML o crearlo nosotros
	if (sceneData.pMin != undefined && sceneData.pMax != undefined)
	{
		tgcScene.boundingBox = new TgcBoundingBox(sceneData.pMin, sceneData.pMax);
	}
	else
	{
		var boundingBoxes = new Array();
		for (var i = 0; i < tgcScene.meshes.length; i++) {
			boundingBoxes.push(tgcScene.meshes[i].boundingBox);
		}
		tgcScene.boundingBox = TgcBoundingBox.computeFromBoundingBoxes(boundingBoxes);
	}
	
	/*
	//Cargar parte de PortalRendering, solo hay información
	if (sceneData.portalData != null)
	{
		TgcPortalRenderingLoader portalLoader = new TgcPortalRenderingLoader();
		tgcScene.PortalRendering = portalLoader.loadFromData(tgcScene, sceneData.portalData);
	}
	*/

	return tgcScene;
}


/**
 * Crea un mesh con uno o varios DiffuseMap
 * @param materialsArray
 * @param meshData
 * @return
 */
TgcSceneLoader.prototype.crearMeshDiffuseMap = function(materialsArray, meshData) {
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
	var vertexBufferLength = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE) * meshData.coordinatesIndices.length;
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
	 
				//normals
				//puede haber una normal compartida para cada vertice del mesh
				if (meshData.verticesNormals.length == meshData.verticesCoordinates.length)
				{
					vertexBuffer[idx++] = meshData.verticesNormals[coordIdx];
					vertexBuffer[idx++] = meshData.verticesNormals[coordIdx + 1];
					vertexBuffer[idx++] = meshData.verticesNormals[coordIdx + 2];
				}
				//o una normal propia por cada vertice de cada triangulo (version mejorada del exporter)
				else
				{
					var normalIdx = i * 3;
					vertexBuffer[idx++] = meshData.verticesNormals[normalIdx];
					vertexBuffer[idx++] = meshData.verticesNormals[normalIdx + 1];
					vertexBuffer[idx++] = meshData.verticesNormals[normalIdx + 2];
				}
				
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
	
	//Crear mesh de TGC
	var tgcMesh = new TgcMesh(meshData.name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, TgcMesh.MeshRenderType.DIFFUSE_MAP);
	tgcMesh.diffuseMaps = meshTextures;
	tgcMesh.shader = GuiController.Instance.tgcShaders.getTgcMeshShader(tgcMesh);
	
	return tgcMesh;
}

/**
 * Crea un mesh con uno o varios DiffuseMap y un Lightmap
 * @param {TgcSceneData} sceneData
 * @param {String} mediaUrl
 * @param {Array<TgcSceneLoaderMaterialAux>} materialsArray
 * @param {TgcMeshData} meshData
 * @return {TgcMesh}
 */
TgcSceneLoader.prototype.crearMeshDiffuseMapLightmap = function(sceneData, mediaUrl, materialsArray, meshData) {
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
	var vertexBufferLength = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE + TgcSceneLoader.VERTEX_TEXCOORD_SIZE) * meshData.coordinatesIndices.length;
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
	 
				//normals
				//puede haber una normal compartida para cada vertice del mesh
				if (meshData.verticesNormals.length == meshData.verticesCoordinates.length)
				{
					vertexBuffer[idx++] = meshData.verticesNormals[coordIdx];
					vertexBuffer[idx++] = meshData.verticesNormals[coordIdx + 1];
					vertexBuffer[idx++] = meshData.verticesNormals[coordIdx + 2];
				}
				//o una normal propia por cada vertice de cada triangulo (version mejorada del exporter)
				else
				{
					var normalIdx = i * 3;
					vertexBuffer[idx++] = meshData.verticesNormals[normalIdx];
					vertexBuffer[idx++] = meshData.verticesNormals[normalIdx + 1];
					vertexBuffer[idx++] = meshData.verticesNormals[normalIdx + 2];
				}
				
				//color
				var colorIdx = meshData.colorIndices[i];
				vertexBuffer[idx++] = meshData.verticesColors[colorIdx];
				vertexBuffer[idx++] = meshData.verticesColors[colorIdx + 1];
				vertexBuffer[idx++] = meshData.verticesColors[colorIdx + 2];
				
				//texture coordinates diffuseMap
				var texCoordIdx = meshData.texCoordinatesIndices[i] * 2;
				vertexBuffer[idx++] = meshData.textureCoordinates[texCoordIdx];
				vertexBuffer[idx++] = meshData.textureCoordinates[texCoordIdx + 1];
				
				//texture coordinates LightMap
				var texCoordIdxLM = meshData.texCoordinatesIndicesLightMap[i] * 2;
				vertexBuffer[idx++] = meshData.textureCoordinatesLightMap[texCoordIdxLM];
				vertexBuffer[idx++] = meshData.textureCoordinatesLightMap[texCoordIdxLM + 1];
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
	
	//Cargar lightMap
    var lightMap = TgcTexture.createTexture(mediaUrl + sceneData.lightmapsDir + "/" + meshData.lightmap, meshData.lightmap);
	
	//Crear mesh de TGC
	var tgcMesh = new TgcMesh(meshData.name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, TgcMesh.MeshRenderType.DIFFUSE_MAP_AND_LIGHTMAP);
	tgcMesh.diffuseMaps = meshTextures;
	tgcMesh.shader = GuiController.Instance.tgcShaders.getTgcMeshShader(tgcMesh);
	tgcMesh.lightmap = lightMap;
	
	return tgcMesh;
}

/**
 * Crea un mesh sin texturas, solo con VertexColors
 * @param {TgcMeshData} meshData
 * @return {TgcMesh}
 */
TgcSceneLoader.prototype.crearMeshSoloColor = function(meshData) {
	var gl = GuiController.Instance.gl;
	
	//Cargar VertexBuffer
	var vertexBufferLength = (TgcSceneLoader.VERTEX_POS_SIZE + TgcSceneLoader.VERTEX_NORMAL_SIZE + TgcSceneLoader.VERTEX_COLOR_SIZE) * meshData.coordinatesIndices.length;
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

		//normals
		//puede haber una normal compartida para cada vertice del mesh
		if (meshData.verticesNormals.length == meshData.verticesCoordinates.length)
		{
			vertexBuffer[idx++] = meshData.verticesNormals[coordIdx];
			vertexBuffer[idx++] = meshData.verticesNormals[coordIdx + 1];
			vertexBuffer[idx++] = meshData.verticesNormals[coordIdx + 2];
		}
		//o una normal propia por cada vertice de cada triangulo (version mejorada del exporter)
		else
		{
			var normalIdx = i * 3;
			vertexBuffer[idx++] = meshData.verticesNormals[normalIdx];
			vertexBuffer[idx++] = meshData.verticesNormals[normalIdx + 1];
			vertexBuffer[idx++] = meshData.verticesNormals[normalIdx + 2];
		}
		
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
	

	//Crear mesh de TGC
	var tgcMesh = new TgcMesh(meshData.name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, TgcMesh.MeshRenderType.VERTEX_COLOR);
	tgcMesh.shader = GuiController.Instance.tgcShaders.getTgcMeshShader(tgcMesh);
	
	return tgcMesh;
}


/**
 * Crea Material y Textura
 * @param {TgcMaterialData} materialData
 * @param {String} texturesUrl
 * @return {TgcSceneLoaderMaterialAux}
 */
TgcSceneLoader.prototype.createTextureAndMaterial = function(materialData, texturesUrl)
{
	var matAux = new TgcSceneLoaderMaterialAux();

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
 * Crear BoundingBox de mesh en base a vertices de meshData
 * @param {TgcMeshData} meshData
 * @return {TgcBoundingBox}
 */
TgcSceneLoader.prototype.createMeshBoundingBox = function(meshData)
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
 function TgcSceneLoaderMaterialAux() {
	this.texture = undefined;
	this.subMaterials = undefined;
 }











