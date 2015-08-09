$.fn.extend({Cubexy: function(opciones) {
					var Cubexy=this;
					var id=$(Cubexy).attr('id');
					defaults = {
						 idInputColor:'colores',
						 idDownload:'Descargar',
						 idPreview:'Preview',
						 CanvasSalida:'canvas',
						 attImagenGrande:'src',
						 cssDefault:true,
						 cssCambioColor:'actual',
						 cssParteActiva:'activo',
						 cssParteUnica:'seleccionado',
						 cssColorPicker:'colors'
					}
					
                    var opciones = $.extend({}, defaults, opciones);
					
					var idInputColor=opciones.idInputColor;  
					var idDownload=opciones.idDownload;
					var idPreview=opciones.idPreview;
					
					var CanvasSalida=opciones.CanvasSalida;
					var attImagenGrande=opciones.attImagenGrande;
					var cssDefault=opciones.cssDefault;
					
					var cssCambioColor=opciones.cssCambioColor;
					var cssParteActiva=opciones.cssParteActiva;
					var cssParteUnica=opciones.cssParteUnica;
					var cssColorPicker=opciones.cssColorPicker;
		 var Estilos='<style>#'+cssColorPicker+' { text-align: left;    margin-left: -12px;}#'+cssColorPicker+' li { display: inline-table;width: 20px;height: 20px;margin: 2px;width: 20px;height: 20px; cursor: pointer;}.'+cssParteUnica+'{border: #000000 2px outset;}</style>';
		 if(cssDefault){$('body').before(Estilos); }
		 
         $('#'+idInputColor).before('<canvas style="display:none" id="tmpCanvas" width="300" height="300"></canvas>');   
         var canvas = document.getElementById(CanvasSalida);
         var ctx = canvas.getContext("2d");
		 ctx.clearRect(0, 0, ctx.width, ctx.height);
            var ImagenesIniciales = [];
            var base_image=[];
            if(!$('#'+id).find('div .'+cssCambioColor).hasClass(cssCambioColor)){
                  $('#'+id + ' div:first-child').addClass(cssCambioColor);
            }
            $('#' + id + ' > div').each(function () {
                 idParte = $(this).attr('id');
                 $('#' + idParte + ' >img').each(function () {
                 if(!$(this).hasClass( cssParteActiva )){
                    $('#' + idParte + ' img:first-child').addClass(cssParteActiva)
                 }
                });
            });
            IniciarPintadoAvatar();
             $('#' + id + ' > div >img').css( 'cursor', 'pointer' );
             $('#' + id + ' > div >img').click(function(){
                $(this).parent().children('img').removeClass(cssParteActiva);
                $(this).addClass(cssParteActiva);
                $('.'+cssCambioColor).removeClass(cssCambioColor);
                $(this).parent().addClass(cssCambioColor);
                $('.'+cssParteUnica).removeClass(cssParteUnica);
                 $(this).addClass(cssParteUnica);
                IniciarPintadoAvatar();
            });
            function IniciarPintadoAvatar(){
            cimgContext=0;
            $('#' + id + ' > div').each(function () {
                idParte = $(this).attr('id');
                $('#' + idParte + ' >img').each(function () {
                   if($(this).hasClass( cssParteActiva )){
                     base_image[cimgContext] = new Image();
                     base_image[cimgContext].src = $(this).attr(attImagenGrande);
                     base_image[cimgContext].enabled=true;
                    if( $(this).parent().attr('data-rgb')){
                       var theRGB = $(this).parent().attr('data-rgb');
                       var RGBColor = theRGB.split(',');
                       base_image[cimgContext].onload = function(){ alterImage(this,RGBColor[0],RGBColor[1],RGBColor[2]); }
                    }else{
                    base_image[cimgContext].onload = function(){ctx.drawImage(this,0,0);}
                    }
                     cimgContext++;
                  }
                });
            });
			
			
          }
          function alterImage(imageObj,r,g,b){
            cvstmp = document.getElementById("tmpCanvas");
            var context= cvstmp.getContext("2d");
            context.clearRect(0, 0, cvstmp.width, cvstmp.height);
            context.drawImage(imageObj, 0, 0);
            var id= context.getImageData(0, 0, cvstmp.width, cvstmp.height);
            for (var i = 0; i < id.data.length; i += 4) {
                if ( id.data[i] + id.data[i+1] + id.data[i+2] == 0 )
                    id.data[i]=r;// red
                    id.data[i+1]=g;// Green
                    id.data[i+2]=b; //blue
                    
            }
            context.putImageData(id, 0, 0);
            ctx.drawImage(cvstmp, 0, 0);
          }
          var colorRGBS=$('#'+idInputColor).attr('data-colores');
            if(!colorRGBS){
            colorRGBS='#F2CFAF,#FFA773,#A98F6D,#693C2D,#1abc9c,#2ecc71,#3498db,#9b59b6,#34495e,#16a085,#27ae60,#2980b9,#8e44ad,#2c3e50,#f1c400,#e67e22,#e74c3c,#ecf0f1,#95a5a6,#f39c12,#d35400,#c0392b,#bdc3c7,#7f8c8d,#E51C23,#4CAF50';
            }
          var cadena='';
           cadena+='<div ><ul id="colors">';
            objRGBS=colorRGBS.split(',');
            $.each(objRGBS, function( key, value ) {
            strgb=(hexToRgb(value));
            cadena +='<li data-rgb='+strgb.r+','+strgb.g+','+strgb.b+' style="background-color:rgb('+strgb.r+','+strgb.g+', '+strgb.b+');"></li>';
            });
            cadena+='</ul></div>';
            $('#'+idInputColor).before(cadena);
			function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
			}
			$('#colors li').click(function(){
				$('.'+cssCambioColor).attr("data-rgb",$(this).attr('data-rgb'));
				IniciarPintadoAvatar();
			});
			$('#'+idDownload).click(function(){
				var dataURL = canvas.toDataURL('image/png');
				$('#'+idDownload).attr('href',dataURL);
				$('#'+idDownload).attr('download',"Archivo.png");
				
			});
			$('#'+idPreview).click(function(){
			$('#'+idPreview).attr('target','_blank');
				var dataURL = canvas.toDataURL('image/png');
				$('#'+idPreview).attr('href',dataURL);
			});
	}
});