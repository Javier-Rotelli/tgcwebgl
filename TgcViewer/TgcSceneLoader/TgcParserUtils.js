/**
 * Utilidades generales para parseo y formateo
 *
 * @author Matias Leone
 */
var TgcParserUtils = {};


/**
 * Parsear Boolean
 **/
TgcParserUtils.parseBoolean = function(text) {
	var text = text.toLowerCase();
	return text == "true" ? true : false;
}

/**
 * Parsear Integer
 **/
TgcParserUtils.parseInt = function(text) {
	return parseInt(text);
}

/**
 * Parsear Float
 **/
TgcParserUtils.parseFloat = function(text) {
	return parseFloat(text);
}

/**
 * Parsea el string "[-8.00202,-6.87125,0]" y devuelve un array de 3 floats.
 * Sin invertir nada
 **/
TgcParserUtils.parseFloat3Array = function(text) {
	var aux = text.substring(1, text.length - 1);
	var n = aux.split(",");
	return [
		TgcParserUtils.parseFloat(n[0]),
		TgcParserUtils.parseFloat(n[1]),
		TgcParserUtils.parseFloat(n[2])
	];
}

/**
 * Parsea el string "[-8.00202,-6.87125,0]" y devuelve un array de 3 floats.
 * Adapta de DirectX a OpenGL. Invierte el signo de Z
 **/
TgcParserUtils.parseFloat3ArrayAdapted = function(text) {
	array = TgcParserUtils.parseFloat3Array(text);
	array[2] *= -1;
	return array;
}
	
/**
 * Parsea el string "[-8.00202,-6.87125,0,0.211]" y devuelve un array de 4
 * floats. Sin invertir nada
 **/
TgcParserUtils.parseFloat4Array = function(text) {
	var aux = text.substring(1, text.length - 1);
	var n = aux.split(",");
	return [
		TgcParserUtils.parseFloat(n[0]),
		TgcParserUtils.parseFloat(n[1]),
		TgcParserUtils.parseFloat(n[2]),
		TgcParserUtils.parseFloat(n[3])
	];
}

/**
 * Parsea el string "[-8.00202,-6.87125,0,0.211]" y devuelve un array de 4
 * floats.
 * Adapta de DirectX a OpenGL. Cambia y por z
 */
TgcParserUtils.parseFloat4ArrayAdapted = function(text) {
	var array = TgcParserUtils.parseFloat4Array(text);
	var aux = array[1];
	array[1] = array[2];
	array[2] = aux;
	return array;
}


/**
 * Dividir todo el array de floats por el valor especificado
 **/
TgcParserUtils.divFloatArrayValues = function(array, divValue) {
	var array2 = new Array();
	for (var i = 0; i < array.length; i++) {
		array2.push(array[i] / divValue);
	}
	return array2;
}


/**
 * Parsea el string "[-8.00202,-6.87125]" y devuelve un array de 2 floats.
 * Sin invertir nada
 **/
TgcParserUtils.parseFloat2Array = function(text) {
	var aux = text.substring(1, text.length - 1);
	var n = aux.split(",");
	return [
		TgcParserUtils.parseFloat(n[0]),
		TgcParserUtils.parseFloat(n[1])
	];
}

	
	
/**
 * Parsea un flujo continuo de ints de la forma: 15 10 16 11 16 10 16 11 17
 * 12 17 11 17 12...
**/
TgcParserUtils.parseIntStream = function(text, count) {
	var array = new Array();
	var textArray = text.split(" ");
	for (var i = 0; i < count; i++) {
		array.push(TgcParserUtils.parseInt(textArray[i]));
	}
	return array;
}
	
/**
 * Parsea un flujo continuo de floats de la forma: -74.1818 0.0 1.01613
 * -49.6512 0.0 1.01613...
 */
TgcParserUtils.parseFloatStream = function(text, count) {
	var array = new Array();
	var textArray = text.split(" ");
	for (var i = 0; i < count; i++) {
		array.push(TgcParserUtils.parseFloat(textArray[i]));
	}
	return array;
}

/**
 * Parsea un flujo continuo de floats de la forma: -74.1818 0.0 1.01613
 * -49.6512 0.0 1.01613...
 * Adapta de DirectX a OpenGL. Invierte el signo de Z
 */
TgcParserUtils.parseFloatStreamAdapted = function(text, count) {
	var array = TgcParserUtils.parseFloatStream(text, count);
	for (var i = 2; i < array.length; i+=3) {
		array[i] *= -1;
	}
	return array;
}

	
	
	
	
	
	
	
	
	
	
	
	