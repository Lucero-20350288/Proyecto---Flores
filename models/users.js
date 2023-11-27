const usermodels = {
    getAll: `
        SELECT 
            * 
        FROM 
            flores
    `,
    getByID:`
        SELECT
            *
        FROM
            flores
        WHERE
            id = ?
    `,
    addRow: `
        INSERT INTO
            flores (
                Nombre,
                Altura,
                Duracion,
                Origen,
                Color,
                Perfume,
                Medicina
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)
    `,
    getByUsername: `
        SELECT 
            * 
        FROM
            flores
        WHERE
        Nombre = ?
    `,
    getByEmail: `
        SELECT 
            id 
        FROM
            flores
        WHERE
        Altura = ?
    `,

    /*updateUser: `
        UPDATE
            flores
        SET 
            Nombre = ?,
            Altura = ?,
            
            name = ?,
            Origen = ?,
            Color = ?,
            Medicina = ?
        WHERE
            id = ?
    `,*/

    updateUser: `
        UPDATE 
            flores
        SET 
            Nombre = ?,
            Altura= ?,
            
            Duracion = ?,
            Origen = ?,
            Color = ?,
            Perfume = ?,
            Medicina = ?
        WHERE
            id = ?
`,

    deleteRow: `
    
        DELETE FROM
            flores

        WHERE
            id = ?
            `
}

module.exports = usermodels;