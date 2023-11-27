const {request, response} = require('express');
const bcrypt = require('bcrypt');
const usersModel = require('../models/users');
const pool=require('../db');

const listUsers = async (req = request, res = response) => {
    let conn; 

    try{
        conn = await pool.getConnection();

    const users = await conn.query (usersModel.getAll, (err) => {
        if(err) {
            throw err
        }
    });

    res.json(users);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

const listUserByID = async (req = request, res = response) => {
    const {id} = req.params;

    if(isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn;

    try {
        conn = await pool.getConnection();

        const [user] = await conn.query(usersModel.getByID,[id], (err) => {
            if (err) {
                throw err
            }
        });

        if (!user) {
            res.status(404).json({msg: 'Flower not found'});
            return;
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
const addUser = async (req = request, res = response) => {
    const {
        Nombre,
        Altura,
        
        Duracion,
        Origen,
        Color = '',
        Perfume,
        Medicina = 1
    } =req.body;

    if(!Nombre || !Altura  || !Duracion || !Origen || !Perfume) {
        res.status(400).json({msg: 'Missing information of flower'});
        return;
    }

   

    const user = [
      Nombre,
      Altura,
      
      Duracion,
      Origen,
      Color,
      Perfume,
      Medicina
    ]

    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(
            usersModel.getByUsername,
            [Nombre],
            (err) => {if (err) throw err;}
        );
        if (usernameUser) {
            res.status(409).json({msg: `Flower with Nombre: ${Nombre} already exists`});
            return;
        }
        const [emailUser] = await conn.query(
            usersModel.getByEmail,
            [Altura],
            (err) => {if (err) throw err;}
        );
        if (emailUser) {
            res.status(409).json({msg: `User with Altura ${Altura} already exists`});
            return;
        }


        
        const userAdded = await conn.query(
            usersModel.addRow,
            [...user],
            (err) => {if (err) throw err;
            });

        if (userAdded.affectedRows === 0) throw new Error ({msg: 'Failed to add flower'});
        res.json({msg: 'Flower added successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
const updateUser = async (req, res) => {
  const {
      Nombre,
      Altura,
      Duracion,
      Origen,
      Color,
      Perfume,
      Medicina,
  } = req.body;

const {id} = req.params;
let newUserData=[
  Nombre,
  Altura,
  Duracion,
  Origen,
  Color,
  Perfume,
  Medicina   
];
let conn;
try{
  conn = await pool.getConnection();
const [userExists]=await conn.query(
  usersModel.getByID,
  [id],
  (err) => {if (err) throw err;}
);
if (!userExists || userExists.id_active === 0){
  res.status(404).json({msg:'Flower not found'});
  return;
}

const [usernameUser] = await conn.query(
  usersModel.getByUsername,
  [Nombre],
  (err) => {if (err) throw err;}
);
if (usernameUser){
  res.status(409).json({msg:`Flower with Nombre ${Nombre} already exists`});
  return;
}

const [emailUser] = await conn.query(
  usersModel.getByEmail,
  [Altura],
  (err) => {if (err) throw err;}
);
if (emailUser){
  res.status(409).json({msg:`Flower with Altura ${Altura} already exists`});
  return;
}

const oldUserData = [
  userExists.Nombre,
  userExists.Altura,
  
  userExists.Duracion,
  userExists.Origen,
  userExists.Color,
  userExists.Perfume,
  userExists.Medicina  
];

newUserData.forEach((userData, index)=> {
  if (!userData){
      newUserData[index] = oldUserData[index];
  }
})

const userUpdate = await conn.query(
  usersModel.updateUser,
  [...newUserData, id],
  (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
  throw new Error ('Flower not updated');
}
res.json({msg:'Flower updated successfully'})
}catch (error){
      console.log(error);
      res.status(500).json(error);
  } finally{
      if (conn) conn.end();
  }
}
//////////
const deleteUser = async (req = request, res = response) => {
    let conn;
    const {id} = req.params;

    const idd= parseInt(id);
    console.log(idd);
    try {
        conn = await pool.getConnection();

        const [userExists] = await conn.query(
            usersModel.getByID,
            [idd],
            (err) => {throw err;}
        )
        if (!userExists || userExists.Medicina === 0) {
            res.status(404).json({msg: 'Flower not found'});
            return;
        }

        const userDeleted = await conn.query(
            usersModel.deleteRow,
            [idd],
            (err) => {if (err) throw err;}
        )
        if (userDeleted.affectedRows ===0) {
            throw  Error ({msg: 'Failed to delete flower'})
        };

        res.json({msg: 'Flower deleted successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

const signInUser = async (req = request, res = response) => {
  const {Nombre} = req.body;

  let conn;

  try {
    conn = await pool.getConnection();

    const [user] = await conn.query(
        usersModel.getByUsername,
        [Nombre],
        (err) => {throw err;}
    );
    if (!user || user.Medicina === 0) {
        res.status(404).json({msg: 'Wrong name of flower'});
        return;
    }
console.log(user)
   

    
    delete user.create_at;
    delete user.updated_at;

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
}

module.exports = {listUsers, listUserByID, addUser, updateUser, deleteUser, signInUser};