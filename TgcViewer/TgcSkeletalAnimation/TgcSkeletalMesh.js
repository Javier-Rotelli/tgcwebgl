/**
 * Malla que representa un modelo 3D con varias animaciones, animadas por Skeletal Animation
 *
 * @author Matias Leone
 */
 
 
/**
 * Tipos de de renderizado de malla
 */
TgcSkeletalMesh.MeshRenderType = {
	/**
	 * Solo colores por vertice
	 */
	VERTEX_COLOR: 0,
	
	/**
	 * Solo un canal de textura en DiffuseMap
	 */
	DIFFUSE_MAP: 1,
}
 
 
/**
 * Atributos
 */
TgcSkeletalMesh.prototype = {
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
     * BoundingBox de la malla sin ninguna animación.
     * @type TgcBoundingBox
     */
    staticMeshBoundingBox: undefined,
	
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
	
	/**
     * Huesos del esqueleto de la malla. Ordenados en forma jerárquica
     * @type Array<TgcSkeletalBone>
     */
    bones: undefined,
	
	/**
     * Influencias de los vertices
     * @type Array<TgcSkeletalVertexWeight>
     */
    verticesWeights: undefined,
	
	/**
     * Mapa de animaciones de la malla
     * @type Array<String, TgcSkeletalAnimation>
     */
    animations: new Array(),
	
	/**
     * Animación actual de la malla
     * @type TgcSkeletalAnimation
     */
    currentAnimation: undefined,
	
	/**
     * Velocidad de la animacion medida en cuadros por segundo.
     * @type float
     */
    frameRate: undefined,
	
	/**
     * Cuadro actual de animacion
     * @type int
     */
    currentFrame: undefined,
	
	/**
     * Indica si actualmente hay una animación en curso.
     * @type bool
     */
    isAnimating: false,
	
	/**
     * Indica si la animación actual se ejecuta con un Loop
     * @type bool
     */
    playLoop: false,
	
	/**
     * Modelos adjuntados para seguir la trayectoria de algún hueso
     * @type Array<TgcSkeletalBoneAttach>
     */
    attachments: new Array(),
	
	/**
     * Evento que se llama cada vez que la animación actual finaliza.
	 * Se llama cuando se acabaron los frames de la animación.
	 * Si se anima en Loop, se llama cada vez que termina.
     * @type function({TgcSkeletalMesh)}
     */
    animationEndsHandler: undefined,
	
	/**
     * En true renderiza solo el esqueleto del modelo, en lugar de la malla.
     * @type bool
     */
    renderSkeleton: false,
}
 
/**
 * Constructor
 * Crea una nueva malla.
 * @param {String} name Nombre de la malla
 * @param {int} glVertexBufferId Vertex Buffer
 * @param {int} glIndexBufferId Index Buffer
 * @param {Array<int>} subGroupsVertexCount Sub-Grupos de textura
 * @param {MeshRenderType} glVertexBufferId Formato de renderizado de la malla
 * @param {TgcSkeletalMesh_OriginalData} origData Datos originales de la malla que hay almacenar
 * @param {Array<TgcSkeletalBone>} bones Datos de los huesos
 * @param {Array<TgcSkeletalVertexWeight>} verticesWeights Datos de los Weights para cada vertice
 */
function TgcSkeletalMesh (name, glVertexBufferId, glIndexBufferId, subGroupsVertexCount, renderType, origData, bones, verticesWeights) {
		//Asignar variables
		this.name = name;
		//Material[] materials;
		this.renderType = renderType;
		this.glVertexBufferId = glVertexBufferId;
		this.glIndexBufferId = glIndexBufferId; 
		this.subGroupsVertexCount = subGroupsVertexCount;
		this.bones = bones;
		this.verticesWeights = verticesWeights;
		
		//Informacion del MeshData original que hay que guardar para poder alterar el VertexBuffer con la animacion
		this.originalData = origData;
		
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


        //Variables auxiliares de animacion
        this.currentTime = 0;
		this.animationTimeLenght = 0;
		this.frameTranslation = vec3.create();
		this.quatFrameRotation = quat4.create();
		this.quatFrameRotationMat = mat4.identity();
		this.frameMatrix = mat4.identity();
		this.verticesFrameFinal = new Float32Array(this.originalData.verticesCoordinates.length);
		this.vertexBufferUpdateData = new Float32Array(this.originalData.coordinatesIndices.length);
		this.vTransformed = vec3.create();
		this.vAux = vec3.create();
		this.vOrig = vec3.create();
		
		
		//Crear array temporal de matrices de huesos
		this.boneSpaceFinalTransforms = new Array();
		for (var i = 0; i < this.bones.length; i++) {
			this.boneSpaceFinalTransforms.push(mat4.create());
		}
		

		//acomodar huesos
		this.setupSkeleton();
		
		//Elementos para renderizar el esqueleto
        //protected TgcBox[] skeletonRenderJoints;
        //protected TgcLine[] skeletonRenderBones;
		this.skeletonRenderJoints = undefined;
		this.skeletonRenderBones = undefined;
}

