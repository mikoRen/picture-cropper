var imgInput = document.getElementById("img-input");
var submitBtn = document.getElementById("submit");
var exportBtn = document.getElementById("export");
var mySlider = document.getElementById("slider");
var resultCanvas = document.getElementById("result-canvas");
var resultCxt = resultCanvas.getContext("2d");
var imgCanvas = document.getElementById("image-canvas");
var imgCxt = imgCanvas.getContext("2d");
var currentFactor = 1; //当前的放缩倍数
var minFactor = 1; //最小放缩倍数
var maxFactor = 1; //最大放缩倍数
var img = new Image();
img.setAttribute('crossOrigin', 'anonymous');

// const imgUrl = "https://udi-official-website.oss-cn-shenzhen.aliyuncs.com/0/rc-upload-1584349106386-2";

imgInput.onchange = function() {
    console.log("======",imgInput.files[0]);
   var imgUrl =  URL.createObjectURL(imgInput.files[0]);
   imgCanvas.setAttribute('height', 300);
   resultCanvas.setAttribute('height',200);
   drawMask();
   getImage(imgUrl);
    // var fileReader = new FileReader();
    // fileReader.readAsBinaryString(imgInput.files[0]);
}

//获取图像并画出来
getImage = function(imgUrl) {
    // img.src = './changtuxiang.jpg'
    img.src=imgUrl;
    img.onload = function() {
        calculateFactor();
        var originPosition = canvasOriginPosition();
        imgCxt.globalCompositeOperation = "destination-over";
        imgCxt.drawImage(img,originPosition.positionX,originPosition.positionY,img.width*currentFactor,img.height*currentFactor);
    }
}

//画蒙版
drawMask = function() {
    imgCxt.fillStyle = "rgba(0,0,0,0.5)";
    imgCxt.fillRect(0,0,300,300);
    imgCxt.fillStyle = "rgba(0,0,0,1)";
    imgCxt.globalCompositeOperation = "destination-out";
    imgCxt.fillRect(50,50,200,200);
}


//控制canvas拖动
var moving = false;
var lastmouseX = null;
var lastmouseY = null;

//上次移动结束,canvas画图的位置
var lastImgX = 0;
var lastImgY = 0;

imgCanvas.onmousedown=function(e) {
    // console.log("onmousedown",lastImgX,lastImgY);
    moving = true;
    lastmouseX = e.clientX;
    lastmouseY = e.clientY;
}

window.onmouseup = function(e) {
    if(moving === true) {
        moving = false;
        var newPosition = checkPosition(e.clientX - lastmouseX,e.clientY - lastmouseY)
        //每次移动完成都要改变一下上次图片绘制位置
        lastImgX = newPosition.X;
        lastImgY = newPosition.Y;
        // console.log("onmouseup",lastImgX,lastImgY);
    }
}



redrawImg = function(pX,pY) {
    //每次绘图前检查position是否没有超出区域
    var newPosition = checkPosition(pX,pY)
    imgCanvas.setAttribute('height', 300);
    drawMask();
    imgCxt.globalCompositeOperation = "destination-over";
    imgCxt.drawImage(img,newPosition.X,newPosition.Y,img.width*currentFactor,img.height*currentFactor);

}

checkPosition = function(pX,pY) {
    if(pX+lastImgX<=50&&pX+lastImgX>=250-img.width*currentFactor&&pY+lastImgY<=50&&pY+lastImgY>=250-img.height*currentFactor) {
        return ({"X":pX+lastImgX,"Y":pY+lastImgY});
    } else {
        var x_ = pX+lastImgX;
        var y_ = pY+lastImgY;
        if(pX+lastImgX>50) {
            x_ = 50;
        }
        if(pX+lastImgX<250-img.width*currentFactor) {
            x_ = 250-img.width*currentFactor;
        }
        if(pY+lastImgY>50) {
            y_ = 50;
        }
        if(pY+lastImgY<250-img.height*currentFactor) {
            y_ = 250-img.height*currentFactor;
        }
        return({"X":x_,"Y":y_});
    }
}

// 计算初始Factor
calculateFactor = function() {
    if(img.width<img.height) {
        minFactor = 200/img.width;//初始状态
        currentFactor = 200/img.width;
        maxFactor = 500/img.width;
    } else {
        minFactor = 200/img.height;
        currentFactor = 200/img.height;
        maxFactor = 500/img.height;
    }
    // console.log(currentFactor,minFactor,maxFactor);
    initSlider();
}

//计算初始画布位置
canvasOriginPosition = function() {
    calculateFactor();
    var positionX;
    var positionY;
    if(img.width<img.height) {
        positionX = 50;
        positionY = 50 - (img.height*currentFactor - 200) /2;
    } else {
        positionX = 50 - (img.width*currentFactor - 200) /2;
        positionY = 50;
    }
    lastImgX = positionX;
    lastImgY = positionY;
    return({"positionX":positionX,"positionY":positionY});
}

window.onmousemove = function(e) {
    if(moving) {
        pX=e.clientX - lastmouseX;
        pY=e.clientY - lastmouseY;
        // console.log(checkPosition(pX,pY));
        
        redrawImg(pX,pY);
    }
}

//初始滑动条
initSlider = function() {
    mySlider.min = minFactor;
    mySlider.max = maxFactor;
    // mySlider.value = currentFactor;
    mySlider.step = 0.01;
}


mySlider.oninput = function() {
    currentFactor = mySlider.value;
    //每次缩放完也都要修改图片的绘制位置
    // console.log("oninput",mySlider.value,lastImgX,lastImgY);
    redrawImg(0,0);
}

submitBtn.onclick = function() {
    // console.log("onclick!!",lastImgX,lastImgY);
    resultCxt.drawImage(img,lastImgX-50,lastImgY-50,img.width*currentFactor,img.height*currentFactor)
}

exportBtn.onclick = function() {
    var url = resultCanvas.toDataURL('image/png', 0.92);
    var resultLink = document.createElement("a");
    resultLink.download = "裁剪结果";
    resultLink.href = url;
    document.body.appendChild(resultLink);
    resultLink.click();
    resultLink.remove();
}
