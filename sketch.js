let sideLength = 200; // 大圆的直径
let gap = 10; // 大圆之间的间隔
let rows = 5; // 行数  
let cols = 5; // 列数
let rotationSpeed = 1; // 自旋速度
let smallEllipseDiameter = 16; // 小椭圆的直径
let smallEllipseCount = 18; // 每个大圆的小椭圆数量
let smallEllipseDistance = 20; // 小椭圆距离大圆的距离
let concentricCircles = 4; // 同心圆的数量
let concentricCircleColors = []; // 同心圆的颜色
let dottedCircles = 3; // 每层同心圆虚线环的数量



function genRundomColors() {
    for (let i = 0; i < rows; i++) {
        concentricCircleColors.push([]);
        for (let j = 0; j < cols; j++) {
            concentricCircleColors[i].push([]);
            for (let k = 0; k < concentricCircles; k++) {
                concentricCircleColors[i][j].push(color(random(20,255), random(200,255), random(200,255)));
            }
        }
    }
}
//获取对比色
function getContrastColor(hexColor) {
    let c = color(hexColor); 
    let r = red(c); 
    let g = green(c); 
    let b = blue(c); 
    let contrastR = 255 - r + 150+mouseX/5;
    let contrastG = 255 - g + 50+mouseX/10;
    let contrastB = 255 - b + 150-mouseX/10;
    return color(contrastR, contrastG, contrastB);
}
//绘制波浪形状的圆
function drawWaveCircle(i, j, k, radius) {
    
push();
    rotate(frameCount / (50.0 / (j + 50))); // 转速
    beginShape();
    
   
noFill();
    stroke(getContrastColor(concentricCircleColors[i][j][k])); 
    
   
strokeWeight(2);
    for (let angle = 0; angle < 360; angle += 0.5) {
        let r = radius * 0.8 + 8 * sin(40 * angle) + mouseY/20;
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);

    if (radius > 40) {
        
       
beginShape();
        

strokeWeight(10+mouseY/40);
        
       
for (let angle = 0; angle < 360; angle += 0.5) {
            let r = 100 + sin(20 * angle) + mouseY/10;
            let x = r * cos(angle);
            let y = r * sin(angle);
            
           
vertex(x, y);
        }
        endShape(CLOSE);
    }
    pop();
}

//绘制虚线环
function drawDottedCircle(i, j, k, radius) {
    
   
for (let n = 0; n < dottedCircles && k < concentricCircles - 1; n++) {
        
      
push();      
       
rotate(frameCount / (50.0 / (k + 50))); 

stroke(getContrastColor(concentricCircleColors[i][j][k])); 
      
strokeWeight(7 - k); 
        noFill(); 
        
             
if (radius > 40) {
           
            drawingContext.setLineDash([3, 10 - k]);
        } else {
            drawingContext.setLineDash([])
        }
             
        
        ellipse(0, 0, radius * 2 - 10 - 20 * n+mouseY/10); // //通过移动mouseY改变虚线圆的大小
  
pop();
        drawingContext.setLineDash([]); 
    }
}

    
//绘制小椭圆和连线
function drawSmallEllipses() {
    let smallEllipses = [];
    for (let k = 0; k < smallEllipseCount; k++) {
        let angle = map(k, 0, smallEllipseCount, 0, 360);
        let x = (sideLength / 2 + smallEllipseDistance) * cos(angle + smallEllipseDistance);
        let y = (sideLength / 2 + smallEllipseDistance) * sin(angle + smallEllipseDistance);
        smallEllipses.push({ x, y });
    }
    // 绘制小椭圆之间曲线
    stroke('#F1257D');
    strokeWeight(6);
    noFill();
    beginShape();
    drawingContext.setLineDash([3, 10]);
    for (let l = 0; l < smallEllipseCount; l++) {
        curveVertex(smallEllipses[l].x, smallEllipses[l].y);
    }
    endShape(CLOSE);
    // 绘制小椭圆
    for (let l = 0; l < smallEllipseCount; l++) {
        let ellipseRadius = smallEllipseDiameter / 2; // 小椭圆的半径
        // 绘制渐变小椭圆
        for (let i = 0; i <= ellipseRadius; i++) {
            let t = map(i, 0, ellipseRadius, 0, 1); // 将半径映射到0和1之间
            let gradientColor = lerpColor(color('#00FFE1'), color('#FF69B6'), t); // 获取插值颜色
            fill(gradientColor); // 设置填充颜色为插值颜色
            noStroke(); 
            ellipse(smallEllipses[l].x, smallEllipses[l].y, smallEllipseDiameter - i, smallEllipseDiameter - i);
        }
    }
}
//绘制连接两个大圆圆心的渐变半弧线
function drawGradientArc2() {
  
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            push();
            translate((j + 0.5 * (i % 2)) * (sideLength + gap * 4), i * (sideLength + gap) + sideLength / 2); // 将原点移动到每个大圆的中心
            if (!(i % 2 === 0 && j % 2 !== 0) && !(i % 2 !== 0 && j % 2 === 0)) {
              
               let arcStartAngle = sin(millis()/100); 
                let arcEndAngle = sin(millis()/30) * 180; 
                
                for (let i = arcStartAngle; i <= arcEndAngle; i++) {
                    let t = map(i, arcStartAngle, arcEndAngle, 0, 1); // 将角度映射到0和1之间
                    let gradientColor = lerpColor(color('#E1FFFB'), color('#FFD6EB'), t); // 获取插值颜色、
                    stroke(gradientColor); // 设置描边颜色为插值颜色
                    strokeWeight(10+ mouseY/20); 
                    noFill();
                    arc(sideLength - gap * 8, 0, sideLength + gap * 4, sideLength * 1, i, i + 1); // 绘制一个小段的弧线
                }
            }
            pop();
        }
    }
}
//绘制大圆
function drawConcentricCircles() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            push();
            translate((j + 0.5 * (i % 2)) * (sideLength + gap * 4), i * (sideLength + gap) + sideLength / 2); // 将原点移动到每个大圆的中心
            rotate(frameCount * rotationSpeed); // 使每个大圆自旋
            // 绘制同心圆
            for (let k = 0; k < concentricCircles; k++) {
                let radius = sideLength / 2 - k * (sideLength / (1.6 * concentricCircles));
                fill(concentricCircleColors[i][j][k]); // 设置填充颜色为随机色 // 设置填充颜色为随机色
                noStroke();
                ellipse(0, 0, radius * 2-mouseY/8, radius * 2-mouseY/8); // 绘制同心圆 //通过移动mouseY改变圆的大小
                if (i % 2 === 0 && j % 2 !== 0) {
                    drawWaveCircle(i, j, k, radius);
                } else {
                    drawDottedCircle(i, j, k, radius);
                }
            }
            drawSmallEllipses();
            pop();
        }
    }
    drawGradientArc2();
}

function setup() {
    createCanvas(1000, 1000);
    angleMode(DEGREES); // 将角度模式更改为度数
    genRundomColors(); // 生成随机色值
}

function draw() {
    background('#000000');
    drawConcentricCircles();
}




