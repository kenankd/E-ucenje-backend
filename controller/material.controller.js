import db from '../config/db.js';

async function getFile(req, res) {
    try {
        const id = req.params.id;
        const material = await db.Material.findByPk(id, {attributes: ['file']});
        res.setHeader('Content-Type', 'application/octet-stream');
        res.status(200).send(material.file);
    } catch (error) {
        console.log(error  )
        res.status(400).send(error);
    }
}

const materialController = {
    getFile
}

export default materialController;