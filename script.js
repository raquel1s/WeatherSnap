const data = new Date();

const cidadeInput = document.getElementById('buscarCidadeInput');
const btnBuscar = document.getElementById('btnBuscar');
const btnInicio = document.getElementById('inicio');
const sessaoPrincipal = document.getElementById('dadosClima');

if(horario()){
    const fundo = document.getElementsByClassName('bg-blue-500');
    const componentesPrimarios = document.getElementsByClassName('bg-blue-400');
    const ComponentesSecundarios = document.getElementsByClassName('bg-blue-300');

    Array.from(fundo).forEach(componente => {
        componente.classList.add('bg-blue-900');
    });

    Array.from(componentesPrimarios).forEach(componente => {
        componente.classList.add('bg-blue-800');
    });

    Array.from(ComponentesSecundarios).forEach(componente => {
        componente.classList.add('bg-blue-600');
    });
}

btnBuscar.addEventListener('click', async () => {
    const cidade = cidadeInput.value.trim();
    cidadeInput.value = '';

    const clima = await buscarClima(cidade);
    const previsoes = await buscarProximosDias(cidade);
    carregarTela(clima, previsoes);
});

cidadeInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const cidade = cidadeInput.value.trim();
        cidadeInput.value = '';

        const clima = await buscarClima(cidade);
        const previsoes = await buscarProximosDias(cidade);
        carregarTela(clima, previsoes);
        console.log(horario());
    }
});

btnInicio.addEventListener('click', () => {
    sessaoPrincipal.textContent = '';
});


async function buscarClima(cidade) {
    const apiKey = "d1a4a82232e09784c416df13e92668ec";

    try {
        const resultado = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`);
        if (!resultado.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resultado.json();
        console.log(dados);
        return dados;
    } catch (erro) {
        console.error("Erro capturado:", erro.message);
    }
}

async function buscarProximosDias(cidade) {
    const apiKey = "d1a4a82232e09784c416df13e92668ec";

    try {
        const resultado = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`);
        if (!resultado.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resultado.json();
        const previsoes = [];
        const hora = "15:00:00";

        for (let dia of dados.list) {
            const dataDia = new Date(dia.dt_txt);
            const diferencaDia = (dataDia.getDate() - data.getDate());
            const horaDia = dia.dt_txt.split(' ')[1];

            if (diferencaDia > 0 && diferencaDia <= 3 && horaDia == hora) {
                previsoes.push(dia);
            }
        }

        console.log(previsoes);
        return previsoes;
    } catch (erro) {
        console.error("Erro capturado:", erro.message);
    }
}

function dataAtual() {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    const diaSemana = encontrarDiaSemana(data.getDay());
    const dia = data.getDate();
    const mes = meses[data.getMonth()];

    return `${diaSemana}, ${dia} De ${mes}`;
}

function encontrarDiaSemana(diaSemana) {
    const diasSemana = [
        "Domingo", "Segunda", "Terça", "Quarta",
        "Quinta", "Sexta", "Sábado"
    ];

    return diasSemana[diaSemana];
}

function carregarTela(dados, previsoes) {
    sessaoPrincipal.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between mx-8 mt-6">
            <div class="flex flex-row gap-2">
                <h2 class="font-bold text-2xl">${dados.name},</h2>
                <h2 class="font-bold text-2xl">${dados.sys.country}</h2>
            </div>
            <div>
                <p>${dataAtual()}</p>
            </div>
        </div>
        <div class="mx-8">
            <div class="flex flex-row justify-center items-center">
                <img src="https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png">
                <h2 class="font-bold text-4xl">${dados.main.temp.toFixed()}°C</h2>
            </div>
            <div class="flex flex-col justify-center items-center gap-2">
                <h3 class="font-semibold">${dados.weather[0].description}</h3>
                <div class="flex flex-row justify-evenly gap-3">
                    <div class="flex flex-row items-center gap-2">
                        <i class="fa-solid fa-wind"></i>
                        <p>${dados.wind.speed} km/h</p>
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <i class="fa-solid fa-droplet"></i>
                        <p>${dados.main.humidity}%</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="mensagem" class="mx-8 my-4 py-4 px-4 max-w-2.5 text-center">
        </div>
        <div class="mx-8 my-8">
            <h3 class="font-semibold">Próximos dias</h3>
            <div id="previsao" class="flex flex-row items-center justify-center gap-4 mt-3">
            </div>
        </div>
    `;

    mensagemDoDia(dados.weather[0].main);
    carregarCads(previsoes);
}

async function carregarCads(dados) {
    const previsoes = document.getElementById('previsao');

    for (let dia of dados) {
        const card = document.createElement('div');

        if(horario()){
            card.classList.add('bg-blue-600');
        }else{
            card.classList.add('bg-blue-300');
        }

        card.classList.add('flex', 'flex-col', 'items-center', 'p-2', 'flex-1');

        const semana = new Date(dia.dt_txt);
        const diaSemana = document.createElement('h4');
        diaSemana.textContent = encontrarDiaSemana(semana.getDay());
        diaSemana.classList.add('font-semibold', 'text-sm', 'md:text-base');
        card.appendChild(diaSemana);

        const icone = document.createElement('img');
        icone.src = `https://openweathermap.org/img/wn/${dia.weather[0].icon}@2x.png`;
        icone.classList.add('h-16', 'w-16');
        card.appendChild(icone);

        const temp = document.createElement('p');
        temp.textContent = `${dia.main.temp.toFixed()}°C`;
        temp.classList.add('font-semibold');
        card.appendChild(temp);

        previsoes.appendChild(card);
    }
}

async function mensagemDoDia(principal) {
    let descricao = '';
    const mensagemDiv = document.getElementById('mensagem');

    if(horario()){
        mensagemDiv.classList.add('bg-blue-600');
    }else{
        mensagemDiv.classList.add('bg-blue-300');
    }

    if (principal == 'Clear') {
        descricao = "O dia está ensolarado e sem nuvens. Aproveite para sair e desfrutar de atividades ao ar livre!";
    } else if (principal == 'Clouds') {
        descricao = "O céu está nublado hoje. Pode ser um bom dia para um passeio ou uma atividade interna.";
    } else if (principal == 'Rain') {
        descricao = "Chuva forte hoje. Melhor ficar em casa ou se for sair, não se esqueça do guarda-chuva!";
    } else if (principal == 'Drizzle') {
        descricao = "A garoa está suave, mas é bom ter um guarda-chuva por perto!";
    } else if (principal == 'Thunderstorm') {
        descricao = "Cuidado, uma tempestade com raios está chegando! Fique em um local seguro.";
    } else if (principal == 'Snow') {
        descricao = "Hoje está nevando, uma bela paisagem de inverno! Prepare-se para o frio e se agasalhe bem.";
    } else if (principal == 'Mist') {
        descricao = "O dia começa com uma névoa leve. Dirija com cuidado e evite locais com baixa visibilidade.";
    } else {
        return;
    }

    const mensagem = document.createElement('p');
    mensagem.textContent = descricao;
    mensagemDiv.appendChild(mensagem);
}

function horario(){
    const horas = data.getHours();
    return horas >= 18 || horas < 5;
}