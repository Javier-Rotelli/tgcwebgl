/**
 * Utilidad para manejar un Effecto de Shader, con Vertex y Pixel Shader
 *
 * @author Matias Leone
 */
 

/**
 * Constructor
 * @param {int} glShaderId
 * @param {Array<TgcShaderAttribute>} attributes
 */
function TgcShaderEffect (glShaderId, attributes) {
	this.glShaderId = glShaderId;
	this.glUniformHandlers = new Array();
	this.attributes = attributes;
}


/**
 * Habilitar o deshabilitar el shader
 *
 * @param {bool} enabled
 **/
TgcShaderEffect.prototype.setEnabled = function(enabled) {
	if(enabled) {
		GuiController.Instance.gl.useProgram(this.glShaderId);
	} else {
		GuiController.Instance.gl.useProgram(0);
	}
}

	
	
/**
 * Retorna el handler de la variable Uniform especificada.
 * Almacena el handler internamente para no volver a pedir a OpenGL en el futuro.
 * @param {String} uniformName nombre del uniform
 * @return {int} handler
 */
TgcShaderEffect.prototype.getUniformHandler = function(uniformName) {
	var glHandler;
	if(this.glUniformHandlers[uniformName] != undefined) {
		glHandler = this.glUniformHandlers[uniformName];
	} else {
		glHandler = GuiController.Instance.gl.getUniformLocation(this.glShaderId, uniformName);
		this.glUniformHandlers[uniformName] = glHandler;
	}
	return glHandler;
}

/**
 * Cargar uniform de matriz de 4x4
 * @param {String} uniformName nombre del uniform
 * @return {mat4} m matriz de 4x4
 */
TgcShaderEffect.prototype.setMatrix4 = function(uniformName, m) {
	GuiController.Instance.gl.uniformMatrix4fv(this.getUniformHandler(uniformName), false, m);
}

/**
 * Cargar uniform de vector 3
 * @param {String} uniformName nombre del uniform
 * @return {vec3} v vector 3
 */
TgcShaderEffect.prototype.setVector3 = function(uniformName, v) {
	GuiController.Instance.gl.uniform3f(this.getUniformHandler(uniformName), v[0], v[1], v[2]);
}

/**
 * Cargar uniform de integer
 * @param {String} uniformName nombre del uniform
 * @return {int} n
 */
TgcShaderEffect.prototype.setInteger = function(uniformName, n) {
	GuiController.Instance.gl.uniform1i(this.getUniformHandler(uniformName), n);
}
	
/**
 * Cargar uniform de textura
 * @param {String} uniformName nombre del uniform
 * @param {TgcTexture} t textura
 * @param {int} slot numero de slot de textura
 */
TgcShaderEffect.prototype.setTexture = function(uniformName, t, slot) {
	var gl = GuiController.Instance.gl;
	
	var glTextureSlot;
	switch (slot) {
	case 0:
		glTextureSlot = gl.TEXTURE0;
		break;
	case 1:
		glTextureSlot = gl.TEXTURE1;
		break;
	case 2:
		glTextureSlot = gl.TEXTURE2;
		break;
	case 3:
		glTextureSlot = gl.TEXTURE3;
		break;
	case 4:
		glTextureSlot = gl.TEXTURE4;
		break;
	default:
		throw "Slot de textura no contemplado";
	}
	
	gl.activeTexture(glTextureSlot);
	gl.bindTexture(gl.TEXTURE_2D, t.glTexture);
	this.setInteger(uniformName, slot);
}

	
/**
 * Activar o desactivar atributos de shader
 * @param {boolean} enabled
 */
TgcShaderEffect.prototype.setAttributesEnabled = function(enabled) {
	var gl = GuiController.Instance.gl;
	if(enabled) {
		for(var i = 0; i < this.attributes.length; i++) {
			gl.enableVertexAttribArray(this.attributes[i].pos);
		}
	} else {
		for(var i = 0; i < this.attributes.length; i++) {
			gl.disableVertexAttribArray(this.attributes[i].pos);
		}
	}
}
	
	
/**
 * Crea un shader a partir del XML con formato tgcEffect, cargando solo la technique especificada.
 * Descarga el archivo XML con una peticion Ajax sincronica
 * @param {String} fileUrl
 * @param {String} technique
 * @param {Array<TgcShaderAttribute>} attributes
 * @return
 */
TgcShaderEffect.fromTgcEffect = function(fileUrl, technique, attributes) {
	try {
		//Cargar XML
		var root = TgcUtils.loadXmlFile(fileUrl);
		return TgcShaderEffect.fromTgcEffectXml(root, technique, attributes);
	} catch (e) {
		TgcUtils.throwException("Error al cargar XML de shader: " + fileUrl + ", technique: " + technique, e);
	}
}
	
/**
 * Crea un shader a partir del XML con formato tgcEffect, cargando solo la technique especificada
 * @param {XmlElement} root XML ya descargado
 * @param {String} technique
 * @param {Array<TgcShaderAttribute>} attributes
 * @return
 */
TgcShaderEffect.fromTgcEffectXml = function(root, technique, attributes) {
	//Obtener technique pedida
	var techniquesNode = root.getElementsByTagName("techniques")[0];
	var techniqueNode = techniquesNode.getElementsByTagName(technique)[0];
	var vertexShaderTag = techniqueNode.getAttribute("vertexShader");
	var fragmentShaderTag = techniqueNode.getAttribute("fragmentShader");
	
	//Codigo de cada shader
	var vertexShaderCode = root.getElementsByTagName(vertexShaderTag)[0].textContent;
	var pixelShaderCode = root.getElementsByTagName(fragmentShaderTag)[0].textContent;
	
	//Crear shader
	return TgcShaderEffect.fromString(vertexShaderCode, pixelShaderCode, attributes);
}
	
	
/**
 * Cargar shader a partir del string del vertex shader y fragment shader
 * @param {String} vertexSource
 * @param {String} fragmentSource
 * @param {Array<TgcShaderAttribute>} attributes
 * @return {TgcShaderEffect} efecto creado
 */
TgcShaderEffect.fromString = function(vertexSource, fragmentSource, attributes) {
	var gl = GuiController.Instance.gl;
	
	//Cargar VertexShader
	var vertexShader = TgcShaderEffect.loadShaderElement(gl.VERTEX_SHADER, vertexSource);

	//Cargar PixelShader
	var pixelShader = TgcShaderEffect.loadShaderElement(gl.FRAGMENT_SHADER, fragmentSource);

	//Crear programa
	var glShaderId = gl.createProgram();
	gl.attachShader(glShaderId, vertexShader);
	gl.attachShader(glShaderId, pixelShader);

	//Bind de atributos
	for(var i = 0; i < attributes.length; i++) {
		gl.bindAttribLocation(glShaderId, attributes[i].pos, attributes[i].name);
	}
	
	//Linkear luego de binding de atributos
	gl.linkProgram(glShaderId);
	
	//Chequear estado
	if (!gl.getProgramParameter(glShaderId, gl.LINK_STATUS)) {
		TgcUtils.throwException("Error al linkear shader", undefined);
	}
	
	//Crear shader de TGC
	var shader = new TgcShaderEffect(glShaderId, attributes);
	return shader; 
}
	
/**
 * Compilar elemento de shader
 * @param {int} shaderType
 * @param {String }source
 * @return {int} gl shader ID
 */
TgcShaderEffect.loadShaderElement = function(shaderType, source) {
	var gl = GuiController.Instance.gl;
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		TgcUtils.throwException("Error al cargar elemento de shader. Log: " + gl.getShaderInfoLog(shader), undefined);
	}
	
	return shader;
}














