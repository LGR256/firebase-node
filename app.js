const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require('./firebase.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.get("/consulta", function(req, res) {
    var agendamentosRef = db.collection('agendamentos');
    agendamentosRef.get()
        .then(function(querySnapshot) {
            var agendamentos = [];
            querySnapshot.forEach(function(doc) {
                agendamentos.push(doc.data());
            });
            res.render("consulta", {agendamentos});
            console.log(agendamentos);
        })
        .catch(function(error) {
            console.log("Erro ao carregar dados do banco: " + error);
        });
});

/*
app.get("/consulta", function(req, res){
    var result = db.collection('agendamentos').get().then(function(post){
        res.render("consulta", {post})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})*/

app.get("/editar/:id", function(req, res){
})

app.get("/excluir/:id", function(req, res){
})

app.get("/excluir/:id", function(req, res) {
    var id = req.params.id;
    var agendamentosRef = db.collection('agendamentos').doc(id);
    agendamentosRef.delete()
        .then(function() {
            console.log("Documento excluído com sucesso!");
            res.sendStatus(204);
        })
        .catch(function(error) {
            console.log("Erro ao excluir documento: " + error);
            res.sendStatus(500);
        });
});

app.post("/cadastrar", function(req, res){
    var result = db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log('Adicionado');
        res.redirect('/')
    })
})

app.post("/atualizar", function(req, res){
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})