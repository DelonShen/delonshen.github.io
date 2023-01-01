var cnv;
var w, h, px, py, qx, qy, n_div, ang, ax, ay;
var divs;
var sub_points;
var usr_points;
var curr_ratio;
var dmat;
var d,dp;
var CHAR_LENGTH;


const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]).reduce(compareFn)[1]

const argMax = argFact((min, el) => (el[0] > min[0] ? el : min))
const argMin = argFact((max, el) => (el[0] < max[0] ? el : max))

var score1=0, n1=0;
var score2=0, n2=0;
var score3=0, n3=0;


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
function reseed(){
  px = w/2*(1+getRandomArbitrary(-1,1)/1.1)
  py = h/2*(1+getRandomArbitrary(-1,1)/1.1)
  qx = w/2*(1+getRandomArbitrary(-1,1)/1.1)
  qy = h/2*(1+getRandomArbitrary(-1,1)/1.1)
  ax = w/2*(1+getRandomArbitrary(-1,1)/1.1)
  ay = h/2*(1+getRandomArbitrary(-1,1)/1.1)

  divs = getCheckedCheckboxesFor('frac')
  n_div = divs[Math.floor(Math.random()*divs.length)];

}
function draw() {
  reseed()
}

function draw1() {
  clear()

  showScores()

  strokeWeight(0);
  textAlign(CENTER);
  text('Divide into '+n_div, w/2, 10);

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
  textAlign(LEFT)
  text('Rel. Err. '+(grade1()*100).toFixed(1)+'%', 0, 10);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function reduce(number,denomin){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(number,denomin);
  return [number/gcd, denomin/gcd];
}
function draw2(){
  clear()
  textAlign(CENTER);
  strokeWeight(0)
  text('What is (Length of Red)/(Length of Black)', w/2, 10);

  d = dist(px,py,qx,qy)


  showScores()

  possible_ratios = new Set()
  for(let i = 0; i<divs.length; i++){
    for(let j=1; j<=divs[i]; j++){
      tmp = reduce(j, divs[i])
      possible_ratios.add(tmp[0]+'/'+tmp[1])
    }
  }

  possible_ratios = Array.from(possible_ratios)

  curr_ratio = possible_ratios[Math.floor(Math.random()*possible_ratios.length)].split('/')
  console.log(curr_ratio)

  dp = d*curr_ratio[0]/curr_ratio[1]


  ax = w/2*(1+getRandomArbitrary(-1,1)/1.1)
  ay = h/2*(1+getRandomArbitrary(-1,1)/1.1)
  ang = 2*Math.PI*Math.random()
  dx = dp*Math.cos(ang)
  dy = dp*Math.sin(ang)
  while(ax+dx > w || ax+dx < 0 || ay+dy > h || ay + dy < 0){
    ang = 2*Math.PI*Math.random()
    dx = dp*Math.cos(ang)
    dy = dp*Math.sin(ang)
  }
  console.log(dx, dy, dp, ang)

  stroke(0)
  strokeWeight(2);
  line(px,py,qx,qy)
  stroke('red')
  strokeWeight(2);
  line(ax,ay,ax+dx,ay+dy)

}
function showAnswer2(){
  c_ans = [document.getElementById("answer2_0").value, document.getElementById("answer2_1").value]
  strokeWeight(0)
  if(c_ans[0] == curr_ratio[0] && c_ans[1]==curr_ratio[1]){
    textAlign(LEFT)
    text('Correct!', 0, 10);
    score2 = score2+1
  }
  else{
    textAlign(LEFT)
    text('Incorrect. Actually '+curr_ratio[0]+'/'+curr_ratio[1], 0, 10);
  }
  n2 = n2+1
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

function draw3() {
  clear()

  textAlign(CENTER);
  strokeWeight(0)
  text('Draw the point whose resulting line recreates the angle shown', w/2, 10);

  usr_points = []

  showScores()

  strokeWeight(0);

  usr_points = [[ax, ay]]
  stroke(0)
  strokeWeight(2);
  line(px,py,qx,qy)

  push() 
  offset=16
  translate(qx,qy); 
  rotate(atan2(py-qy, px-qx)-HALF_PI); 
  triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); 
  pop();

  strokeWeight(5);
  stroke('red'); 

  point(ax, ay)

  ang = angle(px, py, qx, qy)
  dx = px-qx
  dy = py-qy
  d = dist(px,py,qx,qy)

}

function grade3() {
  ax = usr_points[0][0]
  ay = usr_points[0][1]
  bx = usr_points[1][0]
  by = usr_points[1][1]


  c_ang = [angle(ax,ay,bx,by), angle(ax,ay,bx,by)+Math.Pi]
  d_ang = [Math.abs(c_ang[0]-ang), Math.abs(c_ang[1]-ang)]
  idx_ang = argMin(d_ang)

  c_ang = c_ang[idx_ang]



  stroke('black')
  strokeWeight(2)

  da = dist(ax,ay,bx,by)

  cx = [ax+Math.cos(ang)*da, ax+Math.cos(ang+Math.Pi)*da]
  cy = [ay+Math.sin(ang)*da, ay+Math.sin(ang+Math.Pi)*da]

  dcb = [dist(cx[0],cy[0],bx,by), dist(cx[1],cy[1],bx,by)]

  idx = argMin(dcb)

  line(ax,ay, cx[idx], cy[idx])

  stroke('red')
  strokeWeight(1)
  line(ax,ay, bx,by)



  grade = Math.abs(c_ang - ang)*180/Math.PI
  score3 = score3 + grade
  n3 = n3 + 1

  return grade
}
function showAnswer3() {
  strokeWeight(0)
  textAlign(LEFT)
  grd = grade3()
  strokeWeight(0)
  text('Angle Err. '+(grd).toFixed(1)+'°',0, 10);
}

function showScores(){
  if(n1 > 0){
    strokeWeight(0)
    textAlign(LEFT)
    text('Session Subdivide Rel. Err. '+((score1/n1)*100).toFixed(1)+'%', 0, 30);
  }
  if(n2 > 0){
    strokeWeight(0)
    textAlign(LEFT);
    text('Session Rel. Length Score '+((score2/n2)*100).toFixed(1)+'%', 0, 40);

  }
  if(n3 > 0){
    strokeWeight(0)
    textAlign(LEFT)
    text('Session Angle Err. '+((score3/n3)).toFixed(1)+'°', 0, 50);
  }

}
