const express = require('express');

const server = express();
server.use(express.json()); // se vamos usar json sempre, usamos essa linha então

const projects = [];
let contador = 0;

server.use((req, res, next) => { // middleware global
    console.log(`Número de requisições feitas: ${contador+=1}`);
    return next();
})

function verificaExistenciaProjeto (req, res, next) { // middleware local
    // vai verificar se o projeto existe
    const existe = projects.find( (item) => {
        if (item.id === req.params.id) {            
            return item;     
        }        
    });  

    if(!existe) {
        return res.status(400).json({ error: 'Esse projeto não existe!' });
    }

    return next();
    
}

server.post('/projects', (req, res) => { // cria um projeto no formato { id: "", title: "", tasks: [] }
    const { id, title } = req.body;    
    projects.push({ id, title, tasks: [] });

    return res.json( projects );
});

server.get('/projects', (req, res) => {  // retorna todos os projetos criados "projects"  
    
    return res.json( projects );
});

server.put('/projects/:id', verificaExistenciaProjeto, (req, res) => {  // altera o title de um projeto  
    const { id } = req.params;
    const { title } = req.body;
    
    projects.find( (item) => {
        if (item.id === id) {
            item.title = title;
           
            return res.json( item );
        } 
        
    });   
    
    //return res.json( projects );
});

server.delete('/projects/:id', (req, res) => {  // deleta o projeto com o id fornecido  
    const { id } = req.params;
    
    projects.find( (item, index) => {
        if (item.id === id) {            
            projects.splice(index, 1);  
            return res.send( `Projeto ${item.title} removido com sucesso` );          
        } 
        
    });           

});

server.put('/projects/:id/tasks', (req, res) => {  // criando tasks de um projeto  
    const { id } = req.params; // id do projeto
    const { title } = req.body; // title da task
    
    projects.find( (item) => {
        if (item.id === id) {
            item.tasks.push(title);
            
            return res.json( item );
        } 
        
    });   
    
});

server.listen(3001); // localhost:3001