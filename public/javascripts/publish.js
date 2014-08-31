//添加一个上传文件的js

$(document).ready(function(){
	
	$("#myfile").change(function(){
		// alert(this.value);

		var data = new FormData(); 

		var files = $('#myfile')[0].files;  
		if(files){
			data.append('codecsv',files[0]);
		}
		$.ajax({  
                    cache: false,  
                    type: 'post',  
                    dataType: 'json',  
                    url:'/upload',                     
                    data : data, 
                    contentType: false,  
                	  processData: false,  
                    success : function (data) {  
				var png_path = data.path;
				png_path = "![image]("+png_path +")";
				// png_path = "/<img alt=\"image\" src=\"" + png_path + "\" width=90px height=90px />";
				alert(png_path);
				var content = $('#content').val() + png_path;
				$('#content').val(content);
                    }  
                });  
	});

});