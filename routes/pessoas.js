const express = require('express');
const router = express.Router();

let listaPessoas = [
    {
        id: 1,
        nome: "Maria",
        idade: 25,
        email: "maria@email.com",
        telefone: "123456789"
    },
    {
        id: 2,
        nome: "João",
        idade: 30,
        email: "joao@email.com",
        telefone: "987654321"
    }
];


function validarPessoa(req, res, next) {
    const id = req.params.id;
    const pessoa = listaPessoas.find(pessoa => pessoa.id == id);
    if (pessoa) {
        res.pessoa = pessoa;
        return next();
    }
    return res.status(404).json({ mensagem: "Pessoa não encontrada!" });
}


function validarAtributos(req, res, next) {
    const dados = req.body;
    if (!dados.nome || !dados.idade || !dados.email || !dados.telefone) {
        return res.status(400).json({ mensagem: "Nome, idade, email e telefone são obrigatórios!" });
    }
    return next();
}

//Buscar todas as pessoas
router.get('/pessoas', (req, res) => {
    res.json(listaPessoas);
});

//Buscar uma pessoa por id
router.get('/pessoas/:id', validarPessoa, (req, res) => {
    res.json(res.pessoa);
});

//Cadastro de uma nova pessoa
router.post('/pessoas', validarAtributos, (req, res) => {
    const dados = req.body;
    const novaPessoa = {
        id: Math.round(Math.random() * 1000),
        nome: dados.nome,
        idade: dados.idade,
        email: dados.email,
        telefone: dados.telefone
    };
    listaPessoas.push(novaPessoa);
    res.status(201).json({ mensagem: "Pessoa cadastrada com sucesso!", pessoa: novaPessoa });
});

//Atualização de uma pessoa existente
router.put('/pessoas/:id', validarAtributos, validarPessoa, (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    const pessoaIndex = listaPessoas.findIndex(pessoa => pessoa.id == id);
    listaPessoas[pessoaIndex] = {
        id: id,
        nome: dados.nome,
        idade: dados.idade,
        email: dados.email,
        telefone: dados.telefone
    };
    res.json({ mensagem: "Pessoa atualizada com sucesso!", pessoa: listaPessoas[pessoaIndex] });
});

//Excluir uma pessoa
router.delete('/pessoas/:id', validarPessoa, (req, res) => {
    const id = req.params.id;
    const pessoaIndex = listaPessoas.findIndex(pessoa => pessoa.id == id);
    listaPessoas.splice(pessoaIndex, 1);
    res.json({ mensagem: "Pessoa excluída com sucesso!" });
});

module.exports = router;
