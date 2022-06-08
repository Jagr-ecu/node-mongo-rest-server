const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields } = require('../middlewares/validations')
const { userGet,
        userPost, 
        userPut, 
        userDelete } = require('../controllers/users')
const { isRoleValid, emailExists, userExistsByID } = require('../helpers/db-validators')

const router = Router();

router.get('/', userGet )

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsByID),
    check('role').custom(isRoleValid),
    validateFields
] , userPut )

router.post('/',[
    check('email', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria y mas de 6 letras').isLength({ min: 6 }),
    check('email').custom(emailExists),
    //No se lo usa porque se valida con datos quemados, abajo se valida con datos de la bd
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isRoleValid),//.custom(role => isRoleValid(role))
    validateFields    
] , userPost )//(ruta, middleware, funcion)

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsByID),
    validateFields
], userDelete )

module.exports = router;