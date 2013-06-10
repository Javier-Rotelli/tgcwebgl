
// Ejemplo de como calcular una Tranformacion de View
// El punto de vista gira alrededor del centro de la palmera


var aspect = 1;
var escala = 50;

var d = 12;
var OX = 500;
var OY = 350;
var ep = 0.01;

// Matriz de View (Pasa de World Space a Camera Space)
var m11 = 1;		var m12 = 0;		var m13 = 0;
var m21 = 0;		var m22 = 1;		var m23 = 0;
var m31 = 0.141;	var m32 = 0.141;	var m33 = 0.707;
var tras_x = 0;		var tras_y = 0;		var tras_z = 0;

var canvas;
var ctx;

var mesh;

function Transform_X(x,y,z)
{
	// Paso de World Space a Camera Space 
	var xc = x*m11 + y*m21 + z*m31 + tras_x;
	var yc = x*m12 + y*m22 + z*m32 + tras_y;
	var zc = x*m13 + y*m23 + z*m33 + tras_z;
	// Perspectiva: Proyecto a Screen Space
	var xs = xc/(zc + d ) * d *escala;
	return xs;
}

function Transform_Y(x,y,z)
{
	// Paso de World Space a Camera Space 
	var xc = x*m11 + y*m21 + z*m31 + tras_x;
	var yc = x*m12 + y*m22 + z*m32 + tras_y;
	var zc = x*m13 + y*m23 + z*m33 + tras_z;
	// Perspectiva: Proyecto a Screen Space
	var ys = yc/(zc + d ) * d *escala * aspect;
	return ys;
}


// Proyecta y Dibuja un triangulo
function DrawTri(x0,y0,z0,x1,y1,z1,x2,y2,z2)
{

	ctx.beginPath();

	// Primer punto
	var X = Transform_X(x0,y0,z0);
	var Y = Transform_Y(x0,y0,z0);
	ctx.moveTo(OX + X, OY - Y);

	// Segundo punto
	X = Transform_X(x1,y1,z1);
	Y = Transform_Y(x1,y1,z1);
	ctx.lineTo(OX + X, OY - Y);

	// Tercer punto
	X = Transform_X(x2,y2,z2);
	Y = Transform_Y(x2,y2,z2);
	ctx.lineTo(OX + X, OY - Y);


	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}


// Dibuja una linea
function Line3d(x0,y0,z0,x1,y1,z1)
{

	ctx.beginPath();

	// Primer punto
	var X = Transform_X(x0,y0,z0);
	var Y = Transform_Y(x0,y0,z0);
	ctx.moveTo(OX + X, OY - Y);

	// Segundo punto
	X = Transform_X(x1,y1,z1);
	Y = Transform_Y(x1,y1,z1);
	ctx.lineTo(OX + X, OY - Y);
	ctx.closePath();
	ctx.stroke();

}

function loadMesh(xml)
{
  var Mesh = new Object();
  
  var meshes = xml.getElementsByTagName('mesh');  
  
  for(var i = 0, total = meshes.length; i < total; i++)
  {
    Mesh.boundingBox = new Object();
    Mesh.boundingBox.max = eval(meshes[i].getElementsByTagName('boundingBox')[0].getAttribute('max'));
//    Mesh.boundingBox.max = new Object();
//    var bmax = meshes[i].getElementsByTagName('boundingBox')[0].getAttribute('max');
//    var aBmax = bmax.split();
//    Mesh.boundingBox.max.x = aBmax[0];
//    Mesh.boundingBox.max.y = aBmax[1];
//    Mesh.boundingBox.max.z = aBmax[2];
    
    Mesh.boundingBox.min = eval(meshes[i].getElementsByTagName('boundingBox')[0].getAttribute('min'));
//    Mesh.boundingBox.min = new Object();
//    var bmin = meshes[i].getElementsByTagName('boundingBox')[0].getAttribute('min');
//    var aBmin = bmin.split();
//    Mesh.boundingBox.min.x = aBmin[0];
//    Mesh.boundingBox.min.y = aBmin[1];
//    Mesh.boundingBox.min.z = aBmin[2];
    
    
    Mesh.nTris = meshes[i].getElementsByTagName('coordinatesIdx')[0].getAttribute('count') / 3;
    var coor = meshes[i].getElementsByTagName('coordinatesIdx')[0].textContent;
    var aCoor = coor.split(' ');
    
    Mesh.coordinatesIdx = new Array();
    for(var j = 0; j < Mesh.nTris; j++)
    {
      var t = new Array();
      t[0] = aCoor[j * 3];
      t[1] = aCoor[j * 3 + 1];
      t[2] = aCoor[j * 3 + 2];
      
      Mesh.coordinatesIdx.push(t);
    }
    
    Mesh.nVerts = meshes[i].getElementsByTagName('vertices')[0].getAttribute('count') / 3;
    var verts = meshes[i].getElementsByTagName('vertices')[0].textContent;
    var aVerts = verts.split(' ');
    
    Mesh.vertices = new Array();
    for(var k = 0; k < Mesh.nVerts; k++)
    {
      var v2 = new Object();
      v2.x = aVerts[k * 3];
      v2.y = aVerts[k * 3 + 1];
      v2.z = aVerts[k * 3 + 2];
      
      Mesh.vertices.push(v2);
    }    
    
    Mesh.triangles = new Array();
    for(var l = 0; l < Mesh.nTris; l++)
    {
      var tri = new Array(), a1 = new Object(), a2 = new Object(), a3 = new Object();
      
      a1.x = Mesh.vertices[Mesh.coordinatesIdx[l][0]].x;
      a1.y = Mesh.vertices[Mesh.coordinatesIdx[l][0]].y;
      a1.z = Mesh.vertices[Mesh.coordinatesIdx[l][0]].z;
      tri.push(a1);
      a2.x = Mesh.vertices[Mesh.coordinatesIdx[l][1]].x;
      a2.y = Mesh.vertices[Mesh.coordinatesIdx[l][1]].y;
      a2.z = Mesh.vertices[Mesh.coordinatesIdx[l][1]].z;
      tri.push(a2);
      a3.x = Mesh.vertices[Mesh.coordinatesIdx[l][2]].x;
      a3.y = Mesh.vertices[Mesh.coordinatesIdx[l][2]].y;
      a3.z = Mesh.vertices[Mesh.coordinatesIdx[l][2]].z;
      tri.push(a3);
      
      Mesh.triangles.push(tri);
    }
    
    Mesh.draw = function()
    {
      for(var m = 0, len = this.triangles.length; m < len; m++)
      {
        ctx.fillStyle = 'rgba(0,255,0,0.4)';
        DrawTri(this.triangles[m][0].x, this.triangles[m][0].y, this.triangles[m][0].z +100, 
                this.triangles[m][1].x, this.triangles[m][1].y, this.triangles[m][1].z + 100, 
                this.triangles[m][2].x, this.triangles[m][2].y, this.triangles[m][2].z + 100);        
      }
    }
      
    
  }
  
  return Mesh;
}

