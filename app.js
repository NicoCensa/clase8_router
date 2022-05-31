const express = require('express');
const {Router} = express;

const app = express();
const router = Router();

app.get('/', (req, res) => {
    res.send('Este es la pagina directa del server');
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/productos', router);
app.use('/static',express.static('public'));

const data = [
    {id:1, title:'Alicate', price:1100,thumbnail:"https://postimg.cc/FYwvFdDc"},
    {id:2, title:'Correa',price:800,thumbnail:"https://postimg.cc/nCzfvYWB"},
    {id:3, title:'Bandeja de Cesped',price:3300,thumbnail:"https://postimg.cc/4KtgYfS0"}
]

const server = app.listen(8080, () =>{
    console.log('Server Listening...')
})
server.on('error', e=>{
    console.log('Error on server', e)
})

router.get('/', (req,res) => {
    if(Object.entries(req.query).length>0){ //Verifica si hay peticiones especiales (/api/mensajes?name=r1)
        res.json(data.filter(d => d.name == req.query.name))
    }else{
        res.json(data)
    }
})

router.get('/:id', (req,res)=>{
    const id = Number(req.params.id);
    if(isNaN(id)){
        res.status(400)
        res.json({error:'Producto no encontrado'})
        return
    }

    if(id > data.length || id <= 0){
        res.status(400)
        res.json({error:'Producto no encontrado'})
        return
    }
    res.json(data.find(d=>d.id == id))
})

//Se utiliza PostMan para poder agregar el producto (id:4)
router.post('/', (req,res)=>{
    data.push(req.body);
    res.send("Se agrego un nuevo producto");
})


router.delete('/:id',(req,res) =>{
    const id = Number(req.params.id);
    const idToDelete = data.findIndex(d => d.id==id);
    data.splice(idToDelete,1);

    res.send("Eliminado con exito");
})

router.put('/:id',(req,res) =>{
    const id = Number(req.params.id);
    const idToModify = data.findIndex(d => d.id==id);
    data[idToModify]["nuevaPropiedad"] = (req.body.nuevaPropiedad);

    res.send("Se edito el producto");
})

