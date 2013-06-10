/**
 * Atributo de shader
 *
 * @author Matias Leone
 */
 
 
/**
 * Atributos
 */
TgcShaderAttribute.prototype = {
	/**
     * Nombre del atributo
     * @type String
     */
    name: undefined,
	
	/**
     * Posicion del atributo
     * @type int
     */
    pos: undefined,
}
 
/**
 * Constructor
 * @param {String} name
 * @param {int} pos
 */
function TgcShaderAttribute (name, pos) {
	this.name = name;
	this.pos = pos;
}





