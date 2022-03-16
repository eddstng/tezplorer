import { Router } from 'express';
import { getOperationsFromAddressDesc, getOperationsFromAddressDescAfter, getRecentLedgers, getTokensAfter, LedgerParams } from './main';
export const router: Router = Router();

// ========================================================================

router.post("/recent/ledgers", async (req, res) => {
  try {
    const params: LedgerParams = req.body
    res.status(200).send(await getRecentLedgers(params));
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// ========================================================================

router.get('/operations/:address/:relationshipType', async (req, res) => {
  try {
    const relationshipType = req.params.relationshipType
    if (relationshipType !== 'destination' && relationshipType !== 'source') {
      res.status(400).send("Must declare either 'destination' or 'source' as relationshipType. \n `/operations/:address/:relationshipType`")
    } else {
      res.status(200).send(await getOperationsFromAddressDesc(req.params.address, relationshipType));
    }
  } catch (error) {
    console.log(error)
  }
});

router.get('/operations/:address/:relationshipType/after/:cursor', async (req, res) => {
  try {
    const relationshipType = req.params.relationshipType
    if (relationshipType !== 'destination' && relationshipType !== 'source') {
      res.status(400).send("Must declare either 'destination' or 'source' as relationshipType. \n `/operations/:address/:relationshipType`")
    } else {
      res.status(200).send(await getOperationsFromAddressDescAfter(req.params.address, relationshipType, req.params.cursor));
    }
  } catch (error) {
    console.log(error)
  }
});

router.get('/tokens', async (req, res) => {
  try {
    res.status(200).send("unused");
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

router.get('/tokens/after/:cursor', async (req, res) => {
  try {
    res.status(200).send(await getTokensAfter(req.params.cursor));
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


