import pool from '../database/pool'
import {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    generateUserToken
} from '../helpers/validations'

import {
    errorMessage,
    successMessage,
    status
} from '../helpers/status'


export async function getUsers(req, res) {
    const response = await pool.query('SELECT * FROM users')
    console.log(response.rows);
    res.status(200).json(response.rows);
};

export async function getUserbyId(req, res) {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    res.json(response.rows)
 
}

//SIGN UP
export async function createUser(req, res) {
    const { email, username, initials, password } = req.body;
    if (isEmpty(email) || isEmpty(username) || isEmpty(password)) {
        errorMessage.error = 'Email, username and password cannot be empty';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'Enter a valid email';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Password incorrect. It must be more than five (5) characters';
        return res.status(status.bad).send(errorMessage);
    }
    const hashedPassword = hashPassword(password);

    try {
        const { rows } = await pool.query(
            'INSERT INTO users (email, username, initials, password) VALUES ($1, $2, $3, $4) returning *',
             [email, username, initials, hashedPassword]
        );
        const dbResponse = rows[0]
        console.log(dbResponse)
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.username, dbResponse.initials);
        successMessage.message = 'created successfully';
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage)
        // .json({
        //     message: 'created successfully',
        //     body: {
        //         user: {email, username, initials}
        //     }
        // });
    }
    catch (error) {
        if (error.routine === '_bt_check_unique') {
            errorMessage.error = 'User with that email already exist';
            return res.status(status.conflict).send(errorMessage);
        }
        console.log(`Something went wrong ${error}`);
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }

    
    
}

//SIGN IN
export async function siginUser(req, res) {
    const { username, password } = req.body;
    if(isEmpty(username) || isEmpty(password)) {
        errorMessage.error = 'Username or password is missing';
        return res.status(status.bad).send(errorMessage)
    }
    if(!validatePassword(password)) {
        errorMessage.error = 'Please enter a valid  Password';
        return res.status(status.bad).send(errorMessage)
    }
    const signinUserQuery = 'SELECT * FROM users WHERE username = $1';
    try {
        const { rows } = await pool.query(signinUserQuery, [username])
        const dbResponse = rows[0];
        if(!dbResponse) {
            errorMessage.error = 'User with this username does not exist';
            return res.status(status.notfound).send(errorMessage);
        }
        if(!comparePassword(dbResponse.password, password)) {
            errorMessage.error = 'Password provided is incorrect';
            return res.status(status.bad).send(errorMessage)
        }
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.username);
        delete dbResponse.password;
        successMessage.data = dbResponse;
        successMessage.data.token= token;
        return res.status(status.success).send(successMessage);

    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);

    }

}

//SEARCH BY USERNAME
export async function searchUsername(req,res) {
    const { username } = req.params;
    const searchQuery = 'SELECT * FROM users WHERE username = $1 ORDER BY id DESC';
    try {
        const { rows } = await pool.query(searchQuery, [username]);
        const dbResponse = rows;
        if(!dbResponse[0]) {
            errorMessage.error = 'No user with such an username';
            return res.status(status.notfound).send(errorMessage)
        }
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage)

    } catch (error) {
        errorMessage.error = 'Operation was not sucessful';
        return res.status(status.error).send(errorMessage)
    }
}

//solo funciona si recibe todos los params de params y body. ¿cómo hacer para que actue si falta alguno tbn?
export async function updateUserTotal(req, res) {
    const id = req.params.id;
    const { email, username, initials, password } = req.body;
    if (!validatePassword(password)) {
        errorMessage.error = 'Password incorrect. It must be more than five (5) characters';
        return res.status(status.bad).send(errorMessage);
    }
    const response = await pool.query('UPDATE users SET email = $1, username = $2, initials = $3, password = $4 WHERE id = $5', [
        email,
        username,
        initials,
        password,
        id
    ]).catch( err => { console.error(err) } );
    console.log(response);
    res.json({
        message: 'updated successfully',
        body: {
            user: {username, email, initials}
        }
    })
}

export async function deleteUser(req, res) {
    //res.send('Usser deleted: ' + " " + req.params.id)
    const id = req.params.id;
    const response = await pool.query('DELETE FROM users WHERE id = $1', [id])
    console.log(response);
    res.json(`User ${id} deleted succesfully`)
}





