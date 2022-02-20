import { Router } from 'express';
import { getAddressOperations } from './main';
export const router: Router = Router();

router.get('/:address', async (req, res) => {
  try {
    res.status(200).send(await getAddressOperations(req.params.address));
  } catch (error) {
    console.log(error)
  }
});

router.post("/", (req, res) => {
  res.status(200).send({
    message: "POST request from main router"
  });
});

router.put("/", (req, res) => {
  res.status(200).send({
    message: "PUT request from main router"
  });
});

router.delete("/", (req, res) => {
  res.status(200).send({
    message: "DELETE request from main router"
  });
});


