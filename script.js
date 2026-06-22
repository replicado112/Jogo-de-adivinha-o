const dificuldades = {

    facil: {
        maxNumero: 50,
        maxTentativas: 8
    },

    medio: {
        maxNumero: 100,
        maxTentativas: 10
    },

    dificil: {
        maxNumero: 500,
        maxTentativas: 15
    }

};

let dificuldadeAtual = localStorage.getItem("dificuldade") || "medio";

let maxNumero = dificuldades[dificuldadeAtual].maxNumero;

let maxTentativas = dificuldades[dificuldadeAtual].maxTentativas;

let numeroSecreto;

let acertos = parseInt(localStorage.getItem("acertos")) || 0;

let tentativas = 0;

let menor = 1;

let maior = maxNumero;

let segundos = parseInt(localStorage.getItem("tempo")) || 0;

let recorde = parseInt(localStorage.getItem("recorde")) || 0;

document.getElementById("dificuldade").value = dificuldadeAtual;

function gerarNumero() {

    return Math.floor(Math.random() * maxNumero) + 1;

}

function atualizarTela() {

    document.getElementById("descricao").innerText =
        `Escolha um número entre 1 e ${maxNumero}`;

    document.getElementById("textoProgresso").innerText =
        `${acertos} / 5 acertos`;

    document.getElementById("progresso").style.width =
        (acertos * 20) + "%";

    document.getElementById("intervalo").innerText =
        `🔍 Entre ${menor} e ${maior}`;

    document.getElementById("recorde").innerText =
        `🏆 Recorde: ${recorde}`;

    document.getElementById("cronometro").innerText =
        `⏱️ ${formatarTempo(segundos)}`;

    let vidas = "";

    for (let i = 0; i < (maxTentativas - tentativas); i++) {

        vidas += "❤️ ";

    }

    document.getElementById("vidas").innerHTML = vidas;

}

function mostrar(texto) {

    document.getElementById("mensagem").innerHTML = texto;

}

function formatarTempo(segundos) {

    let min = Math.floor(segundos / 60);

    let seg = segundos % 60;

    return String(min).padStart(2, "0") +

        ":" +

        String(seg).padStart(2, "0");

}

setInterval(() => {

    segundos++;

    localStorage.setItem("tempo", segundos);

    atualizarTela();

}, 1000);

function tocarSom(frequencia) {

    const audio = new AudioContext();

    const oscilador = audio.createOscillator();

    oscilador.type = "sine";

    oscilador.frequency.value = frequencia;

    oscilador.connect(audio.destination);

    oscilador.start();

    setTimeout(() => {

        oscilador.stop();

        audio.close();

    }, 150);

}

function criarConfete() {

    for (let i = 0; i < 40; i++) {

        let emoji = document.createElement("div");

        emoji.className = "confete";

        emoji.innerHTML = "🎉";

        emoji.style.left = Math.random() * 100 + "vw";

        emoji.style.animationDuration =
            (Math.random() * 2 + 1) + "s";

        document.body.appendChild(emoji);

        setTimeout(() => {

            emoji.remove();

        }, 3000);

    }

}

function novoJogo() {

    numeroSecreto = gerarNumero();

    menor = 1;

    maior = maxNumero;

}

function salvar() {

    localStorage.setItem("acertos", acertos);

    localStorage.setItem("recorde", recorde);

    localStorage.setItem("dificuldade", dificuldadeAtual);

}

function reiniciarTudo() {

    acertos = 0;

    tentativas = 0;

    segundos = 0;

    novoJogo();

    mostrar("🔄 Jogo reiniciado");

    salvar();

    atualizarTela();

}

document.getElementById("dificuldade")

.addEventListener("change", (e) => {

    dificuldadeAtual = e.target.value;

    maxNumero =
        dificuldades[dificuldadeAtual].maxNumero;

    maxTentativas =
        dificuldades[dificuldadeAtual].maxTentativas;

    localStorage.setItem(
        "dificuldade",
        dificuldadeAtual
    );

    reiniciarTudo();

});

document.getElementById("jogar")

.addEventListener("click", () => {

    let valor = parseInt(

        document.getElementById("numero").value

    );

    if (

        isNaN(valor) ||

        valor < 1 ||

        valor > maxNumero

    ) {

        mostrar(

            `⚠️ Digite um número de 1 a ${maxNumero}`

        );

        return;

    }

    if (valor > numeroSecreto) {

        tentativas++;

        maior = valor - 1;

        mostrar("📉 O número é menor");

        tocarSom(300);

    }

    else if (valor < numeroSecreto) {

        tentativas++;

        menor = valor + 1;

        mostrar("📈 O número é maior");

        tocarSom(500);

    }

    else {

        tocarSom(900);

        acertos++;

        tentativas = 0;

        menor = 1;

        maior = maxNumero;

        mostrar("✅ Você acertou!");

        numeroSecreto = gerarNumero();

    }

    if (tentativas >= maxTentativas) {

        tocarSom(120);

        mostrar("💀 Você perdeu!");

        tentativas = 0;

        acertos = 0;

        numeroSecreto = gerarNumero();

        menor = 1;

        maior = maxNumero;

    }

    if (acertos >= 5) {

        tocarSom(1200);

        criarConfete();

        mostrar(

            "🏆 PARABÉNS! VOCÊ GANHOU!"

        );

        if (

            recorde === 0 ||

            segundos < recorde

        ) {

            recorde = segundos;

        }

    }

    salvar();

    atualizarTela();

    document.getElementById("numero").value = "";

});

document.getElementById("reiniciar")

.addEventListener("click", () => {

    reiniciarTudo();

});

novoJogo();

atualizarTela();