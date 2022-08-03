
import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/sockets';
import { GraficaData } from '../classes/grafica';

const router = Router();

const grafica = new GraficaData();


router.get('/grafica', ( req: Request, res: Response  ) => {

    res.json( grafica.getDataGrafica() );

});

router.post('/grafica', ( req: Request, res: Response  ) => {

    const mes      = req.body.mes;
    const unidades = Number( req.body.unidades );

    grafica.incrementarValor( mes, unidades );

    //const server = Server.instance;
    //server.io.emit('mensaje-nuevo', payload );


    res.json( grafica.getDataGrafica() );

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }


    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios',(req: Request, res: Response) => {
    
    const server = Server.instance;
    server.io.fetchSockets().then((sockets) => 
    
    {
        const clients: Object[] = []
        sockets.forEach(socket => clients.push(socket.id));
        res.json({ok: true, clients});}).catch(error =>
        res.json({ok: true, error,}));
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (  req: Request, res: Response ) => {


    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

    
});
export default router;


