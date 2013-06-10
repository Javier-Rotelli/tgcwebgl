/**
 * Pool para reutilizar texturas de igual path
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcTexturePool.prototype = {
	/**
     * Diccionario de texturas
     * @type Array<PoolItem>
     */
    texturesPool: new Array(),
}
 
 
/**
 * Constructor
 */
function TgcTexturePool() {
	
}

/**
 * Agrega una textura al pool.
 * Si no existe la crea. Sino reutiliza una existente.
 *
 * @param {String} fileUrl
 * @return {WebGLTexture} textura de WebGL creada (puede aun no estar cargada porque la carga es asincronica)
 **/
TgcTexturePool.prototype.createTexture = function(fileUrl) {
	var glTexture = undefined;
	
	//Si no existe, crear textura
	if (this.texturesPool[fileUrl] == undefined) {
		glTexture = GuiController.Instance.gl.createTexture();
		glTexture.image = new Image();
		var poolThis = this;
		glTexture.image.onload = function () {
			poolThis.createTextureCallback(fileUrl, glTexture);
		};
		glTexture.image.onerror = function () {
			TgcUtils.throwException("Could not load texture: " + fileUrl);
		};
		glTexture.image.src = fileUrl;
		
	//Ya existe, no cargar devuelta
	} else {
		//aumentar las referencias a esta textura en el pool
		var item = this.texturesPool[fileUrl];
		item.references++;
		glTexture = item.glTexture;
	}
	
	return glTexture;
}

/**
 * Callback de createTexture. Termina de crear la textura.
 *
 * @param {String} fileUrl
 * @param {WebGLTexture} glTexture
 **/
TgcTexturePool.prototype.createTextureCallback = function(fileUrl, glTexture) {
	var gl = GuiController.Instance.gl;
	
	//http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
	
	//Hacer resize si las dimensiones de la textura no son potencia de dos
	if (!this.isPowerOfTwo(glTexture.image.width) || !this.isPowerOfTwo(glTexture.image.height)) {
        // Scale up the texture to the next highest power of two dimensions.
        var canvas = document.createElement("canvas");
        canvas.width = this.nextHighestPowerOfTwo(glTexture.image.width);
        canvas.height = this.nextHighestPowerOfTwo(glTexture.image.height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(glTexture.image, 0, 0, glTexture.image.width, glTexture.image.height);
        glTexture.image = canvas;
    }
	
	//Hacer Binding de textura
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //TODO: Revisar si esto es necesario
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.bindTexture(gl.TEXTURE_2D, glTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	//gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	                  
	
	//Generar Mipmaps
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	//Agregar al pool
	var newItem = new Object();
	newItem.glTexture = glTexture;
	newItem.fileUrl = fileUrl;
	newItem.references = 0;
	this.texturesPool[fileUrl] = newItem;
}

/**
 * Indica si un valor es potencia de dos
 *
 * @param {int} x
 * @param {bool}
 **/
TgcTexturePool.prototype.isPowerOfTwo = function(x) {
	return (x & (x - 1)) == 0;
}
 
/**
 * Devuelve el siguiente valor de X que es potencia de dos
 *
 * @param {int} x
 * @param {int}
 **/
TgcTexturePool.prototype.nextHighestPowerOfTwo = function(x) {
	--x;
    for (var i = 1; i < 32; i <<= 1) {
        x = x | x >> i;
    }
    return x + 1;
}



/**
 * Hace Dispose de una textura del pool, pero solo si nadie mas la está utilizando.
 * @param {String} fileUrl
 * @return {bool}
 */
TgcTexturePool.prototype.disposeTexture = function(fileUrl) {
	if (this.texturesPool[fileUrl] != undefined)
	{
		var item = this.texturesPool[fileUrl];

		//Quitar una referencia a esta textura
		item.references--;

		//Si nadie mas referencia esta textura, eliminar realmente
		if (item.references <= 0)
		{
			//Dispose real de textura de OpenGL
			GuiController.Instance.gl.deleteTexture(item.glTexture);

			//Quitar del pool
			this.texturesPool[fileUrl] = undefined;
			return true;
		}
	}
	return false;
}

/**
 * Limpia todos los elementos del pool
 */
TgcTexturePool.prototype.clearAll = function()
{
	for (i in this.texturesPool) {
		GuiController.Instance.gl.deleteTexture(this.texturesPool[i].glTexture);
	}
	this.texturesPool = new Array();
}



