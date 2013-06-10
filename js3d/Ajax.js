/**
 * AJAX Class v0.31 para jQuery 1.5
 *
 * @class AJAX
 * @author Lucio Moya 
 * @param {Object} opciones - objeto JSON con atributos opcionales *
 *  opciones:
 *    - id: indentificador interno
 * 	  - metodo: POST o GET
 * 	  - tipoRespuesta: AJAX.tipo.TEXTO, AJAX.tipo.JSON, AJAX.tipo.XML
 * 	  - parametros: string en formato URL o un objeto Hash
 * 	  - avisoCargando: id del elemento con el aviso de cargando
 * 	  - onFinish: funcion que se ejecuta luego de la peticion. Recibe la peticion y el ID
 * 	  - onError: funcion que se ejecuta luego de un error
 **/
var Ajax = function (opciones)
{
  //TODO: Ajax - Pensar como trabajar con cola de peticiones
  this._opciones = opciones || undefined;
  
  this._jQueryOpc =
  {
    context: this,
    success: Ajax._Recibir,
    error: Ajax._Error
  }
  if(this._opciones != undefined)
    this._setJQueryOpc(opciones);
}
Ajax.prototype =
{
//Private Methods
  _setJQueryOpc:function(opciones)
  {    
    this._jQueryOpc.type = Ajax._P(opciones, "metodo", Ajax.METODO.GET);
    this._jQueryOpc.data = Ajax._P(opciones, "parametros");
    this._jQueryOpc.dataType = Ajax._P(opciones, "tipoRespuesta", Ajax.TIPO.TEXTO);    
  },
//Public Methods

  /**
   *Metodo que realiza peticoines Ajax con para jQuery 1.5
   * @param {String} url - La URL donde hacer la peticion
   * @param {Object} opciones - objeto JSON con atributos opcionales
   *    - id: indentificador interno
   * 	  - metodo: POST o GET
   * 	  - tipoRespuesta: AJAX.tipo.TEXTO, AJAX.tipo.JSON, AJAX.tipo.XML
   * 	  - parametros: string en formato URL o un objeto Hash
   * 	  - avisoCargando: id del elemento con el aviso de cargando
   * 	  - onFinish: funcion que se ejecuta luego de la peticion. Recibe la peticion y el ID
   * 	  - onError: funcion que se ejecuta luego de un error 
   */
  request: function(url, opciones)
  {    
    this._opciones = opciones; //Guarda las opciones adicionales de la clase
    this._jQueryOpc.url = url; //Guarda en las opciones de jQuery la direccion del archivo a buscar
    this._setJQueryOpc(opciones); //Guarda todas las opciones adicionales de jQuery
    
    //Activa el aviso de Cargando
    if(Ajax._P(this._opciones, "avisoCargando")!=undefined)
      Ajax._Cargando(this._opciones.avisoCargando, true);
    
    //Realiza la peticion por medio de jQuery
    $.ajax(this._jQueryOpc);
  }
}

//Public Constants

/**
 *@description tipo de peticion AJAX, puede ser XML, Texto, o JSON
 **/
Ajax.TIPO =
{
  HTML: "html",
  XML: "xml",
  TEXTO: "text",
  JSON: "json"
}
/**
 *@description metodo de la peticion AJAX, puede ser GET o POST
 **/
Ajax.METODO =
{
  GET: "GET",
  POST: "POST"
}

//Private Static

/**
 * Metodo interno que recibe la peticion desde Prototype
 * @param data {Object} Datos devueltos por el servidor de acuerdo con el tipo
 * @param status {String} Estado de la solicitud al servidor
 * @param xhr {Ojecto} jqXHR elemento XMLHttpRequest
 * */
Ajax._Recibir = function(data, status, xhr)
{
  //Desactiva el cartel de cargando
  if (Ajax._P(this._opciones, "avisoCargando")!=undefined)
      Ajax._Cargando(this._opciones.avisoCargando, false);
  
  var funcionRetorno = Ajax._P(this._opciones, "onFinish");  //Obtener funcion onfinish
  var id = Ajax._P(this._opciones, "id"); //Obtener ID de operacion
  
  //Ejecuta la funcionRetorno (onFinish) y le envia el resultado de la peticion y el ID
  //TODO: functionRetorno - reveer el codigo, se puede mejorar para trabajar con las mejoras que agregas de jQuery
  if (funcionRetorno!=undefined)
  {
    var tipoRespuesta = Ajax._P(this._opciones, "tipoRespuesta",Ajax.TIPO.TEXTO);
    switch(tipoRespuesta)
    {
      case Ajax.TIPO.TEXTO:funcionRetorno(data, id);break;
      case Ajax.TIPO.XML:funcionRetorno(data, id);break;
      case Ajax.TIPO.JSON:
      var objeto;
      try
      {
        objeto = xhr.responseText.evalJSON();
      }
      catch(e)
      {
        Ajax._Error(this._opciones, xhr, {code: -1, message: "JSON no valido"});
        return;
      }
      funcionRetorno(objeto, id);break;
    }
  }
}
/**
* Metodo interno que activa el cartel de cargando
* @param aviso {String} Id del elemento donde esta el cartel
* @param activar {Bool} Habilita el cartel de cargado
**/
Ajax._Cargando = function(aviso, activar)
{  
  if (activar)
    $(aviso).fadeOut("slow");
  else
    $(aviso).hide();
};
/**
*Metodo interno que recibe y procesa los errores en la peticion de Prototype
* @param xhr {Objeto} jqXHR Object
* @param status {String}  Respuesta con el tipo de error de Prototype
* @param error {Objeto} JSON con los valores de la excepcion. Codigo y mensaje
**/
Ajax._Error = function (xhr, status, error)
{
  //Desactiva el aviso cargando
  if (Ajax._P(this._opciones, "avisoCargando")!=undefined)
    Ajax._Cargando(this._opciones.avisoCargando, false);
  //Error del Servidor
  if (status==undefined)
    status =
    {
      code: xhr.status,
      message: "Error del servidor"
    };
  //Ejecuto la funcion onerror si existe
  var funcionError = Ajax._P(this._getOpciones, "onError");
  if (funcionError!=undefined)
    funcionError(status, Ajax._P(this._getOpciones, "id"));
};
/**
* Metodo interno que entrega un parametro opcional desde una coleccion tipo JSON, con valor default
* @param coleccion {Objeto} JSON con parametros opcionales
* @param parametro {String} parametro buscado
* @param defecto {Objeto} parametro por defecto
**/
Ajax._P = function(coleccion, parametro, defecto)
{
  if(coleccion==undefined)
  {
    return defecto;
  }
  else
  {
    if(coleccion[parametro]==undefined)
      return defecto;
    else
      return coleccion[parametro];
  }
};

/* Algunos metodos fueron tomados de AjaxLib v1.0 del libro AJAX web 2.0 para profesionales por Maximiliano R. Firtman */