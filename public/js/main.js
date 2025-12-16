document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const btnPlay = document.getElementById("btnPlay");
  const btnShowLogin = document.getElementById("btnShowLogin");
  const btnBackMenu = document.getElementById("btnBackMenu");
  const btnBackMenu2 = document.getElementById("btnBackMenu2");

  const menuDiv = document.getElementById("menu");
  const loginDiv = document.getElementById("login");
  const gameDiv = document.getElementById("game");
  const adminDiv = document.getElementById("admin");

  const resultatDiv = document.getElementById("resultat");
  const contadorDiv = document.getElementById("contador");
  const tempsDiv = document.getElementById("temps-restant");
  const container = document.getElementById("respostes");
  const preguntaH2 = document.getElementById("pregunta");
  const imatgeImg = document.getElementById("imatge");
  const puntuacioSpan = document.getElementById("puntuacio");

  const btnLogin = document.getElementById("btnLogin");

  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.rol === "admin") {
        loginDiv.style.display = "none";
        adminDiv.style.display = "block";
      } else {
        document.getElementById("loginError").innerText =
          "Credencials incorrectes";
      }
    } catch (e) {
      (document.getElementById("loginError").innerText = "Error al fer login"),
        e;
    }
  });

  // ---- ADMIN CRUD ----
  const btnLoad = document.getElementById("btnLoad");
  const llistaPreguntesDiv = document.getElementById("llistaPreguntes");
  const btnAfegir = document.getElementById("btnAfegir");

  // Cargar todas las preguntas
  btnLoad.addEventListener("click", async () => {
    try {
      const res = await fetch("php/admin_list.php");
      const data = await res.json();

      llistaPreguntesDiv.innerHTML = "";
      data.forEach((p) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><b>${p.text}</b></p>
          <img src="${p.imatge || ""}" style="max-width:100px;">
          <ul>
            ${p.respostes
              .map(
                (r, i) =>
                  `<li>${i + 1}. ${r} ${i == p.correcta ? "(✔️)" : ""}</li>`
              )
              .join("")}
          </ul>
          <button class="btnEditar" data-id="${p.id}">Editar</button>
          <button class="btnEliminar" data-id="${p.id}">Eliminar</button>
        `;
        llistaPreguntesDiv.appendChild(div);
      });
    } catch (e) {
      (llistaPreguntesDiv.innerText = "Error carregant preguntes."), e;
    }
  });

  // Añadir nueva pregunta
  btnAfegir.addEventListener("click", async () => {
    const text = document.getElementById("novaPregunta").value;
    const imatge = document.getElementById("novaImg").value;
    const inputs = document.querySelectorAll("#novaRespostes input");
    const respostes = Array.from(inputs).map((i) => i.value);
    const correcta = document.getElementById("correctaIndex").value;

    try {
      const res = await fetch("php/admin_create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, imatge, respostes, correcta }),
      });
      const data = await res.json();
      alert(data.message || "Pregunta afegida!");
      btnLoad.click(); // recargar la lista
    } catch (e) {
      alert("Error afegint pregunta");
      console.log("ERROR:", e);
    }
  });

  // Delegación para Editar / Eliminar
  llistaPreguntesDiv.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btnEliminar")) {
      const id = e.target.dataset.id;
      if (!confirm("Segur que vols eliminar aquesta pregunta?")) return;

      try {
        const res = await fetch("php/admin_delete.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "id=" + id,
        });
        const data = await res.json();
        alert(data.message || "Eliminada!");
        btnLoad.click();
      } catch (e) {
        alert("Error eliminant");
        console.log("ERROR:", e);
      }
    }

    if (e.target.classList.contains("btnEditar")) {
      const id = e.target.dataset.id;
      const pregunta = await (
        await fetch("php/admin_list.php?id=" + id)
      ).json();
      document.getElementById("editId").value = pregunta.id;
      document.getElementById("editPreguta").value = pregunta.text;
      document.getElementById("editImg").value = pregunta.imatge;
      const editInputs = document.querySelectorAll("#editRespostes input");
      pregunta.respostes.forEach((r, i) => (editInputs[i].value = r));
      document.getElementById("editCorrectaIndex").value = pregunta.correcta;
      document.getElementById("editForm").style.display = "block";
    }
  });

  // Guardar edición
  document.getElementById("btnUpdate").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    const text = document.getElementById("editPreguta").value;
    const imatge = document.getElementById("editImg").value;
    const inputs = document.querySelectorAll("#editRespostes input");
    const respostes = Array.from(inputs).map((i) => i.value);
    const correcta = document.getElementById("editCorrectaIndex").value;

    try {
      const res = await fetch("php/admin_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text, imatge, respostes, correcta }),
      });
      const data = await res.json();
      alert(data.message || "Pregunta actualitzada!");
      document.getElementById("editForm").style.display = "none";
      btnLoad.click();
    } catch (e) {
      alert("Error actualitzant");
      console.log("ERROR:", e);
    }
  });

  document.getElementById("btnCancelarEdit").addEventListener("click", () => {
    document.getElementById("editForm").style.display = "none";
  });

  let tempsTotal = 30;
  let intervalID = null;
  let puntuacioActual = 0;
  let totalPreguntes = 0;

  // ---- MENÚ ----
  btnPlay.addEventListener("click", () => {
    menuDiv.style.display = "none";
    gameDiv.style.display = "block";
    tempsDiv.style.display = "block";
    contadorDiv.style.display = "block";
    reiniciarQuiz();
  });

  btnShowLogin.addEventListener("click", () => {
    menuDiv.style.display = "none";
    loginDiv.style.display = "block";
  });

  btnBackMenu.addEventListener("click", () => {
    gameDiv.style.display = "none";
    menuDiv.style.display = "block";
  });

  btnBackMenu2.addEventListener("click", () => {
    adminDiv.style.display = "none";
    menuDiv.style.display = "block";
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
    imatgeImg.src = data.imatge || "";
    container.innerHTML = "";
    data.respostes.forEach((r) => {
      const btn = document.createElement("button");
      btn.textContent = r.resposta;
      btn.dataset.id = r.id;
      container.appendChild(btn);
    });
    contadorDiv.textContent = `Pregunta ${data.indice + 1} de ${data.total}`;
    resultatDiv.textContent = "";
  }

  // ---- CARGAR PREGUNTA ----
  function cargarPregunta() {
    fetch("php/data.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          resultatDiv.textContent = data.error;
          container.innerHTML = "";
          return;
        }
        totalPreguntes = data.total;
        mostrarPregunta(data);
        if (!intervalID) iniciarTemporizador();
      })
      .catch(() => {
        resultatDiv.textContent = "Error carregant la pregunta.";
        container.innerHTML = "";
      });
  }

  // ---- ENVIAR RESPUESTA ----
  container.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
      const id = e.target.dataset.id;
      enviarResposta(id);
    }
  });

  function enviarResposta(id) {
    fetch("php/check_answer.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "resposta=" + encodeURIComponent(id),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          resultatDiv.textContent = data.error;
          return;
        }
        if (data.correcte) puntuacioActual++;
        puntuacioSpan.textContent = puntuacioActual;

        if (data.acabat) {
          clearInterval(intervalID);
          container.innerHTML = "";
          resultatDiv.innerHTML = `<p>Quiz acabat! Has encertat ${data.puntuacioActual} de ${totalPreguntes} preguntes.</p>
        <button id="btn-reiniciar">Tornar a jugar</button>`;
          document
            .getElementById("btn-reiniciar")
            .addEventListener("click", reiniciarQuiz);
        } else {
          mostrarPregunta(data);
          resultatDiv.textContent = data.correcte
            ? "Correcte! 🎉"
            : "Incorrecte 😞";
        }
      })
      .catch(() => {
        resultatDiv.textContent = "Error enviant la resposta.";
      });
  }

  // ---- REINICIAR QUIZ ----
  function reiniciarQuiz() {
    fetch("php/reset.php")
      .then(() => {
        puntuacioActual = 0;
        puntuacioSpan.textContent = "0";
        tempsTotal = 30;
        clearInterval(intervalID);
        intervalID = null;
        resultatDiv.textContent = "";
        cargarPregunta();
        iniciarTemporizador();
      })
      .catch(() => {
        resultatDiv.textContent = "Error al reiniciar el quiz.";
      });
  }

  function finalitzarPerTemps() {
    container.innerHTML = "";
    resultatDiv.innerHTML = `<p>Temps esgotat! ⏰ Has encertat ${puntuacioActual} de ${totalPreguntes} preguntes.</p>
    <button id="btn-reiniciar">Tornar a jugar</button>`;
    document
      .getElementById("btn-reiniciar")
      .addEventListener("click", reiniciarQuiz);
  }
});
