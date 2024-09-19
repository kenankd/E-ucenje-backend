import db from '../config/db.js';

async function getFile(req, res) {
    try {
        const id = req.params.id;
        const material = await db.Material.findByPk(id, { attributes: ['file'] });
        const file = material.file;
        const fileName = material.name + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.status(200).send(file);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

async function create(req, res) {
    try {
        const { name, type, file, CourseId } = req.body;  // Get the name from the request body     // Get the file from the multipart form-data
        const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
        const fileBuffer = Buffer.from(base64Data, 'base64');
        // Convert the file buffer to a BLOB
        const newMaterial = await db.Material.create({
            name,
            file: fileBuffer,
            type,
            CourseId
        });

        res.status(201).send(newMaterial);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error uploading file');
    }
}

async function deleteMaterial (req, res) {
    try {
        const id = req.params.id;
        await db.Material.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error);
    }
}

const materialController = {
    getFile,
    create,
    deleteMaterial
}

export default materialController;