/**
 * Configuracion inicial del esquleto
 **/
TgcSkeletalMesh.prototype.setupSkeleton = function() {
	//Actualizar jerarquia
	for (var i = 0; i < this.bones.length; i++)
	{
		var bone = this.bones[i];

		//Es hijo o padre
		if (bone.parentBone == undefined)
		{
			bone.matFinal = mat4.create(bone.matLocal);
		}
		else
		{
			//Multiplicar por la matriz del padre
			bone.matFinal = mat4.create();
			mat4.multiply(bone.parentBone.matFinal, bone.matLocal , bone.matFinal);                  
		}

		//Almacenar la inversa de la posicion original del hueso, para la referencia inicial de los vertices
		bone.matInversePose = mat4.create();
		mat4.inverse(bone.matFinal, bone.matInversePose);
	}
}

/**
 * Establece cual es la animacion activa de la malla.
 * Si la animacion activa es la misma que ya esta siendo animada actualmente, no se para ni se reinicia.
 * Para forzar que se reinicie es necesario hacer stopAnimation()
 * @param {String} animationName Nombre de la animacion a activar
 * @param {bool} [playLoop] Indica si la animacion vuelve a comenzar al terminar. Opcional, por default es true.
 * @param {float} [userFrameRate] FrameRate personalizado. Con -1 se utiliza el default de la animación. Opcional, se usa el default de cada animacion.
 **/
TgcSkeletalMesh.prototype.playAnimation = function(animationName, playLoop, userFrameRate) {
	//opcionales
	playLoop = playLoop == undefined ? true : playLoop;
	userFrameRate = userFrameRate == undefined ? -1 : userFrameRate;

	//ya se esta animando algo
	if (this.isAnimating)
	{
		//Si la animacion pedida es la misma que la actual no la quitamos
		if (this.currentAnimation.Name == animationName)
		{
			//solo actualizamos el playLoop
			this.playLoop = playLoop;
		}
		//es una nueva animacion
		else
		{
			//parar animacion actual
			this.stopAnimation();
			//cargar nueva animacion
			this.initAnimationSettings(animationName, playLoop, userFrameRate);
		}
	}

	//no se esta animando nada
	else
	{
		//cargar nueva animacion
		this.initAnimationSettings(animationName, playLoop, userFrameRate);
	}
}

/**
 * Prepara una nueva animacion para ser ejecutada
 * @param {String} animationName
 * @param {bool} playLoop
 * @param {float} userFrameRate
 **/
TgcSkeletalMesh.prototype.initAnimationSettings = function(animationName, playLoop, userFrameRate) {
	this.isAnimating = true;
	this.currentAnimation = this.animations[animationName];
	this.playLoop = playLoop;
	this.currentTime = 0;
	this.currentFrame = 0;

	//Cambiar BoundingBox
	this.boundingBox = this.currentAnimation.boundingBox;
	this.updateBoundingBox();

	//Si el usuario no especifico un FrameRate, tomar el default de la animacion
	if (userFrameRate == -1)
	{
		this.frameRate = this.currentAnimation.frameRate;
	}
	else
	{
		this.frameRate = userFrameRate;
	}

	//La duracion de la animacion.
	this.animationTimeLenght = (this.currentAnimation.framesCount - 1) / this.frameRate;

	
	//Configurar postura inicial de los huesos
	for (var i = 0; i < this.bones.length; i++)
	{
		var bone = this.bones[i];

		if (!this.currentAnimation.hasFrames(i))
		{
			TgcUtils.throwException("El hueso " + bone.Name + " no posee KeyFrames");
		}

		//Determinar matriz local inicial
		var firstFrame = this.currentAnimation.boneFrames[i][0];
		mat4.fromRotationTranslation(firstFrame.rotation, firstFrame.position, bone.matLocal);

		//Multiplicar por matriz del padre, si tiene
		if (bone.parentBone != undefined)
		{
			mat4.multiply(bone.parentBone.matFinal, bone.matLocal, bone.matFinal);
		}
		else
		{
			mat4.set(bone.matLocal, bone.matFinal);
		}
	}
	

	//Ajustar vertices a posicion inicial del esqueleto
	this.updateMeshVertices();
}


