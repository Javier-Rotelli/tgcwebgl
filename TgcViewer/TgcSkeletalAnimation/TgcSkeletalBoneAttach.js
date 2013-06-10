/**
 * Representa un modelo que se adjunta a un hueso del esqueleto, para que se modifique
 * su ubicicación en el espacio en base a las transformaciones del hueso durante la animación.
 * El modelo no debe ser transformado por afuera una vez que es adjuntado a un hueso.
 * El renderizado del modelo debe hacerse por afuera de la animación esquelética.
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcSkeletalBoneAttach.prototype = {
	/**
     * Modelo que se adjunta al hueso
     * @type TgcMesh
     */
    mesh: undefined,
	
	/**
     * Hueso al cual se le adjunta un modelo
     * @type TgcSkeletalBone
     */
    bone: undefined,
	
	/**
     * Desplazamiento desde el cual el modelo sigue al hueso
     * @type mat4
     */
    offset: undefined,
}
	
 
 
/**
 * Constructor
 * Crear un modelo adjunto a un hueso, vacio
 */
function TgcSkeletalBoneAttach () {

}

/**
 * DESCRIPCION_METODO
 *
 * @param {TYPE} YYYYYY
 * @return {TYPE} XXXXXX
 **/
TgcSkeletalBoneAttach.prototype.METODO1 = function(PARAMETRO1) {
}



