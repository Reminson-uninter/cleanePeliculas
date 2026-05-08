import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
//import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



/*const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "cadastro.html"; // redireciona se não estiver logado
  }
});
*/


// 1. Configuração do Firebase (substitua pelos dados reais do seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyCYscoUlfs5HCRXjdV7S2vH7xLtKK0x2qE",
  authDomain: "storm-e0ffe.firebaseapp.com",
  projectId: "storm-e0ffe",
  storageBucket: "storm-e0ffe.appspot.com",
  messagingSenderId: "996090263374",
  appId: "1:996090263374:web:c98da0b93d22a0669e101f",
};

// 2. Inicialização
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadParaCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // substitua pelo nome do seu preset

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dlstpb9oo/image/upload", // substitua dlstpb9oo pelo seu Cloud Name
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url; // URL pública da imagem
}



document.addEventListener("DOMContentLoaded", () => {
  const containerProdutos = document.querySelector(".produtos");
  const listaCarrinho = document.getElementById("lista-carrinho");
  const totalSpan = document.getElementById("total");
  const campoBusca = document.getElementById("campoBusca");

  let carrinho = [];

  // --- Carregar produtos do Firestore ---
  async function carregarProdutos() {
    containerProdutos.innerHTML = "<p>✨ Carregando...</p>";
    const querySnapshot = await getDocs(collection(db, "produtos"));
    containerProdutos.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const dados = docSnap.data();
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-categoria", dados.categoria || "geral");

      card.innerHTML = `
        <img src="${dados.imagem}" alt="${dados.nome}" />
        <h3>${dados.nome}</h3>
        <p>${dados.descricao}</p>
        <span class="preco">R$ ${parseFloat(dados.preco).toFixed(2).replace(".", ",")}</span>
        <button class="btn-adicionar" 
                data-id="${docSnap.id}" 
                data-nome="${dados.nome}" 
                data-preco="${dados.preco}">
          Adicionar ao Carrinho
        </button>
      `;
      containerProdutos.appendChild(card);
    });

    configurarEventosCarrinho();
  }

  // --- Adicionar ao carrinho ---
  function configurarEventosCarrinho() {
    const botoes = document.querySelectorAll(".btn-adicionar");
    botoes.forEach((botao) => {
      botao.onclick = (e) => {
        const { id, nome, preco } = e.target.dataset;
        carrinho.push({ id, nome, preco: parseFloat(preco) });
        atualizarCarrinho();
      };
    });
  }

  // --- Atualizar carrinho ---
  function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
      total += item.preco;
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nome} - R$ ${item.preco.toFixed(2)}
        <button onclick="removerItem(${index})">❌</button>
      `;
      listaCarrinho.appendChild(li);
    });

    if (carrinho.length === 0) {
      listaCarrinho.innerHTML =
        "<li style='color:#999;'>O carrinho está vazio.</li>";
    }

    totalSpan.textContent = total.toFixed(2);
  }

  // --- Remover item ---
  window.removerItem = function (index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
  };

  // --- Limpar carrinho ---
  window.limparCarrinho = function () {
    carrinho = [];
    atualizarCarrinho();
  };

  // --- Finalizar pedido ---
// --- Finalizar pedido ---
window.enviarPedido = async function () {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // Salva pedido no Firestore
  await addDoc(collection(db, "pedidos"), {
    itens: carrinho,
    total: carrinho.reduce((acc, item) => acc + item.preco, 0),
    data: new Date(),
  });

  // Monta mensagem para WhatsApp
  let mensagem = "Olá, Cleane! Gostaria de finalizar meu pedido:%0A";
  carrinho.forEach((item) => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2)})%0A`;
  });
  mensagem += `Total: R$ ${carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}`;

  // Número da Cleane (substitua pelo número real com DDI + DDD + número)
  const numeroWhatsApp = "5573991350755"; // exemplo: 55 + DDD + número

  // Redireciona para WhatsApp
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, "_blank");

  // Limpa carrinho
  carrinho = [];
  atualizarCarrinho();
};


  // --- Filtro de busca ---
  campoBusca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const nome = card.querySelector("h3").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();
      if (nome.includes(termo) || desc.includes(termo)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  carregarProdutos();
});

