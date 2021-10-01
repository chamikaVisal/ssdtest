var express = require('express')
var router = express.Router();
const Admins = require('../models/Admins')
const Package = require('../models/Package')


/*
    method : POST
    description : create new admin
    params : Body {
        username,password,
    }
*/
router.post('/create', (req, res) => {

    const admin = new Admins({
        username: req.body.username,
        password: req.body.password,

    })
    admin.save().then(adm => {
        console.log("admin Added")
        try {
            res.status(200).send({
                message: 'admin created successfully !',
                data: adm
            })

        } catch (err) {
            res.status(502).send({
                message: 'OOPS ! server error',
                error: err
            })
        }

    })
})

/*
    method : POST
    description : admin login
    params : Body {
        email,password
    }
*/
router.post('/adminLogin', (req, res) => {
    Admins.findOne({
        username: req.body.username,
        password: req.body.password
    }).then(adm => {
        if (adm) {
            console.log("found")
            res.send({
                message: 'successfully logged in ',
                data: adm,
                messageCode: "1000"
            })
        }
        else {
            console.log(" not found")
            res.send({
                message: 'Invalid admin credentials',
                data: adm,
                messageCode: "1001"
            })
        }

    })
})

/*
    method : POST
    description : create new travelpackage
    params : Body {
        package name,destination,noofdays,cost
    }
*/
router.post('/createPackage', (req, res) => {

    const pack = new Package({
        packageName: req.body.packageName,
        destination: req.body.destination,
        days: req.body.days,
        cost: req.body.cost

    })
    pack.save().then(pkg => {
        console.log("package Added")
        try {
            res.status(200).send({
                message: 'package created successfully !',
                data: pkg,
                messageCode: "1000"
            })

        } catch (err) {
            res.status(502).send({
                message: 'OOPS ! server error',
                error: err
            })
        }

    })
})

/*
    method : GET
    description : get all package details
  
*/
router.get('/getAllPackages', (req, res) => {
    const pkg = Package.find().then(pkgs => {
        res.send(pkgs);
    })
    console.log(pkg)
})



/*
    method : PUT
    description : UPDATE travelpackage
    params : Body {
        package name,destination,noofdays,cost
    }
*/

router.put('/updatePackage/:id', (req, res) => {
    var id = req.params.id;
    Package.findOne({ _id: id }).then(pkg => {
        if (Package) {
            console.log("found package")

            pkg.packageName = req.body.packageName,
                pkg.destination = req.body.destination,
                pkg.days = req.body.days,
                pkg.cost = req.body.cost

            pkg.save()
            res.status(200).send({
                message: 'Package updated successfully !',
                messageCode: '1000',
                data: pkg
            })


        }
    })

})

/*
method : DELETE
    description : delete package by id
*/
router.delete('/deletePackage/:id', (req, res) => {

    Package.findById(req.params.id).then(pkg => {
        if (pkg) {
            pkg.remove();
            res.send(
                {
                    message: pkg.packageName + ' package was deleted successfully',
                    data: pkg
                }
            )
        }
        else {
            res.send({
                message: "No such package"
            })
        }

    }).catch(err => {
        res.send(err)
    })
})


/*
method : GET
    description : search package by packagenName
*/
router.get('/getbyPackageName/:Name', (req, res) => {
    Package.findOne({
        packageName: req.params.Name
    }).then(pkg => {


        try {
            res.status(200).send({
                message: 'Employee retrived successfully ok !',
                data: pkg
            })

        } catch (err) {
            res.status(502).send({
                message: 'OOPS ! server error',
                error: err
            })
        }

    })
})
module.exports = router;