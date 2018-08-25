document.querySelector('body');

const div$0$0 = document.createElement('div')
div$0$0.classList.add('fixed-action-btn')
document.body.appendChild(div$0$0)

const a$1$0 = document.createElement('a')
a$1$0.classList.add('btn-floating', 'btn-large', 'red', 'pulse')
div$0$0.appendChild(a$1$0)

const i$2$0 = document.createElement('i')
i$2$0.classList.add('large', 'material-icons')
a$1$0.appendChild(i$2$0)

i$2$0.appendChild(document.createTextNode('mode_edit'))

const ul$1$1 = document.createElement('ul')
div$0$0.appendChild(ul$1$1)

const li$2$0 = document.createElement('li')
ul$1$1.appendChild(li$2$0)

const a$23$0 = document.createElement('a')
a$23$0.classList.add('btn-floating', 'red')
li$2$0.appendChild(a$23$0)

const i$42$0 = document.createElement('i')
i$42$0.classList.add('material-icons')
a$23$0.appendChild(i$42$0)

i$42$0.appendChild(document.createTextNode('insert_chart'))

const li$2$1 = document.createElement('li')
ul$1$1.appendChild(li$2$1)

const a$3$10 = document.createElement('a')
a$3$10.classList.add('btn-floating', 'yellow', 'darken-1')
li$2$1.appendChild(a$3$10)

const i$4$0 = document.createElement('i')
i$4$0.classList.add('material-icons')
a$3$10.appendChild(i$4$0)

i$4$0.appendChild(document.createTextNode('format_quote'))

const li$2$2 = document.createElement('li')
ul$1$1.appendChild(li$2$2)

const a$3$20 = document.createElement('a')
a$3$20.classList.add('btn-floating', 'green')
li$2$2.appendChild(a$3$20)

const i$41$0 = document.createElement('i')
i$41$0.classList.add('material-icons')
a$3$20.appendChild(i$41$0)

i$41$0.appendChild(document.createTextNode('publish'))

const li$2$3 = document.createElement('li')
ul$1$1.appendChild(li$2$3)

const a$3$0 = document.createElement('a')
a$3$0.classList.add('btn-floating', 'blue')
li$2$3.appendChild(a$3$0)

const i$47$0 = document.createElement('i')
i$47$0.classList.add('material-icons')
a$3$0.appendChild(i$47$0)
i$47$0.appendChild(document.createTextNode('attach_file'))

// init
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var options = {
    direction: 'left',
    hoverEnabled: true
  };

  var instances = M.FloatingActionButton.init(elems, options);
});
