const path = require("path");
const Ajv = require("ajv").default;
const CategoriesDao = require("../../dao/categories-dao");
const ajv = new Ajv({ coerceTypes: true });
require("ajv-keywords")(ajv);
let dao = new CategoriesDao();

let schema = {
    "type": "object",
    "properties": {
        "id": { "type": "number" },
    },
    "required": ["id"]
};

async function GetAbl(req, res) {
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);

    if (valid) {
        try {
            const recipe = await dao.GetCategory(body.id);
            
            res.status(200).send(recipe);
        } catch (error) {
            res.status(400).send(
                { errorMessage: "Nečekaná chyba."}
            );
        }
    }
    else {
        res.status(400).send({
            errorMessage: "Nepodařilo se splnit požadavek.",
            params: req.body,
            reason: ajv.errors
        })
    }
}

module.exports = GetAbl;