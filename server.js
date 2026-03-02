require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html

app.post("/criar-pagamento", async (req, res) => {
  try {
    const { valor } = req.body;

    const response = await axios.post(
      "https://api.pluggoucash.com/v1/payments",
      {
        amount: valor,
        description: "Doação - Ajude Theo",
        payment_method: "pix"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PLUGOU_PRIVATE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});