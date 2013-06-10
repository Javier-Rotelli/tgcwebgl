
/**
 * Parser de XML de escena creado con plugin TgcSceneExporter.ms de 3DsMax
 * @author Matias Leone
 *
 */
function TgcSceneParser () {

}

/**
 * Levanta la informacion del XML
 * @param {XmlElement} root nodo root del DOM del XML
 * @return {TgcSceneData}
 */
TgcSceneParser.prototype.parseSceneFromXml = function(root) {

	try {
	
		var tgcSceneData = new TgcSceneData();
		tgcSceneData.name = root.getElementsByTagName("name")[0].textContent;
		
		// Ver si tiene exportacion de texturas
		var texturesExportNode = root.getElementsByTagName("texturesExport")[0];
		var texturesExportEnabled = TgcParserUtils.parseBoolean(texturesExportNode.getAttribute("enabled"));
		if (texturesExportEnabled) {
			tgcSceneData.texturesDir = texturesExportNode.getAttribute("dir");
		}
		
		// Ver si tiene LightMaps
		var lightmapsExportNode = root.getElementsByTagName("lightmapExport")[0];
		tgcSceneData.lightmapsEnabled = TgcParserUtils.parseBoolean(lightmapsExportNode.getAttribute("enabled"));
		if (tgcSceneData.lightmapsEnabled) {
			tgcSceneData.lightmapsDir = lightmapsExportNode.getAttribute("dir");
		}

		// sceneBoundingBox, si está
		var sceneBoundingBoxNodes = root.getElementsByTagName("sceneBoundingBox");
		if (sceneBoundingBoxNodes != undefined && sceneBoundingBoxNodes.length == 1) {
			var sceneBoundingBoxNode = sceneBoundingBoxNodes[0];
			tgcSceneData.pMin = TgcParserUtils.parseFloat3ArrayAdapted(sceneBoundingBoxNode.getAttribute("min"));
			tgcSceneData.pMax = TgcParserUtils.parseFloat3ArrayAdapted(sceneBoundingBoxNode.getAttribute("max"));
		}
		
		// Parsear Texturas
		var materialNodes = root.getElementsByTagName("materials")[0].getElementsByTagName("m");
		tgcSceneData.materialsData = new Array();
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

			tgcSceneData.materialsData.push(material);
		}
		
		// Parsear Meshes
		var meshesNodes = root.getElementsByTagName("meshes")[0].getElementsByTagName("mesh");
		tgcSceneData.meshesData = new Array();
		var count;
		for (var i = 0; i < meshesNodes.length; i++) {
			var meshNode = meshesNodes[i];
			var meshData = new TgcMeshData();
			tgcSceneData.meshesData.push(meshData);

			// parser y convertir valores
			meshData.name = meshNode.getAttribute("name");
			meshData.materialId = TgcParserUtils.parseInt(meshNode.getAttribute("matId"));
			meshData.color = TgcParserUtils.parseFloat3Array(meshNode.getAttribute("color"));
			meshData.lightmap = meshNode.getAttribute("lightmap");

			// type
			meshData.instanceType = TgcMeshData.ORIGINAL;
			if (this.hasAttribute(meshNode, "type")) {
				meshData.instanceType = meshNode.getAttribute("type");
			}

			// type
			if (this.hasAttribute(meshNode, "layer")) {
				meshData.layerName = meshNode.getAttribute("layer");
			}

			// visibility
			var visibility = TgcParserUtils.parseFloat(meshNode.getAttribute("visibility"));
			meshData.alphaBlending = visibility != 1.0 ? true : false;

			// parsear boundingBox
			var boundingBoxNodes = meshNode.getElementsByTagName("boundingBox");
			if (boundingBoxNodes != undefined && boundingBoxNodes.length == 1) {
				var boundingBoxNode = boundingBoxNodes[0];
				meshData.pMin = TgcParserUtils.parseFloat3Array(boundingBoxNode.getAttribute("min"));
				meshData.pMax = TgcParserUtils.parseFloat3Array(boundingBoxNode.getAttribute("max"));
			}

			// parsear datos de mesh Original
			if (meshData.instanceType == TgcMeshData.ORIGINAL) {
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
				// TODO: ver bien como calcula esto el SCRIPT de Exportacion
				if (meshData.materialId != -1) {
					var matIdsNode = meshNode.getElementsByTagName("matIds")[0];
					count = TgcParserUtils.parseInt(matIdsNode.getAttribute("count"));
					meshData.materialsIds = TgcParserUtils.parseIntStream(matIdsNode.textContent, count);
				}

				// parsear textCoordsLightMapIdx
				meshData.lightmapEnabled = tgcSceneData.lightmapsEnabled && ($.trim(meshData.lightmap)).length > 0;
				if (meshData.lightmapEnabled) {
					var textCoordsLightMapIdxNode = meshNode.getElementsByTagName("textCoordsLightMapIdx")[0];
					count = TgcParserUtils.parseInt(textCoordsLightMapIdxNode.getAttribute("count"));
					meshData.texCoordinatesIndicesLightMap = TgcParserUtils.parseIntStream(textCoordsLightMapIdxNode.textContent, count);
				}

				// parsear vertices
				var verticesNode = meshNode.getElementsByTagName("vertices")[0];
				count = TgcParserUtils.parseInt(verticesNode.getAttribute("count"));
				meshData.verticesCoordinates = TgcParserUtils.parseFloatStreamAdapted(verticesNode.textContent, count);

				// parsear normals
				var normalsNode = meshNode.getElementsByTagName("normals")[0];
				count = TgcParserUtils.parseInt(normalsNode.getAttribute("count"));
				meshData.verticesNormals = TgcParserUtils.parseFloatStreamAdapted(normalsNode.textContent, count);

				// parsear texCoords
				var texCoordsNode = meshNode.getElementsByTagName("texCoords")[0];
				count = TgcParserUtils.parseInt(texCoordsNode.getAttribute("count"));
				meshData.textureCoordinates = TgcParserUtils.parseFloatStream(texCoordsNode.textContent, count);

				// parsear colors
				var colorsNode = meshNode.getElementsByTagName("colors")[0];
				count = TgcParserUtils.parseInt(colorsNode.getAttribute("count"));
				meshData.verticesColors = TgcParserUtils.divFloatArrayValues(TgcParserUtils.parseFloatStream(colorsNode.textContent, count),255);

				// parsear texCoordsLightMap
				if (meshData.lightmapEnabled) {
					var texCoordsLightMapNode = meshNode.getElementsByTagName("texCoordsLightMap")[0];
					count = TgcParserUtils.parseInt(texCoordsLightMapNode.getAttribute("count"));
					meshData.textureCoordinatesLightMap = TgcParserUtils.parseFloatStream(texCoordsLightMapNode.textContent,count);
					// Convertir coordenada v de DirectX a OpenGL (v = 1 - v)
					for (var j = 1; j < meshData.textureCoordinatesLightMap.length; j += 2) {
						meshData.textureCoordinatesLightMap[j] = 1 - meshData.textureCoordinatesLightMap[j];
					}
				}
			}

			// parsear datos de mesh Instancia
			else if (meshData.instanceType == TgcMeshData.INSTANCE) {
				// originalMesh
				var originalMeshNode = meshNode.getElementsByTagName("originalMesh")[0];
				meshData.originalMesh = TgcParserUtils.parseInt(originalMeshNode.textContent);

				// transform
				var transformNode = meshNode.getElementsByTagName("transform")[0];
				meshData.position = TgcParserUtils.parseFloat3ArrayAdapted(transformNode.getAttribute("pos"));
				meshData.rotation = TgcParserUtils.parseFloat4ArrayAdapted(transformNode.getAttribute("rotQuat"));
				meshData.scale = TgcParserUtils.parseFloat3ArrayAdapted(transformNode.getAttribute("scale"));
			}

			// Parsear userProperties, si hay
			var userPropsNodes = meshNode.getElementsByTagName("userProps");
			if (userPropsNodes != undefined && userPropsNodes.length == 1) {
				meshData.userProperties = new Array();
				var userPropsNode = userPropsNodes[0];
				for (var j = 0; j < userPropsNode.childNodes.length; j++) {
					var prop = userPropsNode.childNodes[j];
					meshData.userProperties[prop.nodeName] = prop.tagName;
				}
			}
		}
		
		
		/*
		//Parsear PortalRendering, si hay información
		XmlNodeList portalRenderingNodes = root.GetElementsByTagName("portalRendering");
		if (portalRenderingNodes != undefined && portalRenderingNodes.Count == 1)
		{
			XmlElement portalRenderingvar = (XmlElement)portalRenderingNodes[0];
			TgcPortalRenderingParser portalParser = new TgcPortalRenderingParser();
			tgcSceneData.portalData = portalParser.parseFromXmlNode(portalRenderingNode);
		}
		*/
		

		return tgcSceneData;
	
	
	} catch (e) {
		TgcUtils.throwException("Error al cargar XML de TGC", e);
	}
	

}

/**
 * Cargar Material
 * @param {TgcMaterialData} material
 * @param {XmlElement} matNode
 **/
TgcSceneParser.prototype.parseStandardMaterial = function(material, matNode) {
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
 * Indica si el nodo tiene el atributo pedido
 **/
TgcSceneParser.prototype.hasAttribute = function(node, name) {
	var att = node.getAttribute(name);
	return att != undefined;
}






