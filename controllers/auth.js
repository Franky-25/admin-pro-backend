
const { response } = require('express');
const bcrypt = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSingIn = async( req, res = response ) => {

    try {
        const { email, name, picture } = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else {
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = '@@';
        }

        // Guardar usuario
        await usuario.save();

         // Generar Token - JWT
         const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            email, name, picture,
            token
        })

    } catch (error) {
        console.log(error);       
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        })
    }

}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    // Generar Token - JWT
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        token
    })
}


module.exports = {
    login,
    googleSingIn,
    renewToken
}