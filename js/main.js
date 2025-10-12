document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTS
  const btnPlay = document.getElementById('btnPlay');
  const btnShowLogin = document.getElementById('btnShowLogin');
  const btnBackMenu = document.getElementById('btnBackMenu');
  const btnBackMenu2 = document.getElementById('btnBackMenu2');
  
  const menuDiv = document.getElementById('menu');
  const loginDiv = document.getElementById('login');
  const gameDiv = document.getElementById('game');
  const adminDiv = document.getElementById('admin');

  const resultatDiv = document.getElementById('resultat');
  const contadorDiv = document.getElementById('contador');
  const tempsDiv = document.getElementById('temps-restant');
  const container = document.getElementById('respostes');
  const preguntaH2 = document.getElementById('pregunta');
  const imatgeImg = document.getElementById('imatge');
  const puntuacioSpan = document.getElementById('puntuacio');

  // logout del admin
  document.getElementById("btnLogout").addEventListener("click", async () => {
    try {
        const res = await fetch("php/logout.php", {
            method: "POST"
        });
        
        const data = await res.json();
        if (data.success) {
            adminDiv.style.display = "none";
            menuDiv.style.display = "block";
            
            // Limpiar formulario de edición
            const editForm = document.querySelector('.edit-form-container');
            if (editForm) editForm.remove();
            
            // LIMPIAR INPUTS DE LOGIN DIRECTAMENTE (sin formulario)
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("loginError").textContent = "";
        }
    } catch (e) {
        console.error("Error en logout:", e);
        adminDiv.style.display = "none";
        menuDiv.style.display = "block";
        
        // Limpiar inputs en caso de error también
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("loginError").textContent = "";
    }
  });

  const btnLogin = document.getElementById("btnLogin");
  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password })
      });
      const data = await res.json();

      if (data.success && data.rol === "admin") {
        loginDiv.style.display = "none";
        adminDiv.style.display = "block";
      } else {
        document.getElementById("loginError").innerText = "Credencials incorrectes";
      }
    } catch (e) {
      console.error("Error en login:", e);
      document.getElementById("loginError").innerText = "Error al fer login";
    }
  });
  
  // ---- ADMIN CRUD ----
  const btnLoad = document.getElementById("btnLoad");
  const llistaPreguntesDiv = document.getElementById("llistaPreguntes");
  const btnAfegir = document.getElementById("btnAfegir");
  // Variable para guardar las preguntas
  let preguntas = [];
  // Cargar todas las preguntas
  btnLoad.addEventListener("click", async () => {
    try {
      const res = await fetch("php/admin_list.php");
      const data = await res.json();

      preguntas = data;
      
      llistaPreguntesDiv.innerHTML = "";
      data.forEach(p => {
        const div = document.createElement("div");
            div.className = "card mb-3";

            div.innerHTML = `
              <div class="card-body">
                <h5 class="card-title">${p.text_pregunta} <small class="text-muted">(ID: ${p.id_pregunta})</small></h5>
                ${p.imatge ? `<img src="${p.imatge}" class="img-fluid rounded mb-2" style="max-height: 100px;">` : ""}
                <ul class="list-group list-group-flush mb-3">
                    ${p.respostes.map((r,i) => 
                        `<li class="list-group-item ${r.correcta ? 'list-group-item-success fw-bold' : ''}">
                        ${i+1}. ${r.text_resposta} ${r.correcta ? "✅" : ""}</li>`
                    ).join("")}
                </ul>
                <button class="btn btn-warning btn-sm btnEditar" data-id="${p.id_pregunta}">Editar</button>
                <button class="btn btn-danger btn-sm btnEliminar" data-id="${p.id_pregunta}">Eliminar</button>
                <hr>
                </div>
                
            `;
        llistaPreguntesDiv.appendChild(div);
      });

    } catch (e) {
      console.error("Error cargando preguntas:", e);
      llistaPreguntesDiv.innerText = "Error carregant preguntes.";
    }
  });

  // Añadir nueva pregunta
  btnAfegir.addEventListener("click", async () => {
    const text = document.getElementById("novaPregunta").value;
    const imatge = document.getElementById("novaImg").value;
    const inputs = document.querySelectorAll("#novaRespostes input");
    const respostes = Array.from(inputs).map(i => i.value);
    const correctaIndex = document.getElementById("correctaIndex").value;

    if (!text || respostes.some(r => !r)) {
        alert("Si us plau, omple tots els camps");
        return;
    } 
    try {
      const res = await fetch("php/admin_create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pregunta: text, imatge, respostes, correctaIndex: parseInt(correctaIndex) 
        })
      });
      const data = await res.json();
      if (data.success) {

        alert("Pregunta afegida correctament!");
        // Limpiar formulario
        document.getElementById("novaPregunta").value = "";
        document.getElementById("novaImg").value = "";
        inputs.forEach(input => input.value = "");
        document.getElementById("correctaIndex").value = "0";
        // Recargar lista
        btnLoad.click();
      } else {
        alert("Error: " + (data.error || "Error afegint pregunta"));
      }
    } catch (e) {
        console.error("Error:", e);
        alert("Error de connexió");
    }
  });

  // Delegación para Editar / Eliminar
  llistaPreguntesDiv.addEventListener("click", async e => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("btnEliminar")) {
      if (!confirm("Segur que vols eliminar aquesta pregunta?")) return;
      try {
        const res = await fetch("php/admin_delete.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({id: parseInt(id) })
        });
        const data = await res.json();
        
        if (data.success) {
              alert("Pregunta eliminada correctament!");
              btnLoad.click();
        } else {
              alert("Error: " + (data.error || "Error eliminant"));
        }
      } catch (e) {
          console.error("Error:", e);
          alert("Error de connexió");
      }
    }

    // Dentro del evento click de llistaPreguntesDiv
    if (e.target.classList.contains("btnEditar")) {
      const pregunta = preguntas.find(p => p.id_pregunta == id);
      if (!pregunta) {
        alert("No s'ha trobat la pregunta");
        return;
      }
      
      // Ocultar formulario de edición anterior si existe
      const existingEditForm = document.querySelector('.edit-form-container');
      if (existingEditForm) {
        existingEditForm.remove();
      }
      
      // Crear formulario de edición justo después del botón editar
      const editForm = document.createElement('div');
      editForm.className = 'edit-form-container';
      
      editForm.innerHTML = `
        <div class="card-header bg-primary text-white">
          <h5 class="card-title mb-0">
            <i class="bi bi-pencil-square"></i>Editant Pregunta #${pregunta.id_pregunta}
          </h5>
        </div>

        <div class="card-body">
          <input type="hidden" id="editId" value="${pregunta.id_pregunta}">
          <div class="mb-3">
            <label for="editPregunta" class="form-label fw-bold">Pregunta:</label>
            <input type="text" id="editPregunta" class="form-control form-control-lg" value="${pregunta.text_pregunta}" placeholder="Text de la pregunta">
          </div>

          <div class="mb-3">
            <label for="editImg" class="form-label fw-bold">Imatge (URL):</label>
            <input type="text" id="editImg" class="form-control" value="${pregunta.imatge || ''}" placeholder="URL de la Imatge"">
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Respostes:</label>
            <div class="col-md-6">
              ${pregunta.respostes.map((r, i) => `
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text">${i + 1}</span>
                    <input type="text" value="${r.text_resposta}"
                      class="form-control edit-resposta" 
                      placeholder="Resposta ${i + 1}"> 
                    <span class="input-group-text">
                      ${r.correcta ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        
          <div class="mb-3">
            <label for="editCorrectaIndex" class="form-label fw-bold">Resposta Correcta:</label>
            <select id="editCorrectaIndex" class="form-select">
              ${pregunta.respostes.map((r, i) => `
                <option value="${i}" ${r.correcta ? 'selected' : ''}>Opció ${i + 1}: ${r.text_resposta.substring(0,20)}...</option>
              `).join('')}
            </select>
          </div>
        
          <div class="d-flex gap-2 justify-content-end">
            <button id="btnUpdate" class="btn btn-success">
              <i class="bi bi-check-lg"></i> Guardar Canvis
            </button>
            <button id="btnCancelEdit" class="btn btn-secondary">
            <i class="bi bi-x-lg"></i> Cancel·lar</button>
          </div>
        </div>
        
      `;
      
      // Insertar el formulario después del elemento que contiene los botones
      e.target.closest('div').appendChild(editForm);
      
      // Event listeners para los nuevos botones
      editForm.querySelector('#btnUpdate').addEventListener('click', async () => {
        await guardarEdicion(pregunta.id_pregunta);
      });
      
      editForm.querySelector('#btnCancelEdit').addEventListener('click', () => {
        editForm.remove();
      });
    }
  });

  // Guardar edición
  async function guardarEdicion(id) {
    const editForm = document.querySelector('.edit-form-container');
    if (!editForm) return;
    
    const pregunta = editForm.querySelector('#editPregunta').value;
    const imatge = editForm.querySelector('#editImg').value;
    const inputs = editForm.querySelectorAll('.edit-resposta');
    const respostes = Array.from(inputs).map(i => i.value);
    const correctaIndex = parseInt(editForm.querySelector('#editCorrectaIndex').value);
    
    if (!pregunta || respostes.some(r => !r)) {
      alert("Si us plau, omple tots els camps");
      return;
    }
    
    try {
      const res = await fetch("php/admin_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: parseInt(id), 
          pregunta, 
          imatge, 
          respostes, 
          correctaIndex 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Pregunta actualitzada correctament!");
        editForm.remove();
        // Recargar la lista
        document.getElementById("btnLoad").click();
      } else {
        alert("Error: " + (data.message || "Error actualitzant la pregunta"));
      }
    } catch (e) {
      console.error("Error:", e);
      alert("Error de connexió");
    }
  }

  let tempsTotal = 30;
  let intervalID = null;
  let puntuacioActual = 0;
  let totalPreguntes = 0;

  // ---- MENÚ ----
  btnPlay.addEventListener('click', () => {
    menuDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    tempsDiv.style.display = 'block';
    contadorDiv.style.display = 'block';
    reiniciarQuiz();
  });

  btnShowLogin.addEventListener('click', () => {
    menuDiv.style.display = 'none';
    loginDiv.style.display = 'block';
  });

  btnBackMenu.addEventListener('click', () => {
    gameDiv.style.display = 'none';
    menuDiv.style.display = 'block';
  });

  btnBackMenu2.addEventListener('click', () => {
    adminDiv.style.display = 'none';
    menuDiv.style.display = 'block';
  });

  // ---- TEMPORIZADOR ----
  function iniciarTemporizador() {
    tempsDiv.textContent = `Temps restant: ${tempsTotal}s`;
    intervalID = setInterval(() => {
      tempsTotal--;
      tempsDiv.textContent = `Temps restant: ${tempsTotal}s`;
      if (tempsTotal <= 0) {
        clearInterval(intervalID);
        finalitzarPerTemps();
      }
    }, 1000);
  }

  // ---- MOSTRAR PREGUNTA ----
  function mostrarPregunta(data) {
    preguntaH2.textContent = data.pregunta;
    preguntaH2.className = "card-title mb-4";

    if (data.imatge && data.imatge.trim() !== '') {
        imatgeImg.src = data.imatge;
        imatgeImg.style.display = 'block';
        imatgeImg.className = "img-fluid rounded mb-4";
    } else {
        imatgeImg.style.display = 'none';
    }
    container.innerHTML = '';
    container.className = "row g-3 mb-4";

    data.respostes.forEach(r => {
      const col = document.createElement('div');
      col.className = 'col-md-6';
      col.innerHTML = `
        <button class = "btn btn-outline-primary w-100 answer-btn" data-id="${r.id}">
          ${r.resposta}
        </button>
      `;
      container.appendChild(col);
    });
    contadorDiv.textContent = `Pregunta ${data.indice + 1} de ${data.total}`;
    contadorDiv.className = "mb-0 fw-bold";
    contadorDiv.style.display = 'block';
    resultatDiv.textContent = '';
    resultatDiv.className = "alert alert-info mb-3";
  }

  // ---- CARGAR PREGUNTA ----
  function cargarPregunta() {
    fetch('php/data.php')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          resultatDiv.textContent = data.error;
          container.innerHTML = '';
          return;
        }
        totalPreguntes = data.total;
        mostrarPregunta(data);
        if (!intervalID) iniciarTemporizador();
      })
      .catch(() => {
        resultatDiv.textContent = 'Error carregant la pregunta.';
        container.innerHTML = '';
      });
  }

  // ---- ENVIAR RESPUESTA ----
  container.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      const id = e.target.dataset.id;
      enviarResposta(id);
    }
  });

  function enviarResposta(id) {
    fetch('php/check_answer.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'resposta=' + encodeURIComponent(id)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultatDiv.textContent = data.error;
        return;
      }
      if (data.correcte) puntuacioActual++;
      puntuacioSpan.textContent = puntuacioActual;

      if (data.acabat) {
    clearInterval(intervalID);
    // Limpiar interfaz del juego
    preguntaH2.textContent = '';
    preguntaH2.className = '';
    imatgeImg.src = '';
    imatgeImg.style.display = 'none';
    container.innerHTML = '';
    contadorDiv.style.display = 'none';
    tempsDiv.style.display = 'none';
    
    // Mostrar resultado final con botón bien estilizado
    resultatDiv.innerHTML = `
        <div class="text-center">
            <h3 class="text-success mb-4">🎉 Quiz Completat!</h3>
            <p class="fs-5 mb-2">Has encertat <span class="fw-bold text-success">${data.puntuacioActual}</span> de <span class="fw-bold">${totalPreguntes}</span> preguntes</p><br>
            <button id="btn-reiniciar" class="btn btn-primary btn-lg px-5">Tornar a jugar</button>
        </div>
    `;
    document.getElementById('btn-reiniciar').addEventListener('click', reiniciarQuiz);
    } else {
        mostrarPregunta(data);
        resultatDiv.textContent = data.correcte ? 'Correcte! 🎉' : 'Incorrecte 😞';
      }
    })
    .catch(() => {
      resultatDiv.textContent = 'Error enviant la resposta.';
    });
  }

  // ---- REINICIAR QUIZ ----
  function reiniciarQuiz() {
    fetch('php/reset.php')
      .then(() => {
        puntuacioActual = 0;
        puntuacioSpan.textContent = '0';
        tempsTotal = 30;
        clearInterval(intervalID);
        intervalID = null;
        resultatDiv.textContent = '';
        cargarPregunta();
        iniciarTemporizador();
      })
      .catch(() => {
        resultatDiv.textContent = 'Error al reiniciar el quiz.';
      });
  }

  function finalitzarPerTemps() {
    // Limpiar completamente la interfaz del juego
    preguntaH2.textContent = '';
    preguntaH2.className = '';
    imatgeImg.src = '';
    imatgeImg.style.display = 'none';
    container.innerHTML = '';
    contadorDiv.style.display = 'none';
    tempsDiv.style.display = 'none';
    
    // Mostrar solo el resultado final con botón bien estilizado
    resultatDiv.innerHTML = `
        <div class="text-center">
            <h3 class="text-warning mb-4">⏰ Temps esgotat!</h3>
            <p class="fs-5 mb-2">Has encertat <span class="fw-bold text-success">${puntuacioActual}</span> de <span class="fw-bold">${totalPreguntes}</span> preguntes</p>
            <button id="btn-reiniciar" class="btn btn-primary btn-lg px-5">Tornar a jugar</button>
        </div>
    `;
    
    document.getElementById('btn-reiniciar').addEventListener('click', reiniciarQuiz);
  }

});

