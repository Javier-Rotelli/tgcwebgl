/**
 * Manejo de Keyboard y Mouse
 *
 * @author Matias Leone
 */
 
/**
 * Botones del mouse
 */
TgcInput.MouseButtons = {
	/**
	 * Boton izquierdo
	 */
	BUTTON_LEFT: 0,
	
	/**
	 * Boton derecho
	 */
    BUTTON_RIGHT: 1,
	
	/**
	 * Boton del medio
	 */
    BUTTON_MIDDLE: 2,
}

/**
 * Codigos de teclas del teclado
 * http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 */
TgcInput.Keys = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	PAUSE_BREAK: 19,
	CAPS_LOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	INSERT: 45,
	DELETE: 46,
	D0: 48,
	D1: 49,
	D2: 50,
	D3: 51,
	D4: 52,
	D5: 53,
	D6: 54,
	D7: 55,
	D8: 56,
	D9: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	LEFT_WINDOW_KEY: 91,
	RIGHT_WINDOW_KEY: 92,
	SELECT_KEY: 93,
	NUMPAD_0: 96,
	NUMPAD_1: 97,
	NUMPAD_2: 98,
	NUMPAD_3: 99,
	NUMPAD_4: 100,
	NUMPAD_5: 101,
	NUMPAD_6: 102,
	NUMPAD_7: 103,
	NUMPAD_8: 104,
	NUMPAD_9: 105,
	MULTIPLY: 106,
	ADD: 107,
	SUBTRACT: 109,
	DECIMAL_POINT: 110,
	DIVIDE: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUM_LOCK: 144,
	SCROLL_LOCK: 145,
	SEMI_COLON: 186,
	EQUAL_SIGN: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	FORWARD_SLASH: 191,
	GRAVE_ACCENT: 192,
	OPEN_BRACKET: 219,
	BACK_SLASH: 220,
	CLOSE_BRAKET: 221,
	SINGLE_QUOTE: 222,
};

 
/**
 * Atributos
 */
TgcInput.prototype = {
	/**
     * Array que para cada key indica true si en el frame anterior estaba presionado
     * @type {Array<bool>}
     */
	 previousKeyboardState: undefined,
    
	/**
     * Array que para cada key indica true si en el frame actual esta presionado
     * @type {Array<bool>}
     */
    currentKeyboardState: undefined,
	
	/**
     * Array que para cada boton del mouse indica true si en el frame anterior estaba presionado
     * @type {Array<bool>}
     */
    previousMouseButtonsState: undefined,
	
	/**
     * Array que para cada boton del mouse indica true si en el frame actual esta presionado
     * @type {Array<bool>}
     */
    currentMouseButtonsState: undefined,
	
	/**
     * Posicion absoluta de X del mouse
     * @type {int}
     */
    xPos: 0,
	
	/**
     * Posicion absoluta de Y del mouse
     * @type {int}
     */
    yPos: 0,
	
	/**
     * Desplazamiento relativo de X del mouse
     * @type {int}
     */
    xPosRelative: 0,
	
	/**
     * Desplazamiento relativo de Y del mouse
     * @type {int}
     */
    yPosRelative: 0,
}
	
 
 
/**
 * Constructor
 */
function TgcInput () {
	var _this = this;
	
	//Variables internas para registro de eventos
	this.eventMouseX = undefined;
	this.eventMouseY = undefined;
	this.eventKeyPressed = undefined;
	this.eventMouseButtonsPressed = undefined;
	
	
	//Iniciar estado de teclas de keyboard
	this.eventKeyPressed = new Array();
	this.previousKeyboardState = new Array();
	this.currentKeyboardState = new Array();
	for(k in TgcInput.Keys) {
		this.eventKeyPressed[TgcInput.Keys[k]] = false;
		this.previousKeyboardState[TgcInput.Keys[k]] = false;
		this.currentKeyboardState[TgcInput.Keys[k]] = false;
	}
	
	//Agregar eventos del DOM para keyboard
	document.addEventListener("keydown", function(event) {
        _this.eventKeyPressed[event.keyCode] = true;
    }, false);
    
	document.addEventListener("keyup", function(event) {
        _this.eventKeyPressed[event.keyCode] = false;
    }, false);
	
    
	
	//Iniciar estado de botones del mouse
	this.eventMouseButtonsPressed = new Array();
	this.previousMouseButtonsState = new Array();
	this.currentMouseButtonsState = new Array();
	for(b in TgcInput.MouseButtons) {
		this.eventMouseButtonsPressed[TgcInput.MouseButtons[b]] = false;
		this.previousMouseButtonsState[TgcInput.MouseButtons[b]] = false;
		this.currentMouseButtonsState[TgcInput.MouseButtons[b]] = false;
	}
	
	//Agregar eventos al CANVAS para el mouse
	var canvas = GuiController.Instance.canvas;
	var canvasOffsetLeft = canvas.offsetLeft;
	var canvasOffsetTop = canvas.offsetTop;
	canvas.addEventListener("mousedown", function(event) {
		_this.eventMouseButtonsPressed[TgcInput.getMouseButton(event)] = true;
    }, false);
    canvas.addEventListener("mouseup", function(event) {
		_this.eventMouseButtonsPressed[TgcInput.getMouseButton(event)] = false;
    }, false);
    canvas.addEventListener("mousemove", function(event) {
		_this.eventMouseX = event.pageX - canvasOffsetLeft;
		_this.eventMouseY = event.pageY - canvasOffsetTop;
    }, false);

	
	
	//TODO: Investigar Mouse Wheel: http://code.google.com/p/jquery-utils/wiki/MouseWheel

}

