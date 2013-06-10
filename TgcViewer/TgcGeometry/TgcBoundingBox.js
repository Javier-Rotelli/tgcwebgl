/**
 * Representa un BoundingBox
 *
 * @author Matias Leone
 */
 
/**
 * Atributos
 */
TgcBoundingBox.prototype = {
	/**
     * @type bool
     */
    dirtyValues: true,
	
	/**
     * @type vec3
     */
    pMinOriginal: vec3.create(),
	
	/**
     * @type vec3
     */
    pMaxOriginal: vec3.create(),
	
	/**
     * Punto minimo del BoundingBox
     * @type vec3
     */
    pMin: vec3.create(),
	
	/**
     * Punto maximo del BoundingBox
     * @type vec3
     */
    pMax: vec3.create(),
	
}
 
 
/**
 * Constructor
 */
function TgcBoundingBox () {

}

/**
 * Constructor
 * @param {Array<float>} pMin Punto mínimo
 * @param {Array<float>} pMax Punto máximo
 */
function TgcBoundingBox (pMin, pMax) {
    this.setExtremes(pMin, pMax);
}

/**
 * Configurar los valores extremos del BoundingBox
 * @param {Array<float>} pMin Punto mínimo
 * @param {Array<float>} pMax Punto máximo
 */
TgcBoundingBox.prototype.setExtremes = function(pMin, pMax)
{
	vec3.set(pMin, this.pMin);
	vec3.set(pMax, this.pMax);
	vec3.set(pMin, this.pMinOriginal);
	vec3.set(pMax, this.pMaxOriginal);
	dirtyValues = true;
}

/**
 * Crea un BoundingBox que contenga a todos los BoundingBoxes especificados
 * @static
 * @param {Array<TgcBoundingBox>} Lista BoundingBoxes a contener
 * @return {TgcBoundingBox} BoundingBox creado
 */
TgcBoundingBox.computeFromBoundingBoxes = function(boundingBoxes) {
	var points = new Array();
	for (var i = 0; i < boundingBoxes.length; i++)
	{
		points.push(boundingBoxes[i].pMin);
		points.push(boundingBoxes[i].pMax);
	}
	return TgcBoundingBox.computeFromPoints(points);
}

/**
 * Crea un BoundingBox a partir de un conjunto de puntos.
 * @static
 * @param {Array<vec3>} points Puntos a conentener
 * @return {TgcBoundingBox} BoundingBox creado
 */
TgcBoundingBox.computeFromPoints = function(points) {
	var min = vec3.createFrom(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
	var max = vec3.createFrom(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

	for (var i = 0; i < points.length; i++)
	{
		var p = points[i];
		
		//min
		if (p[0] < min[0])
		{
			min[0] = p[0];
		}
		if (p[1] < min[1])
		{
			min[1] = p[1];
		}
		if (p[2] < min[2])
		{
			min[2] = p[2];
		}
		
		//max
		if (p[0] > max[0])
		{
			max[0] = p[0];
		}
		if (p[1] > max[1])
		{
			max[1] = p[1];
		}
		if (p[2] > max[2])
		{
			max[2] = p[2];
		}
	}

	return new TgcBoundingBox(min, max);
}

/**
 * Traslada y escala el BoundingBox.
 * Si el BoundingBox tenia alguna rotación, se pierde.
 * 
 * @param {vec3} position Nueva posición absoluta de referencia
 * @return {vec3} scale Nueva escala absoluta de referencia
 */
TgcBoundingBox.prototype.scaleTranslate = function(position, scale) {
	//actualizar puntos extremos
	this.pMin[0] = this.pMinOriginal[0] * scale[0] + position[0];
	this.pMin[1] = this.pMinOriginal[1] * scale[1] + position[1];
	this.pMin[2] = this.pMinOriginal[2] * scale[2] + position[2];

	this.pMax[0] = this.pMaxOriginal[0] * scale[0] + position[0];
	this.pMax[1] = this.pMaxOriginal[1] * scale[1] + position[1];
	this.pMax[2] = this.pMaxOriginal[2] * scale[2] + position[2];

	//dirtyValues = true;
}