/**
 * Desactiva la animacion actual
 **/
TgcSkeletalMesh.prototype.stopAnimation = function() {
	this.isAnimating = false;
	this.boundingBox = this.staticMeshBoundingBox;

	//Invocar evento de finalización
	if (this.animationEndsHandler != undefined)
	{
		this.animationEndsHandler(this, this);
	}
}


/**
 * Actualiza el cuadro actual de la animacion.
 * Debe ser llamado en cada cuadro antes de render()
 **/
TgcSkeletalMesh.prototype.updateAnimation = function() {
	var elapsedTime = GuiController.Instance.elapsedTime;

	//Ver que haya transcurrido cierta cantidad de tiempo
	if (elapsedTime < 0.0)
	{
		return;
	}

	//Sumo el tiempo transcurrido
	this.currentTime += elapsedTime;

	//Se termino la animacion
	if (this.currentTime > this.animationTimeLenght)
	{
		//Ver si hacer loop
		if (this.playLoop)
		{
			//Dejar el remanente de tiempo transcurrido para el proximo loop
			this.currentTime = this.currentTime % this.animationTimeLenght;
			//setSkleletonLastPose();
			//updateMeshVertices();
		}
		else
		{
			//TODO: Puede ser que haya que quitar este stopAnimation() y solo llamar al Listener (sin cargar isAnimating = false)
			this.stopAnimation();
		}
	}

	//La animacion continua
	else
	{
		//Actualizar esqueleto y malla
		this.updateSkeleton();
		this.updateMeshVertices();
	}
}


/**
 * Actualiza la posicion de cada hueso del esqueleto segun sus KeyFrames de la animacion
 **/
TgcSkeletalMesh.prototype.updateSkeleton = function() {
	for (var i = 0; i < this.bones.length; i++)
	{
		var bone = this.bones[i];

		//Tomar el frame actual para este hueso
		var boneFrames = this.currentAnimation.boneFrames[i];

		//Solo hay un frame, no hacer nada, ya se hizo en el init de la animacion
		if (boneFrames.length == 1)
		{
			continue;
		}

		//Obtener cuadro actual segun el tiempo transcurrido
		var currentFrameF = this.currentTime * this.frameRate;
		//Ve a que KeyFrame le corresponde
		var keyFrameIdx = this.getCurrentFrameBone(boneFrames, currentFrameF);
		this.currentFrame = keyFrameIdx;

		//Armar un intervalo entre el proximo KeyFrame y el anterior
		var frame1 = boneFrames[keyFrameIdx - 1];
		var frame2 = boneFrames[keyFrameIdx];

		//Calcular la cantidad que hay interpolar en base al la diferencia entre cuadros
		var framesDiff = frame2.frame - frame1.frame;
		var interpolationValue = (currentFrameF - frame1.frame) / framesDiff;		
		
		//Interpolar traslacion
		//frameTranslation = (frame2.Position - frame1.Position) * interpolationValue + frame1.Position;
		vec3.set(this.frameTranslation, frame2.position);
		vec3.subtract(this.frameTranslation, frame1.position);
		vec3.scale(this.frameTranslation, interpolationValue);
		vec3.add(this.frameTranslation, frame1.position);
		
		//Interpolar rotacion con SLERP
		quat4.slerp(frame1.rotation, frame2.rotation, interpolationValue, this.quatFrameRotation);
		this.quatFrameRotationMat = quat4.toMat4(this.quatFrameRotation);
		
		//Unir ambas transformaciones de este frame
		//frameMatrix = frameTranslation * quatFrameRotationMat
		mat4.identity(this.frameMatrix);
		mat4.translate(this.frameMatrix, this.frameTranslation);
		mat4.multiply(this.frameMatrix, this.quatFrameRotationMat);

		
		//Multiplicar por la matriz del padre, si tiene
		if (bone.parentBone != undefined)
		{
			mat4.multiply(bone.parentBone.matFinal, this.frameMatrix, bone.matFinal);
		}
		else
		{
			mat4.set(this.frameMatrix, bone.matFinal);
		}
	}
}


