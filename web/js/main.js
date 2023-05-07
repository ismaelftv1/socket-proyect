let socket = io();

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let imagen1 = document.getElementById('img1');
let imagen2 = document.getElementById('img2');
let nombre1 = document.getElementById('nombre1');
let nombre2 = document.getElementById('nombre2');
let votar1 = document.getElementById('votar1');
let votar2 = document.getElementById('votar2');


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});


votar1.addEventListener('click', function () {
    votar1.classList.replace("btn-primary","btn-secondary")
    votar2.classList.replace("btn-primary","btn-secondary")
})

votar2.addEventListener('click', function () {
    votar1.classList.replace("btn-primary","btn-secondary")
    votar2.classList.replace("btn-primary","btn-secondary")
})

socket.emit('this movies');

socket.on('chat message', Escribirchat);

socket.on('voted', noty);

socket.on('new user', noty)

socket.on('newmovie', NewMovie)

socket.on('Ronda actual', NewMovie);

socket.on('Ganador', openModal)

socket.on('timer', countdown)

socket.on('alert', noty)

function Escribirchat(msg) {
    let item = document.createElement('li');
    item.style.setProperty = "list-group-item";
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

function Votar(votacion) {
    socket.emit('voting', votacion);

    votar1.disabled = true;
    votar2.disabled = true;
}

function NewMovie(peli1, peli2) {
    imagen1.src = peli1.src;
    nombre1.innerHTML = peli1.nombre;

    imagen2.src = peli2.src;
    nombre2.innerHTML = peli2.nombre;

    votar1.disabled = false;
    votar2.disabled = false;

    votar1.classList.replace("btn-secondary","btn-primary")
    votar2.classList.replace("btn-secondary","btn-primary")

}

function noty(option,data) {

    switch (option) {
        case 1:
            beautyToast.success({
                title: `haz votado por ${data}`,
                message: '',
                darkTheme: true,
                timeout: 3000
            });
            break;
        case 2:
            beautyToast.info({
                title: `${data} se a unido`,
                message: '',
                darkTheme: true,
                timeout: 2000
            });
            
            break;
        case 3:
            beautyToast.warning({
                title: `La palabra ${data} no esta permitida`,
                message: '',
                darkTheme: true,
                timeout: 2000
            });
            
            break;
    
    }
}

var modal = document.getElementById('ganador');

username();

function username() {
    let popup = document.getElementById('popup');

    popup.innerHTML += `        <div id="ganador" class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">¿Cual es tu nombre?</h5>
            </div>
            <form action="" id="username">
                <div class="modal-body">
                    <div class="input-group flex-nowrap">
                        <span class="input-group-text" id="addon-wrapping">@</span>
                        <input type="text" id="userinput" class="form-control" placeholder="Username" aria-label="Username"
                            aria-describedby="addon-wrapping">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Enviar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal-backdrop fade show" id="backdrop" style="display: none;"></div>`

let modal = document.getElementById("ganador");
let userinput = document.getElementById("userinput");
let usernameform = document.getElementById("username");

document.getElementById("backdrop").style.display = "block";
modal.style.display = "block";
modal.classList.add("show");



usernameform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (userinput.value) {
        socket.emit('username', userinput.value);
        closeModal();
    }
});


}

function openModal(peli,users) {
    let popup = document.getElementById('popup');

    popup.innerHTML += `    <div id="ganador" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <div class="text-center">
                <h5 class="modal-title">Ganador</h5>
            </div>
          <button type="button" class="btn-close" onclick="closeModal()" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="text-center">
                <img src="${peli.src}" alt="">
            </div>
            <h3>${peli.nombre}</h3>
          <p>${users}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" id="backdrop" style="display: none;"></div>`

    let modal = document.getElementById("ganador");

    document.getElementById("backdrop").style.display = "block";
    modal.style.display = "block";
    modal.classList.add("show");
}

function closeModal() {
    let popup = document.getElementById('popup');
    let modal = document.getElementById("ganador");

    document.getElementById("backdrop").style.display = "none";
    modal.style.display = "none";
    modal.classList.remove("show");

    popup.innerHTML= '';
}

window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }

function countdown(timer) {
    let tiempo = document.getElementById('tiempo');

    tiempo.innerText = timer;
};