// Dibuja una Palmera
function palmera() 
{
ctx.fillStyle = 'rgba(120,255,120,0.4)';
DrawTri(4.25784,2.35621,4.1643,4.15704,2.35859,4.77698,4.51082,2.22235,4.36735);

}

var t = 0;

// Dibuja un Bosque
function draw() 
{
	if (canvas.getContext)
	{
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(0,0,1000,800);

		t+= 0.1;
        
        
        
//		// Bounding Box de la palmera
//		var min_x = -25.2199;
//		var min_y = -0.177073;
//		var min_z = -59.5469;
//		var max_x = 25.2199;
//		var max_y = 30.1802;
//		var max_z = 59.5469;
//		
//		
//		
//		var LAx = 0 - 1;
//		var LAy = 15.0015635 - 1;
//		var LAz = 0;
//		var LFx = -0.051326599721381795;
//		var LFy = 15.0015635;
//		var LFz = -1.9993412865644127;        
//        
		
		// Bounding Box de la palmera
		var min_x = mesh.boundingBox.min[0];
		var min_y = mesh.boundingBox.min[1];
		var min_z = mesh.boundingBox.min[2];
		var max_x = mesh.boundingBox.max[0];
		var max_y = mesh.boundingBox.max[1];
		var max_z = mesh.boundingBox.max[2];

		// Quiero mirar el centro de la palmera
		// LA = Look At = Objetivo = a donde apunta la camara
		var LAx = (min_x + max_x) / 2;
		var LAy = (min_y + max_y) / 2;
		var LAz = (min_z + max_z) / 2;

		// Calculo el punto de vista = la posicion del observador (camara u ojo) 
		// girando alrededor del centro de la palmera
		var LFx = LAx + Math.sin(t) * 2;
		var LFy = LAy ;
		var LFz = LAz + Math.cos(t) * 2;

		// Calculo la transformacion para pasar todo al espacio del camara
		// La Z es la direccion hacia la camara,
		// La Y es la direccion hacia arriba
		// La X es la direccion hacia la derecha.

		// Eje z = normalizado( LA - LF)
		var Zx = LAx - LFx;
		var Zy = LAy - LFy;
		var Zz = LAz - LFz;
		var len = Math.sqrt(Zx*Zx + Zy*Zy + Zz*Zz);
		Zx /= len;
		Zy /= len;
		Zz /= len;

		// Eje x = normalizado ( cross ( Up = (0,1,0) , Eje z))
		var Xx = Zz;
		var Xy = 0;
		var Xz = -Zx;
		len = Math.sqrt(Xx*Xx + Xy*Xy + Xz*Xz);
		Xx /= len;
		Xy /= len;
		Xz /= len;

		// cross ( Eje z , Eje x)
		var Yx = Zy*Xz-Zz*Xy;
		var Yy = Zz*Xx-Zx*Xz;
		var Yz = Zx*Xy-Zy*Xx;

		// Ya tengo las 3 direcciones, son una Base Ortonormal de R3 
		// la matriz creada asi es la matriz de cambio de bases. 

		
		// Armo la matriz de View: Parte de Rotacion
		m11 = Xx;		m12 = Yx;		m13 = Zx;	
		m21 = Xy;		m22 = Yy;		m23 = Zy;
		m31 = Xz;		m32 = Yz;		m33 = Zz;

		// Parte de Translacion
		// -dot (x , LA)
		tras_x = - (Xx*LAx + Xy*LAy + Xz*LAz);
		// -dot (y , LA)
		tras_y = - (Yx*LAx + Yy*LAy + Yz*LAz);
		// -dot (z , LA)
		tras_z = - (Zx*LAx + Zy*LAy + Zz*LAz);

		mesh.draw();
	}
}

function animate()
{   
	canvas = document.getElementById('mycanvas');
	ctx = canvas.getContext('2d');
    
    var ajax = new Ajax();
    
    var opciones = {
      "metodo": Ajax.METODO.POST,
      "tipoRespuesta": Ajax.TIPO.XML,
      "onFinish": function(o)
      {
        mesh = loadMesh(o);
        
        setInterval(draw, 100);
      }
    };
    
    ajax.request('./Auto-TgcScene.xml', opciones);   
	
} 



