var cnv;
var w, h, px, py, qx, qy, n_div;
var divs;
var sub_points;
var usr_points;
var dmat;

var CHAR_LENGTH;

var score1=0, n1=0;

function getCheckedCheckboxesFor(checkboxName) {
  var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
  Array.prototype.forEach.call(checkboxes, function(el) {
    values.push(el.value);
  });

  return values;
}

function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  return theta;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function setup() {
  w = windowWidth
  h = windowHeight/1.3
  cnv = createCanvas(w, h);
  cnv.parent('canvas');
 
  CHAR_LENGTH = Math.max(w,h)

  noLoop();


}

function draw() {

  divs = getCheckedCheckboxesFor('frac')
 
  px = w/2*(1+getRandomArbitrary(-1,1)/1.1)
  py = h/2*(1+getRandomArbitrary(-1,1)/1.1)
  qx = w/2*(1+getRandomArbitrary(-1,1)/1.1)
  qy = h/2*(1+getRandomArbitrary(-1,1)/1.1)

  if(qy > py){
    [px, py, qx, qy] = [qx, qy, px, py]
  }

  n_div = divs[Math.floor(Math.random()*divs.length)];


  draw1()

}
function draw1() {
  clear()

  showScores()

  strokeWeight(0);
  text('Divide into '+n_div, 0, 10);

  sub_points = []
  usr_points = []
  stroke(0)
  strokeWeight(2);

  line(px,py,qx,qy)

  ang = angle(px, py, qx, qy)
  dx = px-qx
  dy = py-qy
  d = dist(px,py,qx,qy)

  i = 1
  while(i < n_div){
    strokeWeight(8);
    d_curr = i/n_div * d

    dx_curr = d_curr*Math.cos(ang)
    dy_curr = d_curr*Math.sin(ang)
    sub_points.push([px+dx_curr, py+dy_curr])
    i = i+1
  }
}
function showAnswer1(){
  i = 0
  while(i < sub_points.length){
    stroke(0)
    strokeWeight(8);
    point(sub_points[i][0], sub_points[i][1])
    i = i+1
  }
  strokeWeight(0)
  text('Rel. Err. '+(grade1()*100).toFixed(1)+'%', 0, 20);
}

function grade1(){
  grade = 0
  for(let i = 0; i<sub_points.length; i++){
    c_row = []
    console.log('i ',i)
    for(let j =0; j<usr_points.length; j++){
      console.log('j ',j)
      c_row.push(dist(sub_points[i][0], sub_points[i][1], usr_points[j][0], usr_points[j][1])/CHAR_LENGTH)
    }
    grade = grade + Math.min(...c_row)
  }
  score1 = score1 + grade
  n1 = n1 + 1
  return grade/sub_points.length
}

function mousePressed() {
  strokeWeight(5);
  stroke('red'); 

  point(mouseX, mouseY)
  usr_points.push([mouseX, mouseY])
}
function showScores(){
  if(n1 > 0){
    strokeWeight(0)
    text('Session Rel. Err. '+((score1/n1)*100).toFixed(1)+'%', 0, 30);
  }
}
