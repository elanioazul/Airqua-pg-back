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
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.username, dbResponse.initials);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).send(successMessage).json({
            message: 'created successfully',
            body: {
                user: {email, username, initials}
            }
        });
    }
    catch (e) {
        console.log(`Something went wrong ${e}`)
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
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.username, dbResponse.initials);
        delete dbResponse.password;
        successMessage.data = dbResponse;
        successMessage.data.token= token;
        return res.status(status.success).send(successMessage);

    } catch (e) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);

    }

}

export async function updateUser(req, res) {
    const id = req.params.id;
    const { email, username, initials, password } = req.body;

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





