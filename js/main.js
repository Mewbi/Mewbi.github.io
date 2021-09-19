const canvas = document.createElement('canvas');
canvas.classList.add('fixed');
canvas.classList.add('z-0');
document.getElementsByTagName('body')[0].prepend(canvas);
const ctx = canvas.getContext('2d');

const w = canvas.width = document.body.offsetWidth;
const h = canvas.height = document.body.offsetHeight;
const cols = Math.floor(w / 20) + 1;
const ypos = Array(cols).fill(0);

ctx.fillStyle = '#f9fafb';
ctx.fillRect(0, 0, w, h);

function matrix () {
  ctx.fillStyle = '#f9fafb14';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = '#e1e1e1';
  ctx.font = '15pt monospace';
  
  ypos.forEach((y, ind) => {
    const text = String.fromCharCode(Math.random() * 128);
    const x = ind * 20;
    ctx.fillText(text, x, y);
    if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
    else ypos[ind] = y + 20;
  });
}

setInterval(matrix, 65);

function contact(type){
    var text, title;
    if (type === "mail") {
        title = "/home/felipe/e-mail"
        text = "> felipefernandesgsc@gmail.com";
    }else if (type === "discord") {
        title = "/home/felipe/discord"
        text = "> Mewbi#5028";
    }

    swal({
        title: title,
        text: text,
        button: "x"
    });
}

function show(type){
    var all_type = ['projetos', 'sobre-mim']; 

    for (let i = 0; i < all_type.length; i++) {
        if (all_type[i] != type) {
            var c = document.getElementById(all_type[i]);
            if (!(c.classList.contains("hidden"))){
                c.classList.add("hidden");
            }
        }
    }

    var path = document.getElementById('path');
    var content = document.getElementById(type);
    
    if (content.classList.contains("hidden")){
        content.classList.remove("hidden");
        path.innerHTML = "<a href=\"/home.html\">/home</a>/felipe/" + type;
    }else {
        content.classList.add("hidden");
        path.innerHTML = "<a href=\"/home.html\">/home</a>/felipe";
    }
}