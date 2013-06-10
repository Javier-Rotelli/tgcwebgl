/**
 * Parser de archivos XML de formato TGC para TgcSkeletalAnimation
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalParser.prototype = {
	/**
     * DESCRIPCION_ATRIBUTO
     * @type String
     */
    atributo1: undefined,
	
	/**
     * DESCRIPCION_ATRIBUTO
     * @type String
     */
    atributo2: undefined,
}
	
 
 
/**
 * Constructor
 */
function TgcSkeletalParser () {

}

/**
 * Levanta la informacion del mesh a partir de un XML
 *
 * @param {XmlElement} root nodo root del DOM de un XML del tipo -TgcSkeletalMesh.xml
 * @return {TgcSkeletalMeshData} datos cargados
 **/
TgcSkeletalParser.prototype.parseMeshFromXml = function(root) {

	try {
	
		var meshData = new TgcSkeletalMeshData();
		
		// Ver si tiene exportacion de texturas
		var texturesExportNode = root.getElementsByTagName("texturesExport")[0];
		var texturesExportEnabled = TgcParserUtils.parseBoolean(texturesExportNode.getAttribute("enabled"));
		if (texturesExportEnabled) {
			meshData.texturesDir = texturesExportNode.getAttribute("dir");
		}
		
		// Parsear Texturas
		var materialNodes = root.getElementsByTagName("materials")[0].getElementsByTagName("m");
		meshData.materialsData = new Array();
		for (var i = 0; i < materialNodes.length; i++) {
			var matNode = materialNodes[i];

			// determinar tipo de Material
			var material = new TgcMaterialData();
			material.type = matNode.getAttribute("type");

			// Standard Material
			if (material.type == TgcMaterialData.StandardMaterial) {
				this.parseStandardMaterial(material, matNode);
			}

			// Multi Material
			else if (material.type == TgcMaterialData.MultiMaterial) {
				material.name = matNode.getAttribute("name");
				var subMaterialsNodes = matNode.getElementsByTagName("subM");
				material.subMaterials = new Array();
				for (var j = 0; j < subMaterialsNodes.length; j++) {
					var subMaterial = new TgcMaterialData();
					this.parseStandardMaterial(subMaterial, subMaterialsNodes[j]);
					material.subMaterials.push(subMaterial);
				}
			}

			meshData.materialsData.push(material);
		}
		
		
		//Parsear Mesh
        var meshNode = root.getElementsByTagName("mesh")[0];
		
		//parser y convertir valores
		meshData.name = meshNode.getAttribute("name");
		meshData.materialId = TgcParserUtils.parseInt(meshNode.getAttribute("matId"));
		meshData.color = TgcParserUtils.parseFloat3Array(meshNode.getAttribute("color"));
		
		// visibility
		var visibility = TgcParserUtils.parseFloat(meshNode.getAttribute("visibility"));
		meshData.alphaBlending = visibility != 1.0 ? true : false;
		
		//parsear boundingBox
		var boundingBoxNodes = meshNode.getElementsByTagName("boundingBox");
		if (boundingBoxNodes != undefined && boundingBoxNodes.length == 1) {
			var boundingBoxNode = boundingBoxNodes[0];
			meshData.pMin = TgcParserUtils.parseFloat3Array(boundingBoxNode.getAttribute("min"));
			meshData.pMax = TgcParserUtils.parseFloat3Array(boundingBoxNode.getAttribute("max"));
		}
		
		
		var count;
		
		// parsear coordinatesIdx
		var coordinatesIdxNode = meshNode.getElementsByTagName("coordinatesIdx")[0];
		count = TgcParserUtils.parseInt(coordinatesIdxNode.getAttribute("count"));
		meshData.coordinatesIndices = TgcParserUtils.parseIntStream(coordinatesIdxNode.textContent, count);

		// parsear textCoordsIdx
		var textCoordsIdxNode = meshNode.getElementsByTagName("textCoordsIdx")[0];
		count = TgcParserUtils.parseInt(textCoordsIdxNode.getAttribute("count"));
		meshData.texCoordinatesIndices = TgcParserUtils.parseIntStream(textCoordsIdxNode.textContent, count);

		// parsear colorsIdx
		var colorsIdxNode = meshNode.getElementsByTagName("colorsIdx")[0];
		count = TgcParserUtils.parseInt(colorsIdxNode.getAttribute("count"));
		meshData.colorIndices = TgcParserUtils.parseIntStream(colorsIdxNode.textContent, count);
		
		// parsear matIds
		if (meshData.materialsData.length > 0) {
			var matIdsNode = meshNode.getElementsByTagName("matIds")[0];
			count = TgcParserUtils.parseInt(matIdsNode.getAttribute("count"));
			meshData.materialsIds = TgcParserUtils.parseIntStream(matIdsNode.textContent, count);
		}
		
		// parsear vertices
		var verticesNode = meshNode.getElementsByTagName("vertices")[0];
		count = TgcParserUtils.parseInt(verticesNode.getAttribute("count"));
		meshData.verticesCoordinates = TgcParserUtils.parseFloatStreamAdapted(verticesNode.textContent, count);

		// parsear texCoords
		var texCoordsNode = meshNode.getElementsByTagName("texCoords")[0];
		count = TgcParserUtils.parseInt(texCoordsNode.getAttribute("count"));
		meshData.textureCoordinates = TgcParserUtils.parseFloatStream(texCoordsNode.textContent, count);

		// parsear colors
		var colorsNode = meshNode.getElementsByTagName("colors")[0];
		count = TgcParserUtils.parseInt(colorsNode.getAttribute("count"));
		meshData.verticesColors = TgcParserUtils.divFloatArrayValues(TgcParserUtils.parseFloatStream(colorsNode.textContent, count),255);
		
		
		//parsear esqueleto
		var skeletonNode = meshNode.getElementsByTagName("skeleton")[0];
		var boneNodes = skeletonNode.getElementsByTagName("bone");
		var bonesData = new Array();
		var boneCount = 0;
		for(var i = 0; i < boneNodes.length; i++) {
			var boneNode = boneNodes[i];
			var boneData = new TgcSkeletalBoneData();
			boneData.id = TgcParserUtils.parseInt(boneNode.attributes["id"].textContent);
			boneData.name = boneNode.attributes["name"].textContent;
			boneData.parentId = TgcParserUtils.parseInt(boneNode.attributes["parentId"].textContent);
			boneData.startPosition = TgcParserUtils.parseFloat3Array(boneNode.attributes["pos"].textContent);
			boneData.startRotation = TgcParserUtils.parseFloat4Array(boneNode.attributes["rotQuat"].textContent);

			bonesData.push(boneData);
		}
		meshData.bones = bonesData;

		//parsear Weights
		var weightsNode = meshNode.getElementsByTagName("weights")[0];
		count = TgcParserUtils.parseInt(weightsNode.attributes["count"].textContent);
		meshData.verticesWeights = TgcParserUtils.parseFloatStream(weightsNode.textContent, count);


		return meshData;
		
	
	} catch (e) {
		TgcUtils.throwException("Error al cargar XML de TGC de animacion esqueletica", e);
	}
}


