
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCYscoUlfs5HCRXjdV7S2vH7xLtKK0x2qE",
  authDomain: "storm-e0ffe.firebaseapp.com",
  projectId: "storm-e0ffe",
  storageBucket: "storm-e0ffe.appspot.com",
  messagingSenderId: "996090263374",
  appId: "1:996090263374:web:c98da0b93d22a0669e101f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configurações Cloudinary
const CLOUD_NAME = "dvunnmetj";
const UPLOAD_PRESET = "uploadPreset";

// Upload para Cloudinary
async function uploadParaCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url; // sempre usar esse campo
}

// Referências
const form = document.getElementById("cadastrar");
const corpoTabela = document.getElementById("corpo-tabela");
let editandoId = null;

// CREATE / UPDATE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = form.nome.value;
  const descricao = form.descricao.value;
  const preco = parseFloat(form.preco.value);
  const estoque = parseInt(form.estoque.value);
  const imagemFile = form.imagem.files[0];

  let imageUrl = "";

  if (imagemFile) {
    imageUrl = await uploadParaCloudinary(imagemFile);
  }

  if (editandoId) {
    const ref = doc(db, "produtos", editandoId);

    // Cria objeto de atualização
    const dadosAtualizados = {
      nome,
      descricao,
      preco,
      estoque
    };

    // Se houver nova imagem, atualiza; senão mantém a antiga
    if (imageUrl) {
      dadosAtualizados.imagem = imageUrl;
    } else {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
         dadosAtualizados.imagem = docSnap.data().imagem || "https://via.placeholder.com/80";
      }
    }

    await updateDoc(ref, dadosAtualizados);
    alert("Produto atualizado!");
    editandoId = null;
  } else {
    // CREATE
    await addDoc(collection(db, "produtos"), {
      nome,
      descricao,
      preco,
      estoque,
      imagem: imageUrl || "https://via.placeholder.com/80" // salva a imagem padrão se não houver imagem
    });
    alert("Produto cadastrado!");
  }

  form.reset();
});

// READ em tempo real
onSnapshot(collection(db, "produtos"), (snapshot) => {
  corpoTabela.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const produto = docSnap.data();
    corpoTabela.innerHTML += `
      <tr>
        <td>${docSnap.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.descricao}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td><img src="${produto.imagem || 'https://via.placeholder.com/80'}" width="80"></td>

        <td>
          <button onclick="editarProduto('${docSnap.id}', '${produto.nome}', '${produto.descricao}', ${produto.preco}, ${produto.estoque})">Editar</button>
          <button onclick="deletarProduto('${docSnap.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
});

// UPDATE (preencher formulário)
window.editarProduto = function (id, nome, descricao, preco, estoque) {
  form.nome.value = nome;
  form.descricao.value = descricao;
  form.preco.value = preco;
  form.estoque.value = estoque;
  editandoId = id;
};

// DELETE
window.deletarProduto = async function (id) {
  await deleteDoc(doc(db, "produtos", id));
  alert("Produto excluído!");
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCYscoUlfs5HCRXjdV7S2vH7xLtKK0x2qE",
  authDomain: "storm-e0ffe.firebaseapp.com",
  projectId: "storm-e0ffe",
  storageBucket: "storm-e0ffe.appspot.com",
  messagingSenderId: "996090263374",
  appId: "1:996090263374:web:c98da0b93d22a0669e101f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configurações Cloudinary
const CLOUD_NAME = "dvunnmetj";
const UPLOAD_PRESET = "uploadPreset";

// Upload para Cloudinary
async function uploadParaCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url; // sempre usar esse campo
}

// Referências
const form = document.getElementById("cadastrar");
const corpoTabela = document.getElementById("corpo-tabela");
let editandoId = null;

// CREATE / UPDATE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = form.nome.value;
  const descricao = form.descricao.value;
  const preco = parseFloat(form.preco.value);
  const estoque = parseInt(form.estoque.value);
  const imagemFile = form.imagem.files[0];

  let imageUrl = "";

  if (imagemFile) {
    imageUrl = await uploadParaCloudinary(imagemFile);
  }

  if (editandoId) {
    const ref = doc(db, "produtos", editandoId);

    // Cria objeto de atualização
    const dadosAtualizados = {
      nome,
      descricao,
      preco,
      estoque
    };

    // Se houver nova imagem, atualiza; senão mantém a antiga
    if (imageUrl) {
      dadosAtualizados.imagem = imageUrl;
    } else {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
         dadosAtualizados.imagem = docSnap.data().imagem || "https://via.placeholder.com/80";
      }
    }

    await updateDoc(ref, dadosAtualizados);
    alert("Produto atualizado!");
    editandoId = null;
  } else {
    // CREATE
    await addDoc(collection(db, "produtos"), {
      nome,
      descricao,
      preco,
      estoque,
      imagem: imageUrl || "https://via.placeholder.com/80" // salva a imagem padrão se não houver imagem
    });
    alert("Produto cadastrado!");
  }

  form.reset();
});

// READ em tempo real
onSnapshot(collection(db, "produtos"), (snapshot) => {
  corpoTabela.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const produto = docSnap.data();
    corpoTabela.innerHTML += `
      <tr>
        <td>${docSnap.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.descricao}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td><img src="${produto.imagem || 'https://via.placeholder.com/80'}" width="80"></td>

        <td>
          <button onclick="editarProduto('${docSnap.id}', '${produto.nome}', '${produto.descricao}', ${produto.preco}, ${produto.estoque})">Editar</button>
          <button onclick="deletarProduto('${docSnap.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
});

// UPDATE (preencher formulário)
window.editarProduto = function (id, nome, descricao, preco, estoque) {
  form.nome.value = nome;
  form.descricao.value = descricao;
  form.preco.value = preco;
  form.estoque.value = estoque;
  editandoId = id;
};

// DELETE
window.deletarProduto = async function (id) {
  await deleteDoc(doc(db, "produtos", id));
  alert("Produto excluído!");
};
