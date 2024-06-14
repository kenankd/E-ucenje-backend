import db from '../config/db.js';

async function getFile(req, res) {
    try {
        const id = req.params.id;
        const material = await db.Material.findByPk(id, {attributes: ['file']});
        const file=material.file;
        const fileName = material.name + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.status(200).send(file);
    } catch (error) {
        console.log(error  )
        res.status(400).send(error);
    }
}

const materialController = {
    getFile
}

export default materialController;