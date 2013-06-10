/**
 * Encapsula una textura de OpenGL junto con información adicional
 *
 * @author Matias Leone
 */
 

/**
 * Atributos
 */
TgcTexture.prototype = {
	/**
     * FileName de la textura
     * @type String
     */
    fileName: undefined,
	
	/**
     * URL de la textura
     * @type String
     */
    fileUrl: undefined,
	
	/**
     * Indica si la textura esta en el pool de texturas
     * @type bool
     */
    inPool: false,
	
	/**
     * Textura de WebGL
     * @type WebGLTexture
     */
    glTexture: undefined,
}
 
/**
 * Constructor
 */
function TgcTexture () {

}


/**
 * Constructor.
 * Crear textura de TGC
 *
 * @param {String} fileName
 * @param {String} fileUrl
 * @param {WebGLTexture} glTexture
 * @param {bool} inPool
 */
function TgcTexture(fileName, fileUrl, glTexture, inPool) {
	this.fileName = fileName;
	this.fileUrl = fileUrl;
	this.glTexture = glTexture;
	this.inPool = inPool;
}

/**
 * Crea una nueva textura, haciendo el Loading del archivo de imagen especificado.
 * Se utiliza un Pool de Texturas para no cargar mas de una vez el mismo archivo.
 *
 * @static
 * @param {String} fileUrl
 * @param {String} fileName. Si es undefined infiere el nombre de la textura en base al path completo
 * @return {TgcTexture}
 */
TgcTexture.createTexture = function(fileUrl, fileName) {
	var glTexture = GuiController.Instance.texturesPool.createTexture(fileUrl);
	if(fileName == undefined) {
		fileName = TgcUtils.getFileName(fileUrl);
	}
	return new TgcTexture(fileName, fileUrl, glTexture, true);
}


/**
 * Libera los recursos de la textura
 */
TgcTexture.prototype.dispose = function() {
	//dispose de textura dentro de pool
	if (this.inPool)
	{
		GuiController.Instance.texturesPool.disposeTexture(this.fileUrl);
	}
	//dispose de textura fuera de pool
	else
	{
		GuiController.Instance.gl.deleteTexture(this.glTexture);
	}
	this.glTexture = undefined;
}



