let bloqueiaAssinatura = false;
let debounceTimeout = null;
let extensaoAtiva = true;

function coletarNomeAtendente() {
    const chaveNome = "nomeAtendente";
    return localStorage.getItem(chaveNome);
}

let nomeAtendente = coletarNomeAtendente();

function criarBotaoConfiguracoes() {
    const botao = document.createElement("button");

    // --- NOVO: Obtém o URL da imagem e cria a tag <img> ---
    const imageUrl = chrome.runtime.getURL("images/nnm.png");
    const imagemBotao = document.createElement("img");
    imagemBotao.src = imageUrl;
    imagemBotao.alt = "Configurações";

    Object.assign(imagemBotao.style, {
        width: "120%",
        height: "120%",
        borderRadius: "50%",
        objectFit: "cover"
    });
    
    // Anexa a imagem ao botão
    botao.appendChild(imagemBotao);
    Object.assign(botao.style, {
        position: "fixed",
        top: "254px",
        left: "15px",
        width: "31px",
        height: "31px",
        borderRadius: "50%",
        // backgroundColor: "rgb(31, 172, 83)", // Cor verde para o botão
        // color: "rgb(255, 255, 255)",
        border: "none",
        cursor: "pointer",
        zIndex: "1000",
        boxShadow: "0 2px 10px rgb(0, 0, 0)",
        transition: "background-color 0.2s, transform 0.1s",
        padding: "0"
    });
    // ajustar os valores de top, bottom, left e right. para mudar de posição:
    // top: "20px", right: "20px": Canto superior direito.
    // top: "20px", left: "20px": Canto superior esquerdo.

    // bottom: "20px", left: "20px": Canto inferior esquerdo
    // bottom: "20px", right: "20px": Canto inferior direito
    botao.addEventListener('mouseenter', () => {
        botao.style.backgroundColor = "rgb(18, 140, 126)"; // Tom de verde mais escuro
    });

    // Efeito de MOUSE LEAVE: ao tirar o mouse
    botao.addEventListener('mouseleave', () => {
        botao.style.backgroundColor = " #25D366"; // Volta para a cor original
    });

    // Efeito de CLICK (mousedown): ao pressionar o botão
    botao.addEventListener('mousedown', () => {
        botao.style.backgroundColor = " #075e54"; // Tom de verde ainda mais escuro
        botao.style.transform = "scale(0.95)"; // Efeito de encolher um pouco
    });
    
    // Efeito de SOLTAR (mouseup): ao soltar o botão
    botao.addEventListener('mouseup', () => {
        botao.style.backgroundColor = " #128C7E"; // Volta para a cor do hover
        botao.style.transform = "scale(1)"; // Volta ao tamanho normal
    });

    botao.onclick = abrirPopupConfiguracoes;
    document.body.appendChild(botao);
    
    // Se o nome não estiver salvo, exibe o popup
    if (!nomeAtendente) {
        abrirPopupConfiguracoes();
    }
}

