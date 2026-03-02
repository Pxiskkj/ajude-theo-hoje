require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const path = require("path");

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.use(cors());
app.use(express.json());
app.post("/tracking/v1/events", (req, res) => {
  return res.status(200).json({ received: true });
});
app.post("/criar-pagamento", async (req, res) => {
  try {
    const { valor } = req.body;

    const response = await axios.post(
  "https://api.pluggoutech.com/api/transactions",
  {
    amount: valor * 100,
    currency: "BRL",
    payment_method: "pix", // ou "credit_card" se for cartão

    buyer: {
      buyer_name: "Doador Anônimo",
      buyer_document: "12345678909", // CPF válido (apenas números)
      buyer_phone: "11999999999"
    },

    description: "Doação Ajude Theo"
  },
  {
    headers: {
      "Content-Type": "application/json",
      "X-Public-Key": process.env.PLUGGOU_PUBLIC_KEY,
      "X-Secret-Key": process.env.PLUGGOU_SECRET_KEY,
    },
  }
);

    return res.json(response.data);

  } catch (error) {
    console.log("ERRO COMPLETO:");
    console.log(error.response?.data || error.message);
    return res.status(500).json({ error: "Erro ao gerar pagamento" });
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});