/**
 * Actualizar estado de input (Pooling)
 **/
TgcInput.prototype.updateInput = function() {
	//Hacer copia del estado actual del teclado
	for(var i = 0; i < this.previousKeyboardState.length; i++) {
		this.previousKeyboardState[i] = this.currentKeyboardState[i];
	}
	
	//Hacer copia del estado actual de los botones del mouse
	for(var i = 0; i < this.previousMouseButtonsState.length; i++) {
		this.previousMouseButtonsState[i] = this.currentMouseButtonsState[i];
	}
	
	//Actualizar estado actual de teclado
	for(var i = 0; i < this.eventKeyPressed.length; i++) {
		this.currentKeyboardState[i] = this.eventKeyPressed[i];
	}
	
	//Actualizar estado actual de los botones del mouse
	for(var i = 0; i < this.eventMouseButtonsPressed.length; i++) {
		this.currentMouseButtonsState[i] = this.eventMouseButtonsPressed[i];
	}
	
	//Actualizar posicion del mouse
	//TODO: CONTROLAR MEJOR CUANDO EL MOUSE ESTA AFUERA DEL CANVAS
	this.xPosRelative = this.eventMouseX - this.xPos;
	this.yPosRelative = this.eventMouseY - this.yPos;
	this.xPos = this.eventMouseX;
	this.yPos = this.eventMouseY;
}

/**
 * Obtener boton del mouse apretado.
 * 
 * @static
 * @param {MouseEvent} e
 * @return {TgcInput.MouseButtons} boton apretado
 **/
TgcInput.getMouseButton = function(e) {
	//TODO: Analizar fix para IE: http://javascript.info/tutorial/mouse-events#getting-the-button-info-which-button

	if(e.button == 0) return TgcInput.MouseButtons.BUTTON_LEFT;
	if(e.button  == 2) return TgcInput.MouseButtons.BUTTON_RIGHT;
	return TgcInput.MouseButtons.BUTTON_MIDDLE;
}

/**
 * Informa si una tecla se encuentra presionada
 *
 * @param {TgcInput.Keys} key
 * @return {bool}
 **/
TgcInput.prototype.keyDown = function(key) {
	return this.currentKeyboardState[key];
}

/**
 * Informa si una tecla se dejo de presionar
 *
 * @param {TgcInput.Keys} key
 * @return {bool}
 **/
TgcInput.prototype.keyUp = function(key) {
	return this.previousKeyboardState[key] && !this.currentKeyboardState[key];
}

/**
 * Informa si una tecla se presiono y luego se libero
 *
 * @param {TgcInput.Keys} key
 * @return {bool}
 **/
TgcInput.prototype.keyPressed = function(key) {
	return !this.previousKeyboardState[key] && this.currentKeyboardState[key];
}

/**
 * Informa si un boton del mouse se encuentra presionado
 *
 * @param {TgcInput.MouseButtons} button
 * @return {bool}
 **/
TgcInput.prototype.buttonDown = function(button) {
	return this.currentMouseButtonsState[button];
}

/**
 * Informa si un boton del mouse se dejo de presionar
 *
 * @param {TgcInput.MouseButtons} button
 * @return {bool}
 **/
TgcInput.prototype.buttonUp = function(button) {
	return this.previousMouseButtonsState[button] && !this.currentMouseButtonsState[button];
}

/**
 * Informa si un boton del mouse se presiono y luego se libero
 *
 * @param {TgcInput.MouseButtons} button
 * @return {bool}
 **/
TgcInput.prototype.buttonPressed = function(button) {
	return !this.previousMouseButtonsState[button] && this.currentMouseButtonsState[button];
}




