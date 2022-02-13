import { CreateUserProps } from "../controllers/users.controller"
import { db } from "./connect"

function insertUser(user: CreateUserProps) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [user.name, user.surname, user.email, user.password], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

export default {
    insertUser
}