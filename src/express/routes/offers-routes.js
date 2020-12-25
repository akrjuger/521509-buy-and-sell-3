'use strict';

/**
 * Роутер для объявлений. ('/offers')
 *
 * @module /src/express/routes/offers-routes
 */

const path = require(`path`);

const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const multer = require(`multer`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});
const upload = multer({storage});

const API = require(`../api`);

const offersRoutes = new Router();

const api = API.getDefaultAPI();

offersRoutes.get(`/add`, (req, res) => res.render(`pages/offers/new-ticket`));

offersRoutes.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: [body.category]
  };
  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

offersRoutes.get(`/:id`, (req, res) => res.render(`pages/offers/ticket`));
offersRoutes.get(`/edit/:id`, async (req, res) => {
  const [advert, categories] = await Promise.all([api.getOffer(req.params.id), api.getCategories()]);
  res.render(`pages/offers/ticket-edit`, {advert, categories});
});

offersRoutes.get(`/category/:id`, (req, res) => res.render(`pages/offers/category`));

module.exports = offersRoutes;
