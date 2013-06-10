/**
 * Utilidades generales
 *
 * @author Matias Leone
 */

var TgcUtils = {};

/**
 * Descarga un xml por Ajax a partir de una url y devuelve el rootNode del xml.
 * Se descarga en forma sincronica
 *
 * @param {String} url
 * @return {XmlNode} Root Node del xml
 **/
TgcUtils.loadXmlFile = function(url) {
	var xmlRootNode = undefined;
	
	$.ajax({
		async: false,
		url: url,
		dataType: 'xml',
		success: function(data) {
			xmlRootNode = data;
		}
	});
	
	return xmlRootNode;
}

/**
 * Devuelve la URL de la carpeta que contiene el archivo especificado
 *
 * @param {String} fileUrl URL del archivo
 * @return {String} URL de la carpeta que contiene ese archivo
 **/
TgcUtils.getDirUrlFromFileUrl = function(fileUrl) {
	var n = fileUrl.lastIndexOf("/");
	return fileUrl.substring(0, n + 1);
}

/**
 * Devuelve el nombre del archivo de la url especificada
 * Ej: localhost/media/textura.jpg => textura.jpg
 *
 * @param {String} fileUrl URL del archivo
 * @return {String} fileName del archivo
 **/
TgcUtils.getFileName = function(fileUrl) {
	var n = fileUrl.lastIndexOf("/");
	return fileUrl.substring(n + 1, fileUrl.length);
}


/**
 * Arrojar excepcion con mensaje y otra excepcion wrappeada
 *
 * @param {String} msg
 * @return {Excepcion} e
 **/
TgcUtils.throwException = function(msg, e) {
	if(e != undefined) {
		msg += " Exception: " + e + ". Exception message: " + e.message;
	}
	throw msg;
}










