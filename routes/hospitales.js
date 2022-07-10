/*
    Hospitales
    ruta: /api/hospitales

*/

const { Router } = require('express');
const { check } = require ('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar_jwt');

const { getHopstales,
        crearHospital,
        actualizarHospital,
        borrarHospital} = require('../controllers/hospitales')

const router = Router();

    router.get( '/', getHopstales );

    router.post( '/',
        [ 
            validarJWT,
            check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
            validarCampos
        ],
        crearHospital
    );

    router.put( '/:id',
        [ 
            validarJWT,
            check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
            validarCampos
        ],
        actualizarHospital );

    router.delete( '/:id',
        validarJWT,
        borrarHospital );







module.exports = router;