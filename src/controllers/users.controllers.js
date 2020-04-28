import pool from '../database/pool'



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

export async function createUser(req, res) {
    const { email, username, initials, password } = req.body;
    try {
        const response = await pool.query(
            'INSERT INTO users (email, username, initials, password) VALUES ($1, $2, $3, $4)',
             [email, username, initials, password]
        );
        console.log(response);
        res.json({
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

export async function updateUser(req, res) {
    const id = req.params.id;
    const { email, username, initials, password } = req.body;
    //console.log(id, name, email);
    //res.send('User updated')
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





