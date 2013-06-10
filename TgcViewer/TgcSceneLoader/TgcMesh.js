/**
 * Representa una malla estática.
 * Puede moverse y rotarse pero no tiene animación.
 * La malla puede tener colores por vértice, texturas y lightmaps.
 *
 * @author Matias Leone
 */

 
/**
 * Tipos de de renderizado de malla
 */
TgcMesh.MeshRenderType = {
	/**
	 * Solo colores por vertice
	 */
	VERTEX_COLOR: 0,
	
	/**
	 * Solo un canal de textura en DiffuseMap
	 */
	DIFFUSE_MAP: 1,
	
	/**
	 * Sin canal de textura en DiffuseMap y otro para Lightmap, utilizando Multitexture
	 */
	DIFFUSE_MAP_AND_LIGHTMAP: 2,
}


/**
 * Atributos
 */
TgcMesh.prototype = {
	/**
     * Nombre de la malla
     * @type String
     */
    name: undefined,

	/**
     * Layer al que pertenece la malla.
     * @type String
     */
    layer: undefined,
	
	/**
     * Indica si la malla esta habilitada para ser renderizada
     * @type bool
     */
    enabled: false,
	
	/**
     * User properties de la malla
     * @type Array<String, String>
     */
    userProperties: undefined,
	
	/**
     * Array de texturas para DiffuseMap
     * @type Array<TgcTexture>
     */
    diffuseMaps: undefined,
	
	/**
     * Textura de LightMap
     * @type TgcTexture
     */
    lightMap: undefined,
	
	/**
     * Matriz final que se utiliza para aplicar transformaciones a la malla.
	 * Si la propiedad AutoTransformEnable esta en True, la matriz se reconstruye en cada cuadro
	 * en base a los valores de: Position, Rotation, Scale.
	 * Si AutoTransformEnable está en False, se respeta el valor que el usuario haya cargado en la matriz.
     * @type mat4
     */
    transform: mat4.create(),
	
	/**
     * En True hace que la matriz de transformacion (Transform) de la malla se actualiza en
	 * cada cuadro en forma automática, según los valores de: Position, Rotation, Scale.
	 * En False se respeta lo que el usuario haya cargado a mano en la matriz.
	 * Por default está en True.
     * @type bool
     */
    autoTransformEnable: true,

	/**
     * Posicion absoluta de la Malla
     * @type vec3
     */
    position: vec3.createFrom(0, 0, 0),
	
	/**
     * Rotación absoluta de la Malla
     * @type vec3
     */
    rotation: vec3.createFrom(0, 0, 0),

	/**
     * Escalado absoluto de la malla
     * @type vec3
     */
    scale: vec3.createFrom(1, 1, 1),
	
	/**
     * Tipo de formato de Render de esta malla
     * @type TgcMesh.MeshRenderType
     */
    renderType: undefined,
	
	/**
     * BoundingBox del Mesh
     * @type TgcBoundingBox
     */
    boundingBox: undefined,
	
	/**
     * Indica si se actualiza automaticamente el BoundingBox con cada movimiento de la malla
     * @type bool
     */
    autoUpdateBoundingBox: true,

	/**
     * Habilita el renderizado con AlphaBlending para los modelos
	 * con textura o colores por vértice de canal Alpha.
	 * Por default está deshabilitado.
     * @type bool
     */
    alphaBlendEnable: false,
	
	/**
     * Shader para renderizar la malla
     * @type TgcShaderEffect
     */
    shader: undefined,
}

 
 /**
 * Constructor. Crea un nuevo mesh
 *
 * @param {String} name
 * @param {int} glVertexBufferId
 * @param {int} glIndexBufferId
 * @param {Array<int>} subGroupsVertexCount
 * @param {MeshRenderType} glVertexBufferId
 **/
