let bloqueiaAssinatura = false;
let debounceTimeout = null;

// --- FUNÇÃO PARA COLETAR E SALVAR O NOME DO ATENDENTE ---
function coletarNomeAtendente() {
    const chaveNome = "nomeAtendente";
    let nome = localStorage.getItem(chaveNome);

    if (!nome) {
        nome = prompt("Por favor, insira seu nome para a assinatura:");
        if (nome) {
            localStorage.setItem(chaveNome, nome);
            console.log(`✅ Nome "${nome}" salvo com sucesso.`);
        } else {
            console.warn("❌ Nome não fornecido. A assinatura automática será desativada.");
        }
    }
    return nome;
}
const nomeAtendente = coletarNomeAtendente();

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

    if (!caixaDeTexto) {
        console.error("ERRO: A caixa de texto do chat não foi encontrada.");
        return;}

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

