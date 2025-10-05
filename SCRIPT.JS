
const OMDb_API_KEY = "404a9d8f"; 

class Fila {
    constructor() {
        this.itens = []; 
    }

    entrarNaFila(nomeDaPessoa) {
        this.itens.push(nomeDaPessoa);
    }

    estaVazia() {
        return this.itens.length === 0;
    }

    async chamarParaSessao() {
        if (this.estaVazia()) {
            return { nome: "A fila está vazia!", filme: null };
        }
        
        
        const nomeDaPessoa = this.itens.shift(); 
        
        const filmeAtribuido = await buscarFilmeAleatorio();
        
        return { 
            nome: nomeDaPessoa, 
            filme: filmeAtribuido 
        };
    }
}


const filaCinema = new Fila();

const generos = ["action", "comedy", "horror", "drama", "thriller", "animation"];

async function buscarFilmeAleatorio() {
    const generoAleatorio = generos[Math.floor(Math.random() * generos.length)];
    const urlBuscaLista = `https://www.omdbapi.com/?s=${generoAleatorio}&type=movie&apikey=${OMDb_API_KEY}`;

    try {
        const listaResponse = await fetch(urlBuscaLista);
        const listaData = await listaResponse.json();

        if (listaData.Response === "True") {
            const filmesEncontrados = listaData.Search;
            const filmeSorteado = filmesEncontrados[Math.floor(Math.random() * filmesEncontrados.length)];
            
            
            const urlBuscaDetalhes = `https://www.omdbapi.com/?i=${filmeSorteado.imdbID}&apikey=${OMDb_API_KEY}`;
            const detalhesResponse = await fetch(urlBuscaDetalhes);
            return await detalhesResponse.json();
        }
        return null;
        
    } catch (error) {
        console.error("Erro na OMDb:", error);
        return null;
    }
}

async function gerarNomeAleatorio() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const nomeCompleto = `${data.results[0].name.first} ${data.results[0].name.last}`;
        
        filaCinema.entrarNaFila(nomeCompleto); 
        
    } catch (error) {
        console.error("Erro ao gerar nome:", error);
    }
}



const atualizarFila = () => {
    const listaFilaUl = document.getElementById('lista-fila');
    const nomesNaFila = filaCinema.itens; 
    const contador = document.getElementById('contador-fila');
    
    contador.textContent = nomesNaFila.length;

    const itensListaHtml = nomesNaFila.map((nome, index) => {
        return `<p class="item-fila">${index + 1}. ${nome}</p>`; // Usando <p> para estilo
    });
    
    listaFilaUl.innerHTML = itensListaHtml.join('');
};

function adicionarAoHistorico(resultado) {
    const listaHistoricoUl = document.getElementById('lista-historico');
    const itemHistorico = document.createElement('li');

    itemHistorico.innerHTML = `
        <strong>${resultado.nome}</strong> assistiu a 
        *${resultado.filme.Title}* (${resultado.filme.Year})
    `;
    
    listaHistoricoUl.prepend(itemHistorico);
}



const botaoSessao = document.getElementById('btn-entrar-sessao');
const detalhesSessaoDiv = document.getElementById('detalhes-sessao');
const botaoPopular = document.getElementById('btn-popular-fila');


botaoSessao.addEventListener('click', async () => {
    const resultado = await filaCinema.chamarParaSessao(); 

    if (resultado.filme) {
        
        const htmlSessao = `
            <h3>🥳 ${resultado.nome} entrou na Sessão!</h3>
            <div class="card-filme">
                <img src="${resultado.filme.Poster}" alt="Pôster do Filme" class="poster-filme">
                <div>
                    <h4>${resultado.filme.Title} (${resultado.filme.Year})</h4>
                    <p>Gênero: ${resultado.filme.Genre}</p>
                    <p class="plot">${resultado.filme.Plot.substring(0, 150)}...</p>
                </div>
            </div>
        `;
        detalhesSessaoDiv.innerHTML = htmlSessao;
        
    
        adicionarAoHistorico(resultado); 

    } else {
        
        detalhesSessaoDiv.innerHTML = `<p>${resultado.nome}</p>`;
    }

    atualizarFila(); 
});

botaoPopular.addEventListener('click', async () => {
    const numPessoas = 5; 

    for (let i = 0; i < numPessoas; i++) {
        await gerarNomeAleatorio(); 
    }
    
    atualizarFila();
});

(async () => {
    
    for (let i = 0; i < 3; i++) {
        await gerarNomeAleatorio(); 
    }
    atualizarFila();
})();