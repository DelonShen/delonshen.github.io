var cnv;
var w, h, px, py, qx, qy, n_div, ang, ax, ay;
var divs;
var sub_points;
var usr_points;
var curr_ratio;
var dmat;
var d,dp;
var col, c_value;

function reduce(number,denomin){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(number,denomin);
  return [number/gcd, denomin/gcd];
}


tmp_all = [1, 2, 3, 4, 5]//, 6, 7, 8, 9, 10]
possible_all = new Set()
for(let i = 0; i<tmp_all.length; i++){
  for(let j=1; j<=2*tmp_all[i]; j++){
    tmp = reduce(j, tmp_all[i])
    possible_all.add(tmp[0]+'/'+tmp[1])
  }
}

possible_all = Array.from(possible_all)
possible_all_num = possible_all.map(eval)

const dsu = (arr1, arr2) => arr1
  .map((item, index) => [arr2[index], item]) // add the args to sort by
  .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
  .map(([, item]) => item); // extract the sorted items
  
  
possible_all = dsu(possible_all, possible_all_num).reverse()

var comp_inp = document.getElementById('comp_in'),
comp_oup = document.getElementById('comp_out');
comp_inp.oninput = function(){
    comp_oup.innerHTML = possible_all[this.value];
};
comp_inp.oninput();

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]).reduce(compareFn)[1]

const argMax = argFact((min, el) => (el[0] > min[0] ? el : min))
const argMin = argFact((max, el) => (el[0] < max[0] ? el : max))

var score1=0, n1=0;
var score2=0, n2=0;
var score3=0, n3=0;
var score4=0, n4=0;

//r, g, b \in [0,255]
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

//h, s, v \in [0,1]
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

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
  w = windowWidth/1.1
  h = windowHeight/1.3
  cnv = createCanvas(w, h);
  cnv.parent('canvas');
  cnv.position((windowWidth - w) / 2);

  textSize(18)
  strokeJoin(ROUND);

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
  n_div = random(divs)

}
function draw() {
  background(150)

  reseed()
}

function draw1() {


  clear()
  background(150)

  fill(0)

  showScores()

  strokeWeight(0);
  textAlign(CENTER);
  text('Divide into '+n_div, w/2, 15);

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
  stroke(255)
  strokeWeight(4)

  text('Rel. Err. '+(grade1()*10).toFixed(1), 0, 15);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function draw2(){
  clear()
  background(150)

  fill(0)

  textAlign(CENTER);
  strokeWeight(0)
  text('What is (Length of Red)/(Length of Black)', w/2, 15);

  d = dist(px,py,qx,qy)


  showScores()

  possible_ratios = new Set()
  for(let i = 0; i<divs.length; i++){
    for(let j=1; j<=2*divs[i]; j++){
      tmp = reduce(j, divs[i])
      possible_ratios.add(tmp[0]+'/'+tmp[1])
    }
  }

  possible_ratios = Array.from(possible_ratios)

  console.log(possible_ratios)

  curr_ratio = random(possible_ratios).split('/')

  console.log(curr_ratio)

  
  dp = d*curr_ratio[0]/curr_ratio[1]


  ax = w/2*(1+getRandomArbitrary(-0.7,0.7)/1.1)
  ay = h/2*(1+getRandomArbitrary(-0.7,0.7)/1.1)
  ang = 2*Math.PI*Math.random()
  dx = dp*Math.cos(ang)
  dy = dp*Math.sin(ang)
  
  kl = 0 
  while(kl<10 && (ax+dx > w || ax+dx < 0 || ay+dy > h || ay + dy < 0)){  
    ang = 2*Math.PI*Math.random()
    dx = dp*Math.cos(ang)
    dy = dp*Math.sin(ang)
    kl = kl + 1
  }
  if(kl == 10){
    reseed()
    draw2()
  }
  else{
    stroke(0)
    strokeWeight(2);
    line(px,py,qx,qy)
    stroke('red')
    strokeWeight(2);
    line(ax,ay,ax+dx,ay+dy)
  }

}
function showAnswer2(){
  c_ans = possible_all[document.getElementById("comp_in").value].split('/')
  console.log(c_ans)
  strokeWeight(0)
  if(c_ans[0] == curr_ratio[0] && c_ans[1]==curr_ratio[1]){
    stroke(255)
    strokeWeight(4)

    textAlign(LEFT)
    text('Correct!', 0, 15);
    score2 = score2+1
  }
  else{
    stroke(255)
    strokeWeight(4)

    textAlign(LEFT)
    text('Incorrect. Actually '+curr_ratio[0]+'/'+curr_ratio[1], 0, 15);
  }
  n2 = n2+1
}

function grade1(){
  grade = 0
  for(let i = 0; i<sub_points.length; i++){
    c_row = []
    for(let j =0; j<usr_points.length; j++){
      c_row.push(dist(sub_points[i][0], sub_points[i][1], usr_points[j][0], usr_points[j][1]))
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
  background(150)

  fill(0)


  textAlign(CENTER);
  strokeWeight(0)
  text('Draw the RED point whose resulting line recreates the angle shown', w/2, 15);

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
  stroke(255)
  strokeWeight(4)

  textAlign(LEFT)
  grd = grade3()
  stroke(255)
  strokeWeight(4)

  text('Angle Err. '+(grd).toFixed(1)+'°',0, 15);
}

function draw4() {
  clear()
  fill(0)
  chk = document.getElementById("gray");

  if(chk.checked){
    background(random(255))
  }
  else{
    background(random(255), random(255),random(255))
  }

  strokeWeight(0)
  col = {"h": Math.random(), "s": Math.random(), "v": Math.random()}
  c_value = col["v"]


  if(chk.checked){
    col["s"] = 0
  }

  col = HSVtoRGB(col)

  fill(col["r"], col["g"], col["b"]);
  sze = Math.min(w,h)
  hM = (h-sze)/2
  wM = (w-sze)/2
  square(wM,hM,sze)
  fill(0)
  textAlign(CENTER)
  stroke(255)
  strokeWeight(4)
  text('What is the value? (0->100, Black->White)', w/2, 15);

  showScores()
}

function showAnswer4() {
  c_ans = document.getElementById("answer4_0").value
  score = Math.abs(c_ans-c_value*100)
  fill(0)
  strokeWeight(0)
  stroke(255)
  strokeWeight(4)

  textAlign(LEFT)
  text('Value Err. '+score.toFixed(1), 0, 15)
  fill(0)
  textAlign(RIGHT)
  text('Actual Value '+(c_value*100).toFixed(1), w, 15)

  score4 = score4+score
  n4 = n4+1
}
function showScores(){
  if(n1 > 0){
    stroke(255)
    strokeWeight(4)

    textAlign(LEFT)
    text('Session Subdivide Rel. Err. '+((score1/n1)*10).toFixed(1), 0, 30);
  }
  if(n2 > 0){
    stroke(255)
    strokeWeight(4)
    textAlign(LEFT);
    text('Session Rel. Length Score '+((score2/n2)*100).toFixed(1)+'%', 0, 45);

  }
  if(n3 > 0){
    stroke(255)
    strokeWeight(4)
    textAlign(LEFT)
    text('Session Angle Err. '+((score3/n3)).toFixed(1)+'°', 0, 60);
  }
  if(n4 > 0){
    stroke(255)
    strokeWeight(4)
    textAlign(LEFT)
    text('Session Value Err. '+((score4/n4)).toFixed(1), 0, 75);
  }

}