/**
 * Obtener el KeyFrame correspondiente a cada hueso segun el tiempo transcurrido
 *
 * @param {Array<TgcSkeletalAnimationFrame>} boneFrames
 * @param {float} currentFrame
 * @return {int}
 **/
TgcSkeletalMesh.prototype.getCurrentFrameBone = function(boneFrames, currentFrame) {
	for (var i = 0; i < boneFrames.length; i++)
	{
		  if (currentFrame < boneFrames[i].frame)
		{
			return i;
		}
	}

	return boneFrames.length - 1;
}


/**
 * Actualizar los vertices de la malla segun las posiciones del los huesos del esqueleto
 **/
TgcSkeletalMesh.prototype.updateMeshVertices = function() {
	//Precalcular la multiplicación para llevar a un vertice a Bone-Space y luego transformarlo segun el hueso
	for (var i = 0; i < this.boneSpaceFinalTransforms.length; i++)
	{
		var bone = this.bones[i];
		mat4.multiply(bone.matFinal, bone.matInversePose, this.boneSpaceFinalTransforms[i]);
	}


	//TODO: Toda la siguiente parte de Skinning podria hacerse mas eficiente con un Vertex Shader


	//Cargar array de vertices interpolados
	var vertexCount = this.verticesFrameFinal.length / 3;
	for (var i = 0; i < vertexCount; i++)
	{
		//vertice original
		this.vOrig[0] = this.originalData.verticesCoordinates[i * 3];
		this.vOrig[1] = this.originalData.verticesCoordinates[i * 3 + 1];
		this.vOrig[2] = this.originalData.verticesCoordinates[i * 3 + 2];

		//Obtener los weights de este vertice
		var vertexWeights = this.verticesWeights[i];
		vec3.set(FastMath.CERO_VEC3, this.vTransformed);
		
		//Analizar como influye cada hueso en base a los Weights de este vertice
		for (var j = 0; j < vertexWeights.weights.length; j++)
		{
			var vertexWeight = vertexWeights.weights[j];
			
			//Llevar al vertice a Bone-Space y luego transformarlo segun como se modifico el hueso
			var m = this.boneSpaceFinalTransforms[vertexWeight.bone.index];

			//Aplicar transformacion al vertice original
			mat4.multiplyVec3(m, this.vOrig, this.vAux);

			//Ponderar resultado segun valor de Weight (vTransformed += vAux * vertexWeight.Weight)
			vec3.scale(this.vAux,  vertexWeight.weight);
			vec3.add(this.vTransformed, this.vAux);
		}
		
		//Cargar valores modificados en array final de vertices
		this.verticesFrameFinal[i * 3] = this.vTransformed[0];
		this.verticesFrameFinal[i * 3 + 1] = this.vTransformed[1];
		this.verticesFrameFinal[i * 3 + 2] = this.vTransformed[2];
	}

	//expandir array para el vertex buffer
	this.fillVertexBufferData();
}


/**
 * Llena la informacion del VertexBuffer con los vertices especificados
 **/