function TgcMesh (name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, renderType) {
	this.name = name;
	//Material[] materials;
	this.renderType = renderType;
	
	//Variables de render
    this.glVertexBufferId = glVertexBufferId;
	this.glIndexBufferId = glIndexBufferId; 
    this.subGroupsVertexCount = subGroupsVertexCount;
	
	//Calcular offset de subgrupos
	this.subGroupsVertexOffset = new Array();
	this.subGroupsVertexOffset.push(0);
	for (var i = 1; i < this.subGroupsVertexCount.length; i++) {
		this.subGroupsVertexOffset.push(this.subGroupsVertexOffset[i - 1] + this.subGroupsVertexCount[i - 1]);
	}
	//Multiplicar offsets por tamaño en bytes
	for (var i = 0; i < this.subGroupsVertexCount.length; i++) {
		this.subGroupsVertexOffset[i] *= TgcSceneLoader.UNSIGNED_SHORT_SIZE_BYTES
	}
}

/**
 * Dibujar mesh
 */
TgcMesh.prototype.render = function() {
	
	if (!this.enabled)
		return;
	
	var gl = GuiController.Instance.gl;
	
	//Aplicar transformaciones
	this.updateMeshTransform();
	
	//Activar AlphaBlending si corresponde
	this.activateAlphaBlend();

	//Cargar valores uniform de shader de matrices
	this.shader.setEnabled(true);
	
	//Cargar matrices en shader
	GuiController.Instance.computeWorldMatrices(this.transform);
	this.shader.setMatrix4("uWorld", this.transform);
	this.shader.setMatrix4("uView", GuiController.Instance.view);
	this.shader.setMatrix4("uProjection", GuiController.Instance.projection);
	this.shader.setMatrix4("uWorldView", GuiController.Instance.worldView);
	this.shader.setMatrix4("uWorldViewProjection", GuiController.Instance.worldViewProj);
	
	
	//Ver: http://stackoverflow.com/questions/8552365/vertex-buffer-objects-vbo-not-working-on-android-2-3-3-using-gles20
	
	
	//Renderizar segun el tipo de render de la malla
	switch (this.renderType) {
		case TgcMesh.MeshRenderType.VERTEX_COLOR:
		
			//Setear VertexBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBufferId);
			
			//Cargar atributos de shader
			this.shader.setAttributesEnabled(true);
			
			//Indicar puntero a cada atributo dentro del buffer
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_POS_INDEX, TgcSceneLoader.VERTEX_POS_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_VERTEX_COLOR_STRIDE, 0);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_NORMAL_INDEX, TgcSceneLoader.VERTEX_NORMAL_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_VERTEX_COLOR_STRIDE, TgcSceneLoader.TYPE_VERTEX_COLOR_NORMAL_OFFSET);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_VERTEX_COLOR_VERTEX_COLOR_INDEX, TgcSceneLoader.VERTEX_COLOR_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_VERTEX_COLOR_STRIDE, TgcSceneLoader.TYPE_VERTEX_COLOR_COLOR_OFFSET);
			
			//Setear IndexBuffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBufferId);
			
			//Dibujar
			gl.drawElements(gl.TRIANGLES, this.subGroupsVertexCount[0], gl.UNSIGNED_SHORT, 0);
			
			break;
			
		case TgcMesh.MeshRenderType.DIFFUSE_MAP:

			//Setear VertexBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBufferId);
			
			//Cargar atributos de shader
			this.shader.setAttributesEnabled(true);
			
			//Indicar puntero a cada atributo dentro del buffer
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_POS_INDEX, TgcSceneLoader.VERTEX_POS_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_STRIDE, 0);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_NORMAL_INDEX, TgcSceneLoader.VERTEX_NORMAL_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_NORMAL_OFFSET);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_COLOR_INDEX, TgcSceneLoader.VERTEX_COLOR_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_COLOR_OFFSET);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_VERTEX_TEXCOORD0_INDEX, TgcSceneLoader.VERTEX_TEXCOORD_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_TEXCOORD_OFFSET);
			
			//Setear IndexBuffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBufferId);
			
			//Dibujar cada subset con su DiffuseMap correspondiente
			for (var i = 0; i < this.diffuseMaps.length; i++)
			{
				//Activar diffuseMap
				this.shader.setTexture("uDiffuseMap", this.diffuseMaps[i], 0);

				//Dibujar
				gl.drawElements(gl.TRIANGLES, this.subGroupsVertexCount[i], gl.UNSIGNED_SHORT, this.subGroupsVertexOffset[i]);
			}

			break;
			
		case TgcMesh.MeshRenderType.DIFFUSE_MAP_AND_LIGHTMAP:
			
			//Setear VertexBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBufferId);
			
			//Cargar atributos de shader
			this.shader.setAttributesEnabled(true);
			
			//Indicar puntero a cada atributo dentro del buffer
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_POS_INDEX, TgcSceneLoader.VERTEX_POS_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_STRIDE, 0);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_NORMAL_INDEX, TgcSceneLoader.VERTEX_NORMAL_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_NORMAL_OFFSET);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_COLOR_INDEX, TgcSceneLoader.VERTEX_COLOR_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_COLOR_OFFSET);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_TEXCOORD0_INDEX, TgcSceneLoader.VERTEX_TEXCOORD_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_TEXCOORD0_OFFSET);
			gl.vertexAttribPointer(TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_VERTEX_TEXCOORD1_INDEX, TgcSceneLoader.VERTEX_TEXCOORD_SIZE, gl.FLOAT, false, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_STRIDE, TgcSceneLoader.TYPE_DIFFUSE_MAP_AND_LIGHTMAP_TEXCOORD1_OFFSET);
			
			//Setear IndexBuffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBufferId);
			
			//Activar lightmap
			this.shader.setTexture("uLightMap", this.lightmap, 1);
			
			//Dibujar cada subset con su DiffuseMap correspondiente
			for (var i = 0; i < this.diffuseMaps.length; i++)
			{
				//Activar diffuseMap
				this.shader.setTexture("uDiffuseMap", this.diffuseMaps[i], 0);

				//Dibujar
				gl.drawElements(gl.TRIANGLES, this.subGroupsVertexCount[i], gl.UNSIGNED_SHORT, this.subGroupsVertexOffset[i]);
			}
			
			break;
	}
	
	//Desactivar atributos
	this.shader.setAttributesEnabled(false);
	
	//Quitar buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	//Desactivar alphaBlend
	this.resetAlphaBlend();
}


