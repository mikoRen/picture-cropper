var imgCanvas = document.getElementById("image-canvas");
var imgCxt = imgCanvas.getContext("2d");

imgCxt.beginPath();
// imgCxt.globalCompositeOperation = "source-over";
imgCxt.fillStyle = "rgba(0,0,0,0.5)";
imgCxt.fillRect(0,0,300,300);
imgCxt.fillStyle = "rgba(0,0,0,1)";
imgCxt.globalCompositeOperation = "destination-out";
imgCxt.fillRect(50,50,200,200);
imgCxt.closePath();

imgCxt.globalCompositeOperation = "destination-over";
var img = new Image();
img.src="./cloud.png";
img.onload = function(){
    imgCxt.drawImage(img,0,0)   
}

