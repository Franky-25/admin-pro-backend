
const { response } = require('express');
const bcrypt = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');


const login = async( req, res = response ) => {

    // Verificar Email
    const { email, password } = req.body;

    try {

        const usuarioBD = await Usuario.findOne({ email })

        if ( !usuarioBD ) {
            return res.status(404).json({
                ok: false   ,
                msg: 'Email no encontrado'
            });
        }

        // Verificar password
        const validarPawword = bcrypt.compareSync( password, usuarioBD.password );
        if ( !validarPawword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password es incorrecto'
            })
        }

        // Generar Token - JWT
        const token = await generarJWT( usuarioBD.id );

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}






module.exports = {
    login
}