/**
 * Aplicar transformaciones del mesh
 */
TgcMesh.prototype.updateMeshTransform = function() {
	//Aplicar transformacion de malla
	if (this.autoTransformEnable) {
		
		//TODO: Habria que tener toda la expresion final de T * R * S pre-calculada directamente
		//Derivar de: http://www.3dcodingtutorial.com/Basic-OpenGL-functions/Translate-and-Rotate-functions.html
		
		mat4.identity(this.transform);
		mat4.translate(this.transform, this.position);
		//The order of transformations is first roll, then pitch, then yaw.
		mat4.rotateZ(this.transform, this.rotation[2]);
		mat4.rotateX(this.transform, this.rotation[0]);
		mat4.rotateY(this.transform, this.rotation[1]);
		mat4.scale(this.transform, this.scale);
	}
}

/**
 * Activar AlphaBlending, si corresponde
 */
TgcMesh.prototype.activateAlphaBlend = function() {
	var gl = GuiController.Instance.gl;
	if (this.alphaBlendEnable) {
		//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.enable(gl.BLEND);
		//gl.disable(gl.DEPTH_TEST);
	}
}

/**
 * Desactivar AlphaBlending
 */
TgcMesh.prototype.resetAlphaBlend = function() {
	var gl = GuiController.Instance.gl;
	gl.disable(gl.BLEND);
    //gl.enable(gl.DEPTH_TEST);
}


