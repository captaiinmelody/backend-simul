import AllData from "../models/AllDataModel.js";

export const getData =  async(req, res) => {
    try{
        const link = await AllData.findAll({
            attributes: ['id', 'title', 'links']
        });
        res.json(link);
    }catch(error){
        console.log(error);
    }
}

export const createData = async (req, res) => {
    const {title, links, category, description, comment_count, like} = req.body;
    try {
        const newLink = await AllData.create({ 
            title:title, 
            links: links, 
            category: category,
            description: description,
            comment_count: comment_count, 
            like: like 
        });
        res.status(201).send(newLink);
    } catch (error) {
        res.status(404).json({msg: "Data tidak berhasil dibuat!"})
    }
}