/**
 * Cargar Material
 * @param {TgcMaterialData} material
 * @param {XmlElement} matNode
 **/
TgcSkeletalParser.prototype.parseStandardMaterial = function(material, matNode) {
	material.name = matNode.getAttribute("name");
	material.type = matNode.getAttribute("type");
	
	// Valores de Material
	var ambientStr = matNode.getElementsByTagName("ambient")[0].textContent;
	material.ambientColor = TgcParserUtils.divFloatArrayValues(TgcParserUtils.parseFloat4Array(ambientStr), 255);

	var diffuseStr = matNode.getElementsByTagName("diffuse")[0].textContent;
	material.diffuseColor = TgcParserUtils.divFloatArrayValues(TgcParserUtils.parseFloat4Array(diffuseStr), 255);

	var specularStr = matNode.getElementsByTagName("specular")[0].textContent;
	material.specularColor = TgcParserUtils.divFloatArrayValues(TgcParserUtils.parseFloat4Array(specularStr), 255);

	var opacityStr = matNode.getElementsByTagName("opacity")[0].textContent;
	material.opacity = TgcParserUtils.parseFloat(opacityStr) / 100;

	var alphaBlendEnableNode = matNode.getElementsByTagName("alphaBlendEnable")[0];
	if (alphaBlendEnableNode != undefined) {
		var alphaBlendEnableStr = alphaBlendEnableNode.textContent;
		material.alphaBlendEnable = TgcParserUtils.parseBoolean(alphaBlendEnableStr);
	}

	// Valores de Bitmap
	var bitmapNode = matNode.getElementsByTagName("bitmap")[0];
	if (bitmapNode != undefined) {
		material.fileName = bitmapNode.textContent;

		// TODO: formatear correctamente TILING y OFFSET
		var uvTilingStr = bitmapNode.getAttribute("uvTiling");
		material.uvTiling = TgcParserUtils.parseFloat2Array(uvTilingStr);

		var uvOffsetStr = bitmapNode.getAttribute("uvOffset");
		material.uvOffset = TgcParserUtils.parseFloat2Array(uvOffsetStr);
	} else {
		material.fileName = undefined;
		material.uvTiling = undefined;
		material.uvOffset = undefined;
	}
}