TgcSkeletalMesh.prototype.fillVertexBufferData = function() {
	var idx = 0;
	switch (this.renderType)
	{
		case TgcSkeletalMesh.MeshRenderType.VERTEX_COLOR:
			for (var i = 0; i < this.originalData.coordinatesIndices.length; i++)
			{
				//vertices
				var coordIdx = this.originalData.coordinatesIndices[i] * 3;
				this.vertexBufferUpdateData[idx++] = this.verticesFrameFinal[coordIdx];
				this.vertexBufferUpdateData[idx++] = this.verticesFrameFinal[coordIdx + 1];
				this.vertexBufferUpdateData[idx++] = this.verticesFrameFinal[coordIdx + 2];

				//color
				var colorIdx = this.originalData.colorIndices[i];
				this.vertexBufferUpdateData[idx++] = this.originalData.verticesColors[colorIdx];
				this.vertexBufferUpdateData[idx++] = this.originalData.verticesColors[colorIdx + 1];
				this.vertexBufferUpdateData[idx++] = this.originalData.verticesColors[colorIdx + 2];
			}
			break;

		case TgcSkeletalMesh.MeshRenderType.DIFFUSE_MAP:
			for (var i = 0; i < this.originalData.coordinatesIndices.length; i++)
			{
				//vertices
				var coordIdx = this.originalData.coordinatesIndices[i] * 3;
				this.vertexBufferUpdateData[idx++] = this.verticesFrameFinal[coordIdx];
				this.vertexBufferUpdateData[idx++] = this.verticesFrameFinal[coordIdx + 1];
				this.vertexBufferUpdateData[idx++] = this.verticesFrameFinal[coordIdx + 2];

				//color
				var colorIdx = this.originalData.colorIndices[i];
				this.vertexBufferUpdateData[idx++] = this.originalData.verticesColors[colorIdx];
				this.vertexBufferUpdateData[idx++] = this.originalData.verticesColors[colorIdx + 1];
				this.vertexBufferUpdateData[idx++] = this.originalData.verticesColors[colorIdx + 2];

				//texture coordinates diffuseMap
				var texCoordIdx = this.originalData.texCoordinatesIndices[i] * 2;
				this.vertexBufferUpdateData[idx++] = this.originalData.textureCoordinates[texCoordIdx];
				this.vertexBufferUpdateData[idx++] = this.originalData.textureCoordinates[texCoordIdx + 1];
			}
			break;
	}
	
	//Actualizar vertexBuffer
	var gl = GuiController.Instance.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferUpdateData, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


/**
 * Renderiza la malla, si esta habilitada.
 * Para que haya animacion se tiene que haber seteado una y haber
 * llamado previamente al metodo updateAnimation()
 * Sino se renderiza la pose fija de la malla
 **/
TgcSkeletalMesh.prototype.render = function() {
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


	//Renderizar malla
	if (!this.renderSkeleton)
	{
		//Renderizar segun el tipo de render de la malla
		switch (this.renderType)
		{
			case TgcSkeletalMesh.MeshRenderType.VERTEX_COLOR:

				//Setear VertexBuffer
				gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBufferId);
				
				//Cargar atributos de shader
				this.shader.setAttributesEnabled(true);
				
				//Indicar puntero a cada atributo dentro del buffer
				gl.vertexAttribPointer(TgcSkeletalLoader.TYPE_VERTEX_COLOR_VERTEX_POS_INDEX, TgcSceneLoader.VERTEX_POS_SIZE, gl.FLOAT, false, TgcSkeletalLoader.TYPE_VERTEX_COLOR_STRIDE, 0);
				gl.vertexAttribPointer(TgcSkeletalLoader.TYPE_VERTEX_COLOR_VERTEX_COLOR_INDEX, TgcSceneLoader.VERTEX_COLOR_SIZE, gl.FLOAT, false, TgcSkeletalLoader.TYPE_VERTEX_COLOR_STRIDE, TgcSkeletalLoader.TYPE_VERTEX_COLOR_COLOR_OFFSET);
				
				//Setear IndexBuffer
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBufferId);
				
				//Dibujar
				gl.drawElements(gl.TRIANGLES, this.subGroupsVertexCount[0], gl.UNSIGNED_SHORT, 0);
			
				break;

			case TgcSkeletalMesh.MeshRenderType.DIFFUSE_MAP:

				//Setear VertexBuffer
				gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBufferId);
				
				//Cargar atributos de shader
				this.shader.setAttributesEnabled(true);
				
				//Indicar puntero a cada atributo dentro del buffer
				gl.vertexAttribPointer(TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_POS_INDEX, TgcSceneLoader.VERTEX_POS_SIZE, gl.FLOAT, false, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_STRIDE, 0);
				gl.vertexAttribPointer(TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_COLOR_INDEX, TgcSceneLoader.VERTEX_COLOR_SIZE, gl.FLOAT, false, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_STRIDE, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_COLOR_OFFSET);
				gl.vertexAttribPointer(TgcSkeletalLoader.TYPE_DIFFUSE_MAP_VERTEX_TEXCOORD0_INDEX, TgcSceneLoader.VERTEX_TEXCOORD_SIZE, gl.FLOAT, false, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_STRIDE, TgcSkeletalLoader.TYPE_DIFFUSE_MAP_TEXCOORD_OFFSET);
				
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
		}
	}
	//Renderizar esqueleto
	else
	{
		this.renderSkeletonMesh();
	}

	//Desactivar atributos
	this.shader.setAttributesEnabled(false);
	
	//Quitar buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	//Desactivar alphaBlend
	this.resetAlphaBlend();

	
	//Renderizar attachments
	for (var i = 0; i < this.attachments.length; i++)
	{
		var attach = this.attachments[i];
		attach.updateMeshTransform(this.transform);
		attach.mesh.render();
	}
}

