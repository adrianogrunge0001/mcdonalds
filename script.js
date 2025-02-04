document.addEventListener('DOMContentLoaded', function () {
    const produtosContainer = document.getElementById('produtos');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const categoriaBtns = document.querySelectorAll('.categoria-btn');

    // Modais
    const modalAdicionar = document.getElementById('modal-adicionar');
    const modalCarrinho = document.getElementById('modal-carrinho');
    const closeButtons = document.querySelectorAll('.close');

    let carrinho = [];
    let total = 0;
    let produtoSelecionado = null;
    let quantidade = 1;

    // Dados dos produtos
    const produtos = {
        lanches: [
            {
                id: 1,
                nome: "Big Mac",
                descricao: "Dois hambúrgueres, alface, queijo, molho especial, cebola e picles no pão com gergelim.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=Big+Mac",
                preco: 20.00
            },
            {
                id: 2,
                nome: "McChicken",
                descricao: "Um suculento filé de frango empanado, alface e maionese no pão com gergelim.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=McChicken",
                preco: 15.00
            },
            {
                id: 3,
                nome: "Cheeseburger",
                descricao: "Hambúrguer de carne, queijo, picles, cebola, ketchup e mostarda.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=Cheeseburger",
                preco: 10.00
            }
        ],
        bebidas: [
            {
                id: 4,
                nome: "Coca-Cola",
                descricao: "Refrigerante de cola gelado.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=Coca-Cola",
                preco: 5.00
            },
            {
                id: 5,
                nome: "Suco de Laranja",
                descricao: "Suco natural de laranja.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=Suco+Laranja",
                preco: 7.00
            }
        ],
        sobremesas: [
            {
                id: 6,
                nome: "McFlurry",
                descricao: "Sorvete de baunilha com pedaços de biscoito Oreo.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=McFlurry",
                preco: 8.00
            },
            {
                id: 7,
                nome: "Torta de Maçã",
                descricao: "Torta doce de maçã com canela.",
                imagem: "https://dummyimage.com/150x150/000/fff&text=Torta+Maçã",
                preco: 6.00
            }
        ]
    };

    // Função para carregar os produtos por categoria
    function carregarProdutos(categoria) {
        produtosContainer.innerHTML = '';
        produtos[categoria].forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto');

            const imagem = document.createElement('img');
            imagem.src = produto.imagem;
            imagem.alt = produto.nome;

            const nome = document.createElement('h2');
            nome.textContent = produto.nome;

            const descricao = document.createElement('p');
            descricao.textContent = produto.descricao;

            const preco = document.createElement('p');
            preco.textContent = `R$ ${produto.preco.toFixed(2)}`;
            preco.classList.add('preco');

            const adicionarCarrinhoBtn = document.createElement('button');
            adicionarCarrinhoBtn.textContent = 'Adicionar ao Carrinho';
            adicionarCarrinhoBtn.classList.add('btn-quantidade');
            adicionarCarrinhoBtn.addEventListener('click', () => abrirModalAdicionar(produto));

            produtoDiv.appendChild(imagem);
            produtoDiv.appendChild(nome);
            produtoDiv.appendChild(descricao);
            produtoDiv.appendChild(preco);
            produtoDiv.appendChild(adicionarCarrinhoBtn);

            produtosContainer.appendChild(produtoDiv);
        });
    }

    // Função para abrir o modal de adicionar ao carrinho
    function abrirModalAdicionar(produto) {
        produtoSelecionado = produto;
        quantidade = 1;
        document.getElementById('modal-imagem').src = produto.imagem;
        document.getElementById('modal-nome').textContent = produto.nome;
        document.getElementById('modal-descricao').textContent = produto.descricao;
        document.getElementById('quantidade').textContent = quantidade;
        modalAdicionar.style.display = 'flex';
    }

    // Função para fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modalAdicionar.style.display = 'none';
            modalCarrinho.style.display = 'none';
        });
    });

    // Função para ajustar a quantidade no modal
    document.getElementById('menos').addEventListener('click', () => {
        if (quantidade > 1) {
            quantidade--;
            document.getElementById('quantidade').textContent = quantidade;
        }
    });

    document.getElementById('mais').addEventListener('click', () => {
        quantidade++;
        document.getElementById('quantidade').textContent = quantidade;
    });

    // Função para adicionar produto ao carrinho
    document.getElementById('adicionar-carrinho-modal').addEventListener('click', () => {
        const item = {
            ...produtoSelecionado,
            quantidade,
            preco: produtoSelecionado.preco
        };
        carrinho.push(item);
        total += item.preco * item.quantidade;
        atualizarCarrinho();
        modalAdicionar.style.display = 'none';
    });

    // Função para atualizar o carrinho
    function atualizarCarrinho() {
        listaCarrinho.innerHTML = '';
        carrinho.forEach((item, index) => {
            const itemCarrinho = document.createElement('li');
            itemCarrinho.innerHTML = `
                <span>${item.nome}</span>
                <div class="quantidade-container">
                    <button onclick="ajustarQuantidade(${index}, -1)" class="btn-quantidade">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="ajustarQuantidade(${index}, 1)" class="btn-quantidade">+</button>
                </div>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                <button class="remover" onclick="removerItem(${index})"><i class="fas fa-trash"></i></button>
            `;
            listaCarrinho.appendChild(itemCarrinho);
        });
        totalCarrinho.textContent = total.toFixed(2);
        contadorCarrinho.textContent = carrinho.length;
    }

    // Função para ajustar a quantidade de um item no carrinho
    window.ajustarQuantidade = function (index, delta) {
        const item = carrinho[index];
        item.quantidade += delta;
        if (item.quantidade < 1) item.quantidade = 1;
        total += item.preco * delta;
        atualizarCarrinho();
    };

    // Função para remover um item do carrinho
    window.removerItem = function (index) {
        const item = carrinho.splice(index, 1)[0];
        total -= item.preco * item.quantidade;
        atualizarCarrinho();
    };

    // Função para finalizar o pedido
    finalizarPedidoBtn.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        alert(`Pedido finalizado! Total: R$ ${total.toFixed(2)}`);
        carrinho = [];
        total = 0;
        atualizarCarrinho();
        modalCarrinho.style.display = 'none';
    });

    // Abrir modal do carrinho ao clicar no ícone flutuante
    carrinhoFlutuante.addEventListener('click', () => {
        modalCarrinho.style.display = 'flex';
    });

    // Carregar produtos ao iniciar
    carregarProdutos('lanches');

    // Adicionar eventos aos botões de categoria
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoriaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            carregarProdutos(btn.dataset.categoria);
        });
    });
});