/**
 * Levanta la informacion de una animacion a partir del XML
 * @param {XmlElement} root nodo root del DOM de un XML del tipo -TgcSkeletalAnim.xml
 * @return {TgcSkeletalAnimationData} animacion cargada
 **/
TgcSkeletalParser.prototype.parseAnimationFromXml = function(root) {
	var animation = new TgcSkeletalAnimationData();

	//Parsear informacion general de animation
	var animationNode = root.getElementsByTagName("animation")[0];
	animation.name = animationNode.attributes["name"].textContent;
	animation.bonesCount = TgcParserUtils.parseInt(animationNode.attributes["bonesCount"].textContent);
	animation.framesCount = TgcParserUtils.parseInt(animationNode.attributes["framesCount"].textContent);
	animation.frameRate = TgcParserUtils.parseInt(animationNode.attributes["frameRate"].textContent);
	animation.startFrame = TgcParserUtils.parseInt(animationNode.attributes["startFrame"].textContent);
	animation.endFrame = TgcParserUtils.parseInt(animationNode.attributes["endFrame"].textContent);

	//Parsear boundingBox, si esta
	var boundingBoxNodes = animationNode.getElementsByTagName("boundingBox");
	if (boundingBoxNodes != undefined && boundingBoxNodes.length == 1)
	{
		var boundingBoxNode = boundingBoxNodes[0];
		animation.pMin = TgcParserUtils.parseFloat3Array(boundingBoxNode.attributes["min"].textContent);
		animation.pMax = TgcParserUtils.parseFloat3Array(boundingBoxNode.attributes["max"].textContent);
	}

	//Parsear bones
	var boneNodes = animationNode.getElementsByTagName("bone");
	animation.bonesFrames = new Array();
	for(var i = 0; i < boneNodes.length; i++) {
		var boneNode = boneNodes[i];
		var boneData = new TgcSkeletalAnimationBoneData();
		boneData.id = TgcParserUtils.parseInt(boneNode.attributes["id"].textContent);
		boneData.keyFramesCount = TgcParserUtils.parseInt(boneNode.attributes["keyFramesCount"].textContent);
		boneData.keyFrames = new Array();

		//Parsear frames
		var frameNodes = boneNode.getElementsByTagName("frame");
		for(var j = 0; j < frameNodes.length; j++) {
			var frameNode = frameNodes[j];
			var frameData = new TgcSkeletalAnimationBoneFrameData();
			frameData.frame = TgcParserUtils.parseInt(frameNode.attributes["n"].textContent);
			frameData.position = TgcParserUtils.parseFloat3Array(frameNode.attributes["pos"].textContent);
			frameData.rotation = TgcParserUtils.parseFloat4Array(frameNode.attributes["rotQuat"].textContent);

			boneData.keyFrames.push(frameData);
		}

		animation.bonesFrames.push(boneData);
	}

	return animation;
}