function abrirPopupConfiguracoes() {
    // Se o popup já estiver aberto, não faz nada
    if (document.getElementById("configPopup")) {
        return;
    }

    // Cria a div do popup
    const popup = document.createElement("div");
    popup.id = "configPopup";
    Object.assign(popup.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "15px",
        // --- EFEITO GLASSMORPHISM ---
        background: "rgba(255, 255, 255, 0.15)", // Fundo semi-transparente
        backdropFilter: "blur(7px)", // Efeito de desfoque (Blur)
        webkitBackdropFilter: "blur(7px)", // Compatibilidade com navegadores baseados em WebKit
        border: "1px solid rgba(255, 255, 255, 0.3)", // Borda branca e fina
        borderRadius: "20px", // Bordas bem arredondadas
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)", // Várias sombras para o efeito

        // backgroundColor: "rgba(6, 61, 113, 0.82)",
        // border: "1px solid #ccc",
        // borderRadius: "8px",
        // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.52)",
        zIndex: "1001",
        minWidth: "200px",
        maxWidth: "300px",
        fontFamily: "sans-serif",
        color: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "visible" // Esconde partes que ultrapassam as bordas
    });
    const style = document.createElement('style');
    style.innerHTML = `
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
        }
        input:checked + .slider {
            background-color: #25D366;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        .slider.round {
            border-radius: 20px;
        }
        .slider.round:before {
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);

    const imageUrl = chrome.runtime.getURL("images/nnm.png");
    // Conteúdo HTML do popup
    popup.innerHTML = `
        <img src="${imageUrl}" alt="Logo NNM" style="
                position: absolute; 
                top: -25px; /* Ajusta a posição vertical */
                left: -25px; /* Ajusta a posição horizontal */
                width: 60px; /* Tamanho da imagem */
                height: 60px; 
                border-radius: 15px; /* Arredonda as bordas da imagem */
                box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* Sombra para destacar */
                // border: 2px solid white;
        ">
        <h3 style="margin-top: 0; color: #25D366; font-size: 21px; font-weight: bold; text-align: center;">Configurações da NNM</h3>
        
        <br>
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <p style="margin-bottom: 5px; font-size: 14px; text-align: center;"><span style="text-decoration: underline;"><em><strong>Nome:</strong></em></span></p>
            <input 
                id="inputNomeAtendente" 
                style="
                    width: 70%;  /* Diminuído o tamanho */
                    padding: 8px; 
                    margin-bottom: 15px; 
                    background-color: #333; 
                    color: #f0f0f0; 
                    border: 1px solid #555; 
                    border-radius: 20px; /* Arredondado a caixa de texto */
                    font-size: 14px;
                    text-align: center; /* Centraliza o texto dentro do input */
                " 
                type="text" 
                value="${nomeAtendente || ''}" 
                placeholder="Seu nome" 
            />
            
            <div style="display: flex; justify-content: space-around; width: 80%; margin-bottom: 20px;">
                <button id="salvarNome" style="
                    /* Estilos do botão 'Salvar' */
                    box-shadow: 4px 12px 14px -7px #3e7327;
                    background: linear-gradient(to bottom, #77b55a 5%, #72b352 100%);
                    background-color: #77b55a;
                    border-radius: 6px;
                    border: 1px solid #4b8f29;
                    display: inline-block;
                    cursor: pointer;
                    color: #ffffff;
                    font-family: Arial, sans-serif; /* Alterei a fonte para algo comum */
                    font-size: 15px;
                    font-weight: bold;
                    padding: 8px 12px;
                    text-decoration: none;
                    text-shadow: 1px 3px 0px #5b8a3c;
                ">Salvar</button>

                <button id="fecharPopup" style="
                    /* Estilos do botão 'Fechar' - Adaptado para o vermelho */
                    box-shadow: 4px 12px 14px -7px #d43b2f;
                    background: linear-gradient(to bottom, #f44336 5%, #c73429 100%);
                    background-color: #f44336;
                    border-radius: 6px;
                    border: 1px solid #9c2820;
                    display: inline-block;
                    cursor: pointer;
                    color: #ffffff;
                    font-family: Arial, sans-serif;
                    font-size: 15px;
                    font-weight: bold;
                    padding: 8px 12px;
                    text-decoration: none;
                    text-shadow: 1px 3px 0px #8b2820;
                ">Fechar</button>
            </div>
        </div>
        
        <hr style="width: 100%; border: 0; border-top: 1px solid #555; margin: 20px 0;" />
        
        <button id="limparConfig" style="
            background-color:rgb(72, 72, 72); 
            color: white; 
            border: none; 
            padding: 5px 10px; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 12px; 
            font-weight: bold;
        ">Limpar Configurações</button>
    `;

    document.body.appendChild(popup);

    // Adiciona os eventos dos botões do popup
    document.getElementById("salvarNome").onclick = function() {
        const novoNome = document.getElementById("inputNomeAtendente").value.trim();
        if (novoNome) {
            localStorage.setItem("nomeAtendente", novoNome);
            nomeAtendente = novoNome;
            alert("Nome salvo com sucesso!");
            fecharPopupConfiguracoes();
        } else {
            alert("Por favor, insira um nome válido.");
        }
    };

    document.getElementById("fecharPopup").onclick = fecharPopupConfiguracoes;

    document.getElementById("limparConfig").onclick = function() {
        if (confirm("Tem certeza que deseja limpar as configurações? \nO popup de nome irá reaparecer na próxima vez.")) {
            localStorage.removeItem("nomeAtendente");
            nomeAtendente = null;
            alert("Configurações limpas.");
            fecharPopupConfiguracoes();
        }
    };
}

function fecharPopupConfiguracoes() {
    const popup = document.getElementById("configPopup");
    if (popup) {
        popup.remove();
    }
}

function dispatchShiftEnter(element) {

    const shiftDown = new KeyboardEvent('keydown', {
        key: 'Shift',
        code: 'ShiftLeft',
        bubbles: true,
        cancelable: true,
        shiftKey: true
    });
    element.dispatchEvent(shiftDown);

    const enterDown = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
        shiftKey: true
    });
    element.dispatchEvent(enterDown);

    const enterUp = new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
        shiftKey: true
    });
    element.dispatchEvent(enterUp);

    const shiftUp = new KeyboardEvent('keyup', {
        key: 'Shift',
        code: 'ShiftLeft',
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(shiftUp);
}

function adicionarAssinatura(caixaDeTexto) {

    if (!caixaDeTexto || !nomeAtendente) {
        console.error("ERRO: A caixa de texto ou o nome do atendente não foram encontrados.");
        if (!nomeAtendente) {
            abrirPopupConfiguracoes();
        }
        return;
    }

    const textoAtual = caixaDeTexto.innerText || caixaDeTexto.textContent;
    // const nomeAtendente = "*kauan*: ";
    const assinaturaCompleta = `*${nomeAtendente}*: `;

    if (!textoAtual.startsWith(assinaturaCompleta)) {
        // document.execCommand('selectAll', false, null);
        // document.execCommand('delete', false, null);
        document.execCommand('insertText', false, assinaturaCompleta);
        dispatchShiftEnter(caixaDeTexto);
        // document.execCommand('insertText', false, textoAtual);

        if (!bloqueiaAssinatura) {
           console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴Está falso!🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴");
           bloqueiaAssinatura = true;
        }else if (bloqueiaAssinatura) {
            console.log("🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢Está verdadeiro!🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢");
        }

        // const textoFinal = nomeAtendente + textoAtual;
        // document.execCommand('insertText', false, textoFinal);
        
        console.log("✅ Assinatura adicionada!");
    } else {
        if (!window.assinaturaExisteLog) {
            console.log("ℹ️ A assinatura já existe. Nenhuma ação foi tomada.");
            window.assinaturaExisteLog = true;
        }}
    
    caixaDeTexto.focus();
}
function anexarEventos() {
    const seletorPrincipal = '#main footer div[role="textbox"]';
    const elementoCaixaDeTexto = document.querySelector(seletorPrincipal);
    if (!elementoCaixaDeTexto) {
        return;
    }
    if (elementoCaixaDeTexto.dataset.eventsAttached === 'true') {
        // Já anexado, não faz nada
        return;
    }
    // elementoCaixaDeTexto.addEventListener("click", () => adicionarAssinatura(elementoCaixaDeTexto));
    // elementoCaixaDeTexto.addEventListener("input", () => adicionarAssinatura(elementoCaixaDeTexto));
    // elementoCaixaDeTexto.addEventListener('keydown', function(event) {
    // if (event.key === 'Enter' && !event.shiftKey) {
    //     event.preventDefault();
    //     // event.stopImmediatePropagation();
    //     adicionarAssinatura(elementoCaixaDeTexto);}
    
    // });

    elementoCaixaDeTexto.addEventListener("click", () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => adicionarAssinatura(elementoCaixaDeTexto), 150);
    });

    // elementoCaixaDeTexto.addEventListener("input", () => {
    //     clearTimeout(debounceTimeout);
    //     debounceTimeout = setTimeout(() => adicionarAssinatura(elementoCaixaDeTexto), 150);
    // });

    elementoCaixaDeTexto.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => adicionarAssinatura(elementoCaixaDeTexto), 150);
        }
    });
    
    elementoCaixaDeTexto.dataset.eventsAttached = 'true';
    console.log("🚀 Script de assinatura pronto e anexado à nova caixa de texto.");
}

const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            anexarEventos();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

anexarEventos();
criarBotaoConfiguracoes();


