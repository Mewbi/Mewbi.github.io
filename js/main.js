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
        text = "> Mewbi";
    }

    swal({
        title: title,
        text: text,
        button: "x"
    });
}

function setBlinkCursor(elem) {
  let tag = document.createElement("span");
  tag.innerHTML = ' ▉';
  tag.classList.add('blink');

  elem.appendChild(tag);
}

function getElemId(elem) {
  if (elem.id.length > 0) {
    return elem.id;
  }

  const id = CryptoJS.MD5(elem.innerText);
  elem.id = id;
  return id;
}

function show(type){
  const allTypes = document.allTypes; 

  for (let i = 0; i < allTypes.length; i++) {
    if (allTypes[i] != type) {
      const c = document.getElementById(allTypes[i]);
      if (!(c.classList.contains("hidden"))){
        c.classList.add("hidden");
        
        const elem = document.getElementById(`opt-${allTypes[i]}`);
        let text = elem.textContent.replace('_', '>').replace(' ▉', '');
        elem.innerText = text;
      }
    }else {
      document.showPosition = i;
    }
  }

  const path = document.getElementById('path');
  const content = document.getElementById(type);
  
  // Show content
  if (content.classList.contains("hidden")){
    content.classList.remove("hidden");
    path.innerHTML = "<a href=\"/home.html\">/home</a>/felipe/" + type;

    const c = document.getElementById(`opt-${type}`);
    let text = c.textContent.replace('>', '_');
    c.innerText = text;
    setBlinkCursor(c);

    typewriterAnimation(content);

  // Hide content
  }else {
    content.classList.add("hidden");
    path.innerHTML = "<a href=\"/home.html\">/home</a>/felipe";

    const c = document.getElementById(`opt-${type}`);
    let text = c.textContent.replace('_', '>').replace(' ▉', '');
    c.innerText = text;
  }
}

function readTextFile(file) {
  let rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4)  {
      if(rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
       }
    }
  }
  rawFile.send(null);
  return allText;
}

function insertTextInElement(elem, text) {
  let content = text.split('\n');
  let html = ""
  content.forEach(line => {
    if ( line.length === 0) {
      html += `<br>`;
      return;
    }

    html += `<p>&emsp;${line}</p>`
  })
  elem.innerHTML = html
}

function createProjectElement(data) {
  const elem = document.createElement("div");
  elem.classList.add("flex", "flex-row");

  const divText = document.createElement("div");
  divText.classList.add("flex", "flex-col", "my-auto", "pl-3", "w-full");

  const aText = document.createElement("a");
  aText.classList.add("pb-2");
  aText.target = "_blank";
  aText.href = data.url;
  aText.innerHTML = `> ${data.name} <i class="fab fa-github"></i>`

  const pText = document.createElement("p");
  pText.innerHTML = `&emsp;&emsp;${data.description}`;

  divText.appendChild(aText);
  divText.appendChild(pText);

  const divImage = document.createElement("div");
  divImage.classList.add("flex", "flex-col", "my-auto", "p-3", "w-1/3");

  const img = document.createElement("img");
  img.src = data.image;

  divImage.appendChild(img);
  elem.appendChild(divText);
  elem.appendChild(divImage)

  return elem;
}

function populateProjects(elem, data) {
  const obj = JSON.parse(data);
  obj.projects.forEach(project => {
    const c = createProjectElement(project);
    elem.appendChild(c);
  });
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function copyCommand() {
  const c = document.getElementById('cli-command');
  const text = c.textContent.trim().replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g,'');
  copyTextToClipboard(text);
}

function setupTypewriter(t) {
  const HTML = t.innerHTML;
  t.innerHTML = "";

  let cursorPosition = 0,
      tag = "",
      writingTag = false,
      tagOpen = false,
      typeSpeed = 10,
      tempTypeSpeed = 0;

  const type = function() {

    if (writingTag === true) {
      tag += HTML[cursorPosition];
    }

    if (HTML[cursorPosition] === "<") {
      tempTypeSpeed = 0;
      if (tagOpen) {
        tagOpen = false;
        writingTag = true;
      } else {
        tag = "";
        tagOpen = true;
        writingTag = true;
        tag += HTML[cursorPosition];
      }
    }
    if (!writingTag && tagOpen) {
      tag.innerHTML += HTML[cursorPosition];
    }
    if (!writingTag && !tagOpen) {
      if (HTML[cursorPosition] === " ") {
        tempTypeSpeed = 0;
      }
      else {
        tempTypeSpeed = (Math.random() * typeSpeed) + 20;
      }
      t.innerHTML += HTML[cursorPosition];
    }
    if (writingTag === true && HTML[cursorPosition] === ">") {
      tempTypeSpeed = (Math.random() * typeSpeed) + 20;
      writingTag = false;
      if (tagOpen) {
        var newSpan = document.createElement("span");
        t.appendChild(newSpan);
        newSpan.innerHTML = tag;
        tag = newSpan.firstChild;
      }
    }

    cursorPosition += 1;
    if (cursorPosition < HTML.length) {
      setTimeout(type, tempTypeSpeed);
    }
  };

  return {
      type: type
  };
}

function typewriterAnimation(elem) {
  elem.childNodes.forEach(node => {
    if (node.childNodes.length > 0) {
      typewriterAnimation(node);
    }
    if (node.nodeName === "P") {
      const id = getElemId(node);
      if (document.typewriterAnimation === undefined) {
        document.typewriterAnimation = {};
      }

      if (document.typewriterAnimation[id] !== true) {
        let initDelay = Math.random() * 1000;
        document.typewriterAnimation[id] = true;
        let typewriter = setupTypewriter(node);
        setTimeout(function name() {
          typewriter.type();
        }, initDelay)
      }
    }
  })
}

function moveCursor(key) {
  let down = false;
  let up = false;

  key = key.toLowerCase()

  switch (key) {
    case 'arrowdown' :
    case 'j':
    case 's':
      down = true;
      break;

    case 'arrowup':
    case 'k':
    case 'w':
      up = true;
      break;

    default:
      return;
  }

  let position = document.showPosition;
  let types =  document.allTypes;
  if (position === undefined) {
    position = 0;
  }else if (down) {
    position -= 1;
  }else if (up) {
    position += 1;
  }

  if (position < 0 || position > types.length - 1) {
    return;
  }

  show(types[position]);
}

document.addEventListener('DOMContentLoaded', function() {
 document.allTypes = ['projects', 'about-me', 'cli'];

  // Populate about me content
  const elemAbout = document.getElementById('about-me');
  let content = readTextFile('/text/about.txt');
  const dateBirth = new Date("11/01/2001"); 
  const dateNow   = new Date(); 
  const yearsOld  = Math.floor( (dateNow - dateBirth) / (1000 * 3600 * 24 * 365) );
  content = content.replace('$idade', yearsOld);
  insertTextInElement(elemAbout, content)

  // Populate about me content
  const elemProjects = document.getElementById('projects');
  content = readTextFile('/text/projects.json');
  populateProjects(elemProjects, content);

  // Show CLI mode
  const delayMillisec = 1000;
  setTimeout(function() {
    const elem = document.getElementById('cli');
    if (elem.classList.contains("hidden")){
      show('cli');
    }
  }, delayMillisec);

  // Vim Navegation
  document.addEventListener('keyup', function(event) {
    const key = event.key;
    moveCursor(key);
  });
}, false);