/**
 * Aplicar transformaciones del mesh
 */
TgcSkeletalMesh.prototype.updateMeshTransform = function() {
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
TgcSkeletalMesh.prototype.activateAlphaBlend = function() {
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
TgcSkeletalMesh.prototype.resetAlphaBlend = function() {
	var gl = GuiController.Instance.gl;
	gl.disable(gl.BLEND);
    //gl.enable(gl.DEPTH_TEST);
}

/**
 * Dibujar el esqueleto de la malla
 */
TgcSkeletalMesh.prototype.renderSkeletonMesh = function() {
	
	TgcUtils.throwException("renderSkeletonMesh() no implementado");
	
	/*
	Device device = GuiController.Instance.D3dDevice;
	Vector3 ceroVec = new Vector3(0, 0, 0);

	//Dibujar huesos y joints
	for (int i = 0; i < bones.Length; i++)
	{
		TgcSkeletalBone bone = bones[i];

		//Renderizar Joint
		TgcBox jointBox = skeletonRenderJoints[i];
		jointBox.Transform = bone.MatFinal * this.transform;
		jointBox.render();

		//Modificar línea del bone
		if (bone.ParentBone != null)
		{
			TgcLine boneLine = skeletonRenderBones[i];

			boneLine.PStart = Vector3.TransformCoordinate(ceroVec, bone.MatFinal * this.transform);
			boneLine.PEnd = Vector3.TransformCoordinate(ceroVec, bone.ParentBone.MatFinal * this.transform);
			boneLine.updateValues();
		}
	}

	//Dibujar bones
	foreach (TgcLine boneLine in skeletonRenderBones)
	{
		if (boneLine != null)
		{
			boneLine.render();
		}
	}
	*/
}


/**
 * Actualiza el cuadro actual de animacion y renderiza la malla.
 * Es equivalente a llamar a updateAnimation() y luego a render()
 */
TgcSkeletalMesh.prototype.animateAndRender = function() {
	if (!this.enabled)
		return;

	this.updateAnimation();
	this.render();
}

/**
 * Actualiza el cuadro actual de animacion y renderiza la malla.
 * Es equivalente a llamar a updateAnimation() y luego a render()
 */
TgcSkeletalMesh.prototype.updateBoundingBox = function() {
	if (this.autoUpdateBoundingBox)
	{
		this.boundingBox.scaleTranslate(this.position, this.scale);
	}
}








/**
 * Constructor
 * Informacion del MeshData original que hay que guardar para poder alterar el VertexBuffer con la animacion
 */
function TgcSkeletalMesh_OriginalData () {

}

/**
 * Atributos de TgcSkeletalMesh_OriginalData
 */
TgcSkeletalMesh_OriginalData.prototype = {
	/**
     * @type Array<int>
     */
    coordinatesIndices: undefined,
	
	/**
     * @type Array<float>
     */
    verticesCoordinates: undefined,
	
	/**
     * @type Array<int>
     */
    texCoordinatesIndices: undefined,
	
	/**
     * @type Array<int>
     */
    colorIndices: undefined,
	
	/**
     * @type Array<float>
     */
    textureCoordinates: undefined,
	
	/**
     * @type Array<int>
     */
    verticesColors: